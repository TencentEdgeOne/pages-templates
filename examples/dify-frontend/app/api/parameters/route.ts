import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { chatClient as client, getInfo, setSession } from '@/app/api/utils/common'

/**
 * Get application parameter configuration
 *
 * @route GET /api/parameters
 * @dify  GET /v1/parameters
 *
 * @description Get the Dify application's input form configuration and file upload settings.
 *              The frontend dynamically renders the input form (text fields, dropdowns, etc.) based on the response.
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {object} JSON
 *   - user_input_form    {Array<UserInputFormItem>} User input form configuration (variable name, type, required, etc.)
 *   - file_upload        {object}                   File upload configuration (enabled, image size limits, etc.)
 *     - image            {VisionSettings}           Image upload settings
 *   - system_parameters  {object}                   System parameters
 *     - image_file_size_limit {number}              Image file size limit (MB)
 *
 * @example
 *   GET /api/parameters
 */
export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  try {
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  }
  catch (error) {
    return NextResponse.json([])
  }
}
