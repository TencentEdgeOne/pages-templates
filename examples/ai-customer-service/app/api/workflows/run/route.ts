import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

/**
 * 执行工作流（Workflow Run）
 *
 * @route POST /api/workflows/run
 * @dify  POST /v1/workflows/run
 *
 * @description 触发 Dify Workflow 类型应用执行，返回 SSE 流。
 *              流式事件包含各节点的启动/完成状态，以及最终的工作流输出结果。
 *
 * @requestBody {object} JSON
 *   - inputs  {Record<string, any>} 必填 — 工作流输入变量键值对
 *   - files   {Array<VisionFile>}   可选 — 多模态文件列表
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {ReadableStream} SSE 事件流（text/event-stream）
 *   - event: workflow_started  — 工作流开始执行（含 task_id, workflow_run_id）
 *   - event: node_started      — 节点开始执行（含 node_id, node_type）
 *   - event: node_finished     — 节点执行完成（含 outputs, status, elapsed_time）
 *   - event: workflow_finished — 工作流执行完成（含最终 outputs, total_tokens, total_steps）
 *
 * @example
 *   POST /api/workflows/run
 *   { "inputs": { "query": "帮我写一篇文章" } }
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    files,
  } = body
  const { user } = getInfo(request)
  const res = await client.runWorkflow(inputs, user, true, files)
  return new Response(res.data as any)
}
