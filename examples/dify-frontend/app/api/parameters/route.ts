import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { chatClient as client, getInfo, setSession } from '@/app/api/utils/common'

/**
 * 获取应用参数配置
 *
 * @route GET /api/parameters
 * @dify  GET /v1/parameters
 *
 * @description 获取 Dify 应用的输入表单配置和文件上传设置。
 *              前端根据返回结果动态渲染输入表单（文本框、下拉选择等）。
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {object} JSON
 *   - user_input_form    {Array<UserInputFormItem>} 用户输入表单配置（变量名、类型、是否必填等）
 *   - file_upload        {object}                   文件上传配置（是否启用、图片尺寸限制等）
 *     - image            {VisionSettings}           图片上传设置
 *   - system_parameters  {object}                   系统参数
 *     - image_file_size_limit {number}              图片文件大小上限（MB）
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
