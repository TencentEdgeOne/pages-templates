import { API_PREFIX } from '@/config'
import Toast from '@/app/components/base/toast'

const TIME_OUT = 5 * 60 * 1000 // five minutes

const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
}

const baseOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include', // always send cookies、HTTP Basic authentication.
  headers: new Headers({
    'Content-Type': ContentType.json,
  }),
  redirect: 'follow',
}

export type WorkflowStartedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    workflow_id: string
    sequence_number: number
    created_at: number
  }
}

export type WorkflowFinishedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    workflow_id: string
    status: string
    outputs: any
    error: string
    elapsed_time: number
    total_tokens: number
    total_steps: number
    created_at: number
    finished_at: number
  }
}

export type NodeStartedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    node_id: string
    node_type: string
    index: number
    predecessor_node_id?: string
    inputs: any
    created_at: number
    extras?: any
  }
}

export type NodeFinishedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    node_id: string
    node_type: string
    index: number
    predecessor_node_id?: string
    inputs: any
    process_data: any
    outputs: any
    status: string
    error: string
    elapsed_time: number
    execution_metadata: {
      total_tokens: number
      total_price: number
      currency: string
    }
    created_at: number
  }
}

export type IOnDataMoreInfo = {
  conversationId: string | undefined
  messageId: string
  errorMessage?: string
}

export type IOnData = (message: string, isFirstMessage: boolean, moreInfo: IOnDataMoreInfo) => void
export type IOnCompleted = (hasError?: boolean) => void
export type IOnError = (msg: string) => void
export type IOnWorkflowStarted = (workflowStarted: WorkflowStartedResponse) => void
export type IOnWorkflowFinished = (workflowFinished: WorkflowFinishedResponse) => void
export type IOnNodeStarted = (nodeStarted: NodeStartedResponse) => void
export type IOnNodeFinished = (nodeFinished: NodeFinishedResponse) => void
export type IOnTaskId = (taskId: string) => void
// Chat / Agent specific
export type IOnMessageEnd = (messageId: string, conversationId: string, metadata?: any) => void
export type IOnAgentMessage = IOnData  // agent_message has the same shape as message
export type IOnAgentThought = (thought: any) => void

type IOtherOptions = {
  needAllResponseContent?: boolean
  onData?: IOnData // for stream
  onError?: IOnError
  onCompleted?: IOnCompleted // for stream
  onWorkflowStarted?: IOnWorkflowStarted
  onWorkflowFinished?: IOnWorkflowFinished
  onNodeStarted?: IOnNodeStarted
  onNodeFinished?: IOnNodeFinished
  onTaskId?: IOnTaskId
  // Chat / Agent
  onMessageEnd?: IOnMessageEnd
  onAgentMessage?: IOnAgentMessage
  onAgentThought?: IOnAgentThought
  abortController?: AbortController
}

function unicodeToChar(text: string) {
  return text.replace(/\\u([0-9a-f]{4})/g, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16))
  })
}

const handleStream = (
  response: Response,
  onData: IOnData,
  onCompleted?: IOnCompleted,
  onWorkflowStarted?: IOnWorkflowStarted,
  onWorkflowFinished?: IOnWorkflowFinished,
  onNodeStarted?: IOnNodeStarted,
  onNodeFinished?: IOnNodeFinished,
  onTaskId?: IOnTaskId,
  onMessageEnd?: IOnMessageEnd,
  onAgentMessage?: IOnAgentMessage,
  onAgentThought?: IOnAgentThought,
) => {
  if (!response.ok)
    throw new Error('Network response was not ok')

  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let bufferObj: any
  let isFirstMessage = true
  let taskIdReported = false
  function read() {
    reader?.read().then((result: any) => {
      if (result.done) {
        onCompleted && onCompleted()
        return
      }
      buffer += decoder.decode(result.value, { stream: true })
      const lines = buffer.split('\n')
      try {
        lines.forEach((message) => {
          if (!message || !message.startsWith('data: '))
            return
          try {
            bufferObj = JSON.parse(message.substring(6)) // remove data: and parse as json
          }
          catch (e) {
            // Incomplete / malformed SSE chunk — skip it silently.
            // Do NOT forward stale bufferObj IDs from the previous chunk.
            return
          }
          // Report task_id on first occurrence
          if (!taskIdReported && bufferObj.task_id) {
            taskIdReported = true
            onTaskId?.(bufferObj.task_id)
          }
          if (bufferObj.event === 'message') {
            onData(unicodeToChar(bufferObj.answer), isFirstMessage, {
              conversationId: bufferObj.conversation_id,
              messageId: bufferObj.id,
            })
            isFirstMessage = false
          }
          else if (bufferObj.event === 'agent_message') {
            // Agent streaming reply — same shape as 'message'
            const handler = onAgentMessage || onData
            handler(unicodeToChar(bufferObj.answer), isFirstMessage, {
              conversationId: bufferObj.conversation_id,
              messageId: bufferObj.id,
            })
            isFirstMessage = false
          }
          else if (bufferObj.event === 'agent_thought') {
            onAgentThought?.(bufferObj)
          }
          else if (bufferObj.event === 'message_end') {
            onMessageEnd?.(bufferObj.id, bufferObj.conversation_id, bufferObj.metadata)
            // onCompleted is called when reader.done fires — don't call it here too
          }
          else if (bufferObj.event === 'workflow_started') {
            onWorkflowStarted?.(bufferObj as WorkflowStartedResponse)
          }
          else if (bufferObj.event === 'workflow_finished') {
            onWorkflowFinished?.(bufferObj as WorkflowFinishedResponse)
          }
          else if (bufferObj.event === 'node_started') {
            onNodeStarted?.(bufferObj as NodeStartedResponse)
          }
          else if (bufferObj.event === 'node_finished') {
            onNodeFinished?.(bufferObj as NodeFinishedResponse)
          }
        })
        buffer = lines[lines.length - 1]
      }
      catch (e) {
        onData('', false, {
          conversationId: undefined,
          messageId: '',
          errorMessage: `${e}`,
        })
        return
      }

      read()
    }).catch((e) => {
      // Swallow abort errors — these are intentional (user stopped generation)
      if (e?.name === 'AbortError' || `${e}`.includes('BodyStreamBuffer was aborted'))
        return
      onData('', false, {
        conversationId: undefined,
        messageId: '',
        errorMessage: `${e}`,
      })
    })
  }
  read()
}

const baseFetch = (url: string, fetchOptions: any, { needAllResponseContent }: IOtherOptions) => {
  const options = Object.assign({}, baseOptions, fetchOptions)

  const urlPrefix = API_PREFIX

  let urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`

  const { method, params, body } = options
  // handle query
  if (method === 'GET' && params) {
    const paramsArray: string[] = []
    Object.keys(params).forEach(key =>
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`),
    )
    if (!urlWithPrefix.includes('?'))
      urlWithPrefix += `?${paramsArray.join('&')}`

    else
      urlWithPrefix += `&${paramsArray.join('&')}`

    delete options.params
  }

  if (body)
    options.body = JSON.stringify(body)

  // Handle timeout
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('request timeout'))
      }, TIME_OUT)
    }),
    new Promise((resolve, reject) => {
      globalThis.fetch(urlWithPrefix, options)
        .then((res: any) => {
          const resClone = res.clone()
          // Error handler
          if (!/^(2|3)\d{2}$/.test(res.status)) {
            if (res.status === 401) {
              Toast.notify({ type: 'error', message: 'Invalid token' })
              return Promise.reject(resClone)
            }
            // Safely read the body — it may be empty (e.g. some 4xx/5xx responses)
            res.text().then((text: string) => {
              let message = `Request failed (${res.status})`
              if (text) {
                try {
                  const data = JSON.parse(text)
                  if (data?.message) message = data.message
                }
                catch {
                  message = text
                }
              }
              Toast.notify({ type: 'error', message })
            }).catch(() => {
              Toast.notify({ type: 'error', message: `Request failed (${res.status})` })
            })
            return Promise.reject(resClone)
          }

          // handle delete api. Delete api not return content.
          if (res.status === 204) {
            resolve({ result: 'success' })
            return
          }

          // return data
          const data = options.headers.get('Content-type') === ContentType.download ? res.blob() : res.json()

          resolve(needAllResponseContent ? resClone : data)
        })
        .catch((err) => {
          Toast.notify({ type: 'error', message: err })
          reject(err)
        })
    }),
  ])
}

export const upload = (fetchOptions: any): Promise<any> => {
  const urlPrefix = API_PREFIX
  const urlWithPrefix = `${urlPrefix}/file-upload`
  const defaultOptions = {
    method: 'POST',
    url: `${urlWithPrefix}`,
    data: {},
  }
  const options = {
    ...defaultOptions,
    ...fetchOptions,
  }
  return new Promise((resolve, reject) => {
    const xhr = options.xhr
    xhr.open(options.method, options.url)
    for (const key in options.headers)
      xhr.setRequestHeader(key, options.headers[key])

    xhr.withCredentials = true
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200)
          resolve({ id: xhr.response })
        else
          reject(xhr)
      }
    }
    xhr.upload.onprogress = options.onprogress
    xhr.send(options.data)
  })
}

export const ssePost = (
  url: string,
  fetchOptions: any,
  {
    onData,
    onCompleted,
    onError,
    onWorkflowStarted,
    onWorkflowFinished,
    onNodeStarted,
    onNodeFinished,
    onTaskId,
    onMessageEnd,
    onAgentMessage,
    onAgentThought,
    abortController,
  }: IOtherOptions) => {
  const options = Object.assign({}, baseOptions, {
    method: 'POST',
  }, fetchOptions)

  const urlPrefix = API_PREFIX
  const urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`

  const { body } = options
  if (body)
    options.body = JSON.stringify(body)

  if (abortController)
    options.signal = abortController.signal

  globalThis.fetch(urlWithPrefix, options)
    .then((res: any) => {
      if (!/^(2|3)\d{2}$/.test(res.status)) {
        res.text().then((text: string) => {
          let message = `Server Error (${res.status})`
          if (text) {
            try {
              const data = JSON.parse(text)
              if (data?.message) message = data.message
            }
            catch {
              message = text
            }
          }
          Toast.notify({ type: 'error', message })
          onError?.(message)
        }).catch(() => {
          const message = `Server Error (${res.status})`
          Toast.notify({ type: 'error', message })
          onError?.(message)
        })
        return
      }
      return handleStream(res, (str: string, isFirstMessage: boolean, moreInfo: IOnDataMoreInfo) => {
        if (moreInfo.errorMessage) {
          Toast.notify({ type: 'error', message: moreInfo.errorMessage })
          return
        }
        onData?.(str, isFirstMessage, moreInfo)
      }, onCompleted, onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished, onTaskId,
        onMessageEnd, onAgentMessage, onAgentThought)
    }).catch((e) => {
      if (e?.name === 'AbortError') {
        // Request was intentionally aborted (user stopped generation).
        // Do not call onCompleted or onError — the caller's stop handler manages cleanup.
        return
      }
      Toast.notify({ type: 'error', message: e })
      onError?.(e)
    })
}

export const request = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return baseFetch(url, options, otherOptions || {})
}

export const get = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'GET' }), otherOptions)
}

export const post = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'POST' }), otherOptions)
}

export const del = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'DELETE' }), otherOptions)
}
