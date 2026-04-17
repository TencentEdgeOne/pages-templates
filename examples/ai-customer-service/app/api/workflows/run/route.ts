import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

/**
 * Execute a workflow (Workflow Run)
 *
 * @route POST /api/workflows/run
 * @dify  POST /v1/workflows/run
 *
 * @description Trigger a Dify Workflow app execution, returning an SSE stream.
 *              Streaming events include start/completion status of each node and the final workflow output.
 *
 * @requestBody {object} JSON
 *   - inputs  {Record<string, any>} Required — Workflow input variable key-value pairs
 *   - files   {Array<VisionFile>}   Optional — Multimodal file list
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {ReadableStream} SSE event stream (text/event-stream)
 *   - event: workflow_started  — Workflow started (contains task_id, workflow_run_id)
 *   - event: node_started      — Node started (contains node_id, node_type)
 *   - event: node_finished     — Node finished (contains outputs, status, elapsed_time)
 *   - event: workflow_finished — Workflow finished (contains final outputs, total_tokens, total_steps)
 *
 * @example
 *   POST /api/workflows/run
 *   { "inputs": { "query": "Write me an article" } }
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
