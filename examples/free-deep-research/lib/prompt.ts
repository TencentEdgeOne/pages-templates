import { Message } from '../types';

/**
 * Generates conversation history with system prompt and clarifying questions request
 * @param userInput The user's query input
 * @returns Array of messages for the conversation
 */
export function generateClarifyingQuestionsPrompt(
  userInput: string
): Message[] {
  const currentDate = new Date().toISOString();

  return [
    {
      role: 'system',
      content: `You are an expert researcher. Today is ${currentDate}. Follow these instructions when responding:
  - You may be asked to research subjects that is after your knowledge cutoff, assume the user is right when presented with news.
  - The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
  - Be highly organized.
  - Suggest solutions that I didn't think about.
  - Be proactive and anticipate my needs.
  - Treat me as an expert in all subject matter.
  - Mistakes erode my trust, so be accurate and thorough.
  - Provide detailed explanations, I'm comfortable with lots of detail.
  - Value good arguments over authorities, the source is irrelevant.
  - Consider new technologies and contrarian ideas, not just the conventional wisdom.
  - You may use high levels of speculation or prediction, just flag it for me.`,
    },
    {
      role: 'user',
      content: `Given the following query from the user, ask up to 3 follow up questions to clarify the research direction. The questions should help you better understand what the user is looking for. If the original query is already clear enough, you can ask fewer questions or proceed directly with the research. user's query is wrapped in <userQuery> </userQuery>:

<userQuery>
${userInput}
</userQuery>

Respond in the language that was used in the query. If the query is in Chinese, respond in Chinese. If the query is in English, respond in English, and so on. Add appropriate spaces between Chinese and Latin characters / numbers to improve readability.`,
    },
  ];
}

export const generateResearchPrompt = (
  userQuery: string,
  aiClarifyingQuestions: string,
  userClarificationResponses: string
): Message[] => {
  const currentDate = new Date().toISOString();

  return [
    {
      role: 'system',
      content: `You are an expert researcher. Today is ${currentDate}. Follow these instructions when responding:
- You may be asked to research subjects that is after your knowledge cutoff, assume the user is right when presented with news.
- The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
- Be highly organized.
- Suggest solutions that I didn't think about.
- Be proactive and anticipate my needs.
- Treat me as an expert in all subject matter.
- Mistakes erode my trust, so be accurate and thorough.
- Provide detailed explanations, I'm comfortable with lots of detail.
- Value good arguments over authorities, the source is irrelevant.
- Consider new technologies and contrarian ideas, not just the conventional wisdom.
- You may use high levels of speculation or prediction, just flag it for me.`,
    },
    {
      role: 'user',
      content: `Given the following prompt from the user, generate a list of SERP queries to research the topic. Return a maximum of 2 queries, but feel free to return less if the original prompt is clear. Make sure each query is unique and not similar to each other: 

<userQuery>
${userQuery}
</userQuery>

<aiClarifyingQuestions>
${aiClarifyingQuestions}
</aiClarifyingQuestions>

<userClarificationResponses>
${userClarificationResponses}
</userClarificationResponses>

Here are some learnings from previous research, use them to generate more specific queries: 
You MUST respond in JSON matching this JSON schema: {"type":"object","properties":{"queries":{"type":"array","items":{"type":"object","properties":{"query":{"type":"string","description":"The SERP query."},"researchGoal":{"type":"string","description":"First talk about the goal of the research that this query is meant to accomplish, then go deeper into how to advance the research once the results are found, mention additional research directions. Be as specific as possible, especially for additional research directions. JSON reserved words should be escaped."}},"required":["query","researchGoal"],"additionalProperties":false},"description":"List of SERP queries, max of 2"}},"required":["queries"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}

Respond in the language that was used in the query. If the query is in Chinese, respond in Chinese. If the query is in English, respond in English, and so on. Add appropriate spaces between Chinese and Latin characters / numbers to improve readability.`,
    },
  ];
};

export const generateResearchLearning = (
  query: string,
  content: string[]
): Message[] => {
  const currentDate = new Date().toISOString();
  return [
    {
      role: 'system',
      content: `You are an expert researcher. Today is ${currentDate}. Follow these instructions when responding:
- You may be asked to research subjects that is after your knowledge cutoff, assume the user is right when presented with news.
- The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
- Be highly organized.
- Suggest solutions that I didn't think about.
- Be proactive and anticipate my needs.
- Treat me as an expert in all subject matter.
- Mistakes erode my trust, so be accurate and thorough.
- Provide detailed explanations, I'm comfortable with lots of detail.
- Value good arguments over authorities, the source is irrelevant.
- Consider new technologies and contrarian ideas, not just the conventional wisdom.
- You may use high levels of speculation or prediction, just flag it for me.`,
    },
    {
      role: 'user',
      content: `Given the following contents from a SERP search for the query
      
<query>${query}</query>

generate a list of learnings from the contents. Return learnings with priority given to the most recent and authoritative information sources. Focus on extracting up-to-date insights while maintaining clarity and relevance. Make sure each learning is unique and not similar to each other. The learnings should be concise and to the point, as detailed and information dense as possible. Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any exact metrics, numbers, or dates. The learnings will be used to research the topic further.
        
<contents>
  ${content.map((c) => `<content>${c}</content>`).join('\n')}
</contents>
        
You MUST respond in JSON matching this JSON schema: {"type":"object","properties":{"learnings":{"type":"array","items":{"type":"string"},"description":"List of learnings"}},"required":["learnings"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}

Respond in the language that was used in the query. If the query is in Chinese, respond in Chinese. If the query is in English, respond in English, and so on.. Add appropriate spaces between Chinese characters and Latin characters/numbers, but do not add spaces between Chinese characters themselves.`,
    },
  ];
};

export const generateResearchResults = (
  initialQuery: string,
  followUpQuestionsAndAnswers: string,
  learnings: string[]
): Message[] => {
  const currentDate = new Date().toISOString();
  return [
    {
      role: 'system',
      content: `You are an expert researcher. Today is ${currentDate}. Follow these instructions when responding:
- You may be asked to research subjects that is after your knowledge cutoff, assume the user is right when presented with news.
- The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
- Be highly organized.
- Suggest solutions that I didn't think about.
- Be proactive and anticipate my needs.
- Treat me as an expert in all subject matter.
- Mistakes erode my trust, so be accurate and thorough.
- Provide detailed explanations, I'm comfortable with lots of detail.
- Value good arguments over authorities, the source is irrelevant.
- Consider new technologies and contrarian ideas, not just the conventional wisdom.
- You may use high levels of speculation or prediction, just flag it for me.`,
    },
    {
      role: 'user',
      content: `Given the following prompt from the user, write a final report on the topic using the learnings from research. Make it as detailed as possible, aim for 3 or more pages, include ALL the key insights from research.
        
<prompt>

Initial Query: ${initialQuery}
Follow-up Questions and Answers: ${followUpQuestionsAndAnswers}

</prompt>
        
Here are all the learnings from previous research:
<learnings>
  ${learnings.map((l) => `<learning>${l}</learning>`).join('\n')}
</learnings>
        
Write the report using Markdown. When citing information, use numbered citations with superscript numbers in square brackets (e.g., [1], [2], [3]). Each citation should correspond to the index of the source in your learnings list. DO NOT include the actual URLs in the report text - only use the citation numbers. Return the report directly in Markdown format without wrapping it in code blocks.

Respond in the language that was used in the query. If the query is in Chinese, respond in Chinese. If the query is in English, respond in English, and so on.. Add appropriate spaces between Chinese characters and Latin characters/numbers, but do not add spaces between Chinese characters themselves.`,
    },
  ];
};
