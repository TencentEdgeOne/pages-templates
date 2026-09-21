// Import utilities
import { nebius_query, replicate_query, fal_query, fal_queue_query, openai_query, processApiResponse } from './fetch_utils.js';
import { checkSensitiveContent } from './nfsw_limit.js';
import { checkRateLimit, createRateLimitResponse } from './rate_limit.js';



/** @param {import('@edgeone/types').CloudFunctionContext} context */
export async function onRequest({ request, params, env }) {
  try {
    const eo = request.eo;
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    // Only parse JSON when method is POST and Content-Type is application/json
    let body = {};
    if (request.method === 'POST' && request.headers.get('content-type')?.includes('application/json')) {
      try {
        body = await request.json();
      } catch (parseErr) {
        throw new Error('Failed to parse request JSON');
      }
    }
    console.log('Incoming request:', body);
    
    // // Check rate limit
    // const userKey = `${eo.clientIp}`;
    // const rateLimitResult = await checkRateLimit(userKey, env, 10);
    // if (!rateLimitResult.allowed) {
    //   return createRateLimitResponse(rateLimitResult.error);
    // }
    
    // Get prompt text from request
    const prompt = body.image || "一幅美丽的风景画";
    
    // Check for sensitive content using the utility function
    const { hasSensitive } = checkSensitiveContent(prompt);
    if (hasSensitive) {
      return new Response(JSON.stringify({ error: 
        "Sorry, we don't support generating NSFW content." }), {
        status: 400,
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    // Use front-end passed model value
    const model = body.model || "stability-ai/sdxl";
    
    // Model configuration mapping
    const modelConfigs = {
      'fal-hidream-i1-full': {
        url: 'https://queue.fal.run/fal-ai/hidream-i1-full',
        platform: 'fal'
      },
      'fal-fast-sdxl': {
        url: 'https://queue.fal.run/fal-ai/fast-sdxl',
        platform: 'fal'
      }
      // Add more FAL models here as needed
    };
    
    // Token validation for different platforms
    const validateToken = (platform) => {
      const tokens = {
        'nebius': env.NEBIUS_TOKEN,
        'huggingface': env.HF_TOKEN,
        'replicate': env.REPLICATE_TOKEN,
        'openai': env.OPENAI_API_KEY,
        'fal': env.FAL_KEY
      };
      
      if (!tokens[platform]) {
        throw new Error(`${platform} API token is not configured. Please check your environment variables.`);
      }
    };
    
    const handlers = {
      'black-forest-labs/flux-schnell': () => {
        validateToken('nebius');
        return nebius_query({
          response_format: 'b64_json',
          prompt,
          model,
        }, 'https://api.studio.nebius.com/v1/images/generations');
      },
      'stability-ai/sdxl': () => {
        validateToken('nebius');
        return nebius_query({
          response_format: 'b64_json',
          prompt,
          model,
        }, 'https://api.studio.nebius.com/v1/images/generations');
      },
      'nerijs/pixel-art-xl': () => {
        validateToken('huggingface');
        return fal_query({
          prompt,
        }, 'https://router.huggingface.co/fal-ai/fal-ai/fast-sdxl');
      },
      'ByteDance/Hyper-SD': () => {
        validateToken('replicate');
        return replicate_query({
          input: { prompt },
        }, 'https://router.huggingface.co/replicate/v1/predictions');
      },
      'HiDream-ai/HiDream-I1-Full': () => {
        validateToken('huggingface');
        return fal_query({ prompt }, 'https://router.huggingface.co/fal-ai/fal-ai/hidream-i1-full');
      },
      'stabilityai/sdxl-turbo': () => {
        validateToken('replicate');
        return replicate_query({
          input: { prompt },
        }, 'https://router.huggingface.co/replicate/v1/models/jyoung105/sdxl-turbo/predictions');
      },
      'google/imagen-4': () => {
        validateToken('replicate');
        return replicate_query({
          input: { prompt },
        }, 'https://api.replicate.com/v1/models/google/imagen-4/predictions');
      },
      'flux-1.1-pro': () => {
        validateToken('replicate');
        return replicate_query({
          input: { prompt },
        }, 'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions');
      },
      'dall-e-2': () => {
        validateToken('openai');
        return openai_query({
          model: "dall-e-2",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "b64_json"
        }, 'https://api.openai.com/v1/images/generations');
      },
      'dall-e-3': () => {
        validateToken('openai');
        return openai_query({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "b64_json"
        }, 'https://api.openai.com/v1/images/generations');
      },
      'fal-hidream-i1-full': () => {
        const config = modelConfigs[model];
        if (!config) {
          throw new Error(`No configuration found for model: ${model}`);
        }
        validateToken(config.platform);
        return fal_queue_query({
          prompt: prompt,
        }, config.url);
      },
      'fal-fast-sdxl': () => {
        const config = modelConfigs[model];
        if (!config) {
          throw new Error(`No configuration found for model: ${model}`);
        }
        validateToken(config.platform);
        return fal_queue_query({
          prompt: prompt,
        }, config.url);
      },
    };

    const handler = handlers[model];
    if (!handler) {
      throw new Error(`Unsupported model: ${model}`);
    }
    const result = await handler();
    
    // Extract image data from API response
    const imageData = await processApiResponse(result);
    
    // Return response with image data
    return new Response(JSON.stringify({
      success: true,
      prompt: prompt,
      imageData: imageData,
      message: 'Image generated successfully'
    }), {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('API Error:', err);
    
    // 构建详细的错误信息
    let errorMessage = 'Internal server error';
    let errorDetails = '';
    
    if (err && err.message) {
      errorMessage = err.message;
      
      // 如果是 JSON 解析错误，提供更友好的错误信息
      if (err.message.includes('Unexpected token') || err.message.includes('JSON')) {
        errorMessage = 'API returned invalid response format';
        errorDetails = `Original error: ${err.message}`;
      }
    }
    
    const errorResponse = {
      error: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}