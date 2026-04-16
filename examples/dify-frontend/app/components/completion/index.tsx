'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useBoolean, useClickAway } from 'ahooks'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  ArrowRightIcon,
  ArrowPathIcon,
  ClockIcon,
  StopIcon,
} from '@heroicons/react/24/solid'
import RunOnce from '../run-once'
import RunBatch from '../run-batch'
import ResDownload from '../run-batch/res-download'
import Result from '../result'
import Loading from '@/app/components/base/loading'
import AppUnavailable from '@/app/components/app-unavailable'
import Toast from '@/app/components/base/toast'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { fetchAppParams, fetchWorkflowLogs, fetchWorkflowRunDetail, updateFeedback } from '@/service'
import type { Feedbacktype, PromptConfig, VisionFile, VisionSettings } from '@/types/app'
import { Resolution, TransferMethod } from '@/types/app'
import { changeLanguage } from '@/i18n/i18next-config'
import { APP_INFO as DEFAULT_APP_INFO, DEFAULT_VALUE_MAX_LEN, IS_WORKFLOW } from '@/config'
import { userInputsFormToPromptVariables } from '@/utils/prompt'
import s from './styles.module.css'

type WorkflowLogItem = {
  id: string
  workflow_run: {
    id: string
    version: string
    status: string
    error: string | null
    elapsed_time: number
    total_tokens: number
    total_steps: number
    created_at: number
    finished_at: number
  }
  created_from: string
  created_by_role: string
  created_at: number
}

const GROUP_SIZE = 5

enum TaskStatus {
  pending = 'pending',
  running = 'running',
  completed = 'completed',
  failed = 'failed',
}

type TaskParam = {
  inputs: Record<string, any>
}

type Task = {
  id: number
  status: TaskStatus
  params: TaskParam
}

const Completion = () => {
  const { t } = useTranslation()
  const media = useBreakpoints()
  const isPC = media === MediaType.pc
  const isTablet = media === MediaType.tablet
  const isMobile = media === MediaType.mobile

  const [currTab, setCurrTab] = useState<string>('create')
  const [isCallBatchAPI, setIsCallBatchAPI] = useState(false)
  const isInBatchTab = currTab === 'batch'

  // App state
  const [appUnavailable, setAppUnavailable] = useState<boolean>(false)
  const [isUnknownReason, setIsUnknownReason] = useState<boolean>(false)
  const [inputs, setInputs] = useState<Record<string, any>>({})
  const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null)
  const [isResponsing, { setTrue: setResponsingTrue, setFalse: setResponsingFalse }] = useBoolean(false)
  const [completionRes, setCompletionRes] = useState('')
  const { notify } = Toast
  const isNoData = !completionRes
  const [messageId, setMessageId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedbacktype>({ rating: null })

  // Phase 1.3: Dynamic APP_INFO from /meta API
  const [appInfo, setAppInfo] = useState(DEFAULT_APP_INFO)

  const [historyDetailId, setHistoryDetailId] = useState<string | null>(null)
  const [historyDetail, setHistoryDetail] = useState<any>(null)
  const [historyDetailLoading, setHistoryDetailLoading] = useState(false)

  const handleFeedback = async (feedback: Feedbacktype) => {
    await updateFeedback({ url: `/messages/${messageId}/feedbacks`, body: { rating: feedback.rating } })
    setFeedback(feedback)
  }

  const checkCanSend = () => {
    const prompt_variables = promptConfig?.prompt_variables
    if (!prompt_variables || prompt_variables?.length === 0) return true
    let hasEmptyInput = false
    const requiredVars = prompt_variables?.filter(({ key, name, required }) => {
      return (!key || !key.trim()) || (!name || !name.trim()) || (required || required === undefined || required === null)
    }) || []
    requiredVars.forEach(({ key }) => {
      if (hasEmptyInput) return
      if (!inputs[key]) hasEmptyInput = true
    })
    if (hasEmptyInput) {
      notify({ type: 'error', message: t('app.errorMessage.valueOfVarRequired') })
      return false
    }
    return !hasEmptyInput
  }

  const [controlSend, setControlSend] = useState(0)
  const [controlStopResponding, setControlStopResponding] = useState(0)

  // History state
  const [historyLogs, setHistoryLogs] = useState<WorkflowLogItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyPage, setHistoryPage] = useState(1)
  const [historyHasMore, setHistoryHasMore] = useState(false)
  const [historyTotal, setHistoryTotal] = useState(0)

  const loadHistoryLogs = useCallback(async (page = 1, append = false) => {
    setHistoryLoading(true)
    try {
      const res: any = await fetchWorkflowLogs({ page, limit: 10 })
      if (res && res.data) {
        setHistoryLogs(prev => append ? [...prev, ...res.data] : res.data)
        setHistoryHasMore(res.has_more ?? false)
        setHistoryTotal(res.total ?? 0)
        setHistoryPage(page)
      }
    }
    catch (e: any) {
      notify({ type: 'error', message: e.message || 'Failed to load history' })
    }
    finally {
      setHistoryLoading(false)
    }
  }, [notify])

  const loadHistoryDetail = useCallback(async (runId: string) => {
    setHistoryDetailId(runId)
    setHistoryDetailLoading(true)
    setHistoryDetail(null)
    try {
      const res: any = await fetchWorkflowRunDetail(runId)
      setHistoryDetail(res)
    }
    catch (e: any) {
      notify({ type: 'error', message: e.message || 'Failed to load run detail' })
      setHistoryDetailId(null)
    }
    finally {
      setHistoryDetailLoading(false)
    }
  }, [notify])

  const closeHistoryDetail = useCallback(() => {
    setHistoryDetailId(null)
    setHistoryDetail(null)
  }, [])

  const [visionConfig, setVisionConfig] = useState<VisionSettings>({
    enabled: false,
    number_limits: 2,
    detail: Resolution.low,
    transfer_methods: [TransferMethod.local_file],
  })
  const [completionFiles, setCompletionFiles] = useState<VisionFile[]>([])

  const handleSend = async () => {
    setIsCallBatchAPI(false)
    setControlSend(Date.now())
    setAllTaskList([])
    setResponsingTrue()
    showResSidebar()
  }

  const handleStopResponding = useCallback(() => {
    setControlStopResponding(Date.now())
    setResponsingFalse()
  }, [])

  const [controlRetry, setControlRetry] = useState(0)
  const handleRetryAllFailedTask = () => {
    setControlRetry(Date.now())
  }

  const [allTaskList, doSetAllTaskList] = useState<Task[]>([])
  const allTaskListRef = useRef<Task[]>([])
  const getLatestTaskList = () => allTaskListRef.current
  const setAllTaskList = (taskList: Task[]) => {
    doSetAllTaskList(taskList)
    allTaskListRef.current = taskList
  }
  const pendingTaskList = allTaskList.filter(task => task.status === TaskStatus.pending)
  const noPendingTask = pendingTaskList.length === 0
  const showTaskList = allTaskList.filter(task => task.status !== TaskStatus.pending)
  const [currGroupNum, doSetCurrGroupNum] = useState(0)
  const currGroupNumRef = useRef(0)
  const setCurrGroupNum = (num: number) => {
    doSetCurrGroupNum(num)
    currGroupNumRef.current = num
  }
  const getCurrGroupNum = () => currGroupNumRef.current
  const allSuccessTaskList = allTaskList.filter(task => task.status === TaskStatus.completed)
  const allFailedTaskList = allTaskList.filter(task => task.status === TaskStatus.failed)
  const allTaskFinished = allTaskList.every(task => task.status === TaskStatus.completed)
  const allTaskRuned = allTaskList.every(task => [TaskStatus.completed, TaskStatus.failed].includes(task.status))
  const [batchCompletionRes, doSetBatchCompletionRes] = useState<Record<string, string>>({})
  const batchCompletionResRef = useRef<Record<string, string>>({})
  const setBatchCompletionRes = (res: Record<string, string>) => {
    doSetBatchCompletionRes(res)
    batchCompletionResRef.current = res
  }
  const getBatchCompletionRes = () => batchCompletionResRef.current
  const exportRes = useMemo(() => {
    const batchCompletionResLatest = getBatchCompletionRes()
    return allTaskList.map((task) => {
      const res: Record<string, string> = {}
      const { inputs } = task.params
      promptConfig?.prompt_variables?.forEach((v) => {
        res[v.name] = inputs[v.key]
      })
      res[t('app.generation.completionResult')] = batchCompletionResLatest[task.id]
      return res
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTaskList, promptConfig, t])

  const checkBatchInputs = (data: string[][]) => {
    if (!data || data.length === 0) {
      notify({ type: 'error', message: t('app.generation.errorMsg.empty') })
      return false
    }
    const headerData = data[0]
    let isMapVarName = true
    promptConfig?.prompt_variables.forEach((item, index) => {
      if (!isMapVarName) return
      if (item.name !== headerData[index]) isMapVarName = false
    })
    if (!isMapVarName) {
      notify({ type: 'error', message: t('app.generation.errorMsg.fileStructNotMatch') })
      return false
    }
    let payloadData = data.slice(1)
    if (payloadData.length === 0) {
      notify({ type: 'error', message: t('app.generation.errorMsg.atLeastOne') })
      return false
    }
    const allEmptyLineIndexes = payloadData.flatMap((item, idx) =>
      item.every(i => i === '') ? [idx] : [],
    )
    if (allEmptyLineIndexes.length > 0) {
      let hasMiddleEmptyLine = false
      let startIndex = allEmptyLineIndexes[0] - 1
      allEmptyLineIndexes.forEach((index) => {
        if (hasMiddleEmptyLine) return
        if (startIndex + 1 !== index) {
          hasMiddleEmptyLine = true
          return
        }
        startIndex++
      })
      if (hasMiddleEmptyLine) {
        notify({ type: 'error', message: t('app.generation.errorMsg.emptyLine', { rowIndex: startIndex + 2 }) })
        return false
      }
    }
    payloadData = payloadData.filter(item => !item.every(i => i === ''))
    if (payloadData.length === 0) {
      notify({ type: 'error', message: t('app.generation.errorMsg.atLeastOne') })
      return false
    }
    let errorRowIndex = 0
    let requiredVarName = ''
    let moreThanMaxLengthVarName = ''
    let maxLength = 0
    payloadData.forEach((item, index) => {
      if (errorRowIndex !== 0) return
      promptConfig?.prompt_variables.forEach((varItem, varIndex) => {
        if (errorRowIndex !== 0) return
        if (varItem.type === 'string') {
          const maxLen = varItem.max_length || DEFAULT_VALUE_MAX_LEN
          if (item[varIndex].length > maxLen) {
            moreThanMaxLengthVarName = varItem.name
            maxLength = maxLen
            errorRowIndex = index + 1
            return
          }
        }
        if (varItem.required === false) return
        if (item[varIndex].trim() === '') {
          requiredVarName = varItem.name
          errorRowIndex = index + 1
        }
      })
    })
    if (errorRowIndex !== 0) {
      if (requiredVarName)
        notify({ type: 'error', message: t('app.generation.errorMsg.invalidLine', { rowIndex: errorRowIndex + 1, varName: requiredVarName }) })
      if (moreThanMaxLengthVarName)
        notify({ type: 'error', message: t('app.generation.errorMsg.moreThanMaxLengthLine', { rowIndex: errorRowIndex + 1, varName: moreThanMaxLengthVarName, maxLength }) })
      return false
    }
    return true
  }

  const handleRunBatch = (data: string[][]) => {
    if (!checkBatchInputs(data)) return
    if (!allTaskFinished) {
      notify({ type: 'info', message: t('appDebug.errorMessage.waitForBatchResponse') })
      return
    }
    const payloadData = data.filter(item => !item.every(i => i === '')).slice(1)
    const varLen = promptConfig?.prompt_variables.length || 0
    setIsCallBatchAPI(true)
    const allTaskList: Task[] = payloadData.map((item, i) => {
      const inputs: Record<string, string> = {}
      if (varLen > 0) {
        item.slice(0, varLen).forEach((input, index) => {
          inputs[promptConfig?.prompt_variables[index].key as string] = input
        })
      }
      return {
        id: i + 1,
        status: i < GROUP_SIZE ? TaskStatus.running : TaskStatus.pending,
        params: { inputs },
      }
    })
    setAllTaskList(allTaskList)
    setControlSend(Date.now())
    showResSidebar()
  }

  const handleCompleted = (completionRes: string, taskId?: number, isSuccess?: boolean) => {
    setResponsingFalse()
    const allTasklistLatest = getLatestTaskList()
    const batchCompletionResLatest = getBatchCompletionRes()
    const pendingTaskList = allTasklistLatest.filter(task => task.status === TaskStatus.pending)
    const hadRunedTaskNum = 1 + allTasklistLatest.filter(task => [TaskStatus.completed, TaskStatus.failed].includes(task.status)).length
    const needToAddNextGroupTask = (getCurrGroupNum() !== hadRunedTaskNum) && pendingTaskList.length > 0 && (hadRunedTaskNum % GROUP_SIZE === 0 || (allTasklistLatest.length - hadRunedTaskNum < GROUP_SIZE))
    if (needToAddNextGroupTask) setCurrGroupNum(hadRunedTaskNum)
    const nextPendingTaskIds = needToAddNextGroupTask ? pendingTaskList.slice(0, GROUP_SIZE).map(item => item.id) : []
    const newAllTaskList = allTasklistLatest.map((item) => {
      if (item.id === taskId) {
        return { ...item, status: isSuccess ? TaskStatus.completed : TaskStatus.failed }
      }
      if (needToAddNextGroupTask && nextPendingTaskIds.includes(item.id)) {
        return { ...item, status: TaskStatus.running }
      }
      return item
    })
    setAllTaskList(newAllTaskList)
    if (taskId) {
      setBatchCompletionRes({ ...batchCompletionResLatest, [`${taskId}`]: completionRes })
    }
  }

  // Init
  useEffect(() => {
    ;(async () => {
      try {
        changeLanguage(DEFAULT_APP_INFO.default_language)
        const { user_input_form, file_upload, system_parameters }: any = await fetchAppParams()
        const prompt_variables = userInputsFormToPromptVariables(user_input_form)
        setPromptConfig({ prompt_template: '', prompt_variables } as PromptConfig)
        setVisionConfig({
          ...file_upload?.image,
          image_file_size_limit: system_parameters?.image_file_size_limit || 0,
        })
      }
      catch (e: any) {
        if (e.status === 404) setAppUnavailable(true)
        else {
          setIsUnknownReason(true)
          setAppUnavailable(true)
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (appInfo?.title)
      document.title = `${appInfo.title} - Powered by Dify`
  }, [appInfo?.title])

  const [isShowResSidebar, { setTrue: showResSidebar, setFalse: hideResSidebar }] = useBoolean(false)
  const resRef = useRef<HTMLDivElement>(null)
  useClickAway(() => {
    if (isShowResSidebar)
      hideResSidebar()
  }, resRef)

  const renderRes = (task?: Task) => (
    <Result
      isWorkflow={IS_WORKFLOW}
      isCallBatchAPI={isCallBatchAPI}
      isPC={isPC}
      isMobile={isMobile}
      isError={task?.status === TaskStatus.failed}
      promptConfig={promptConfig}
      inputs={isCallBatchAPI ? (task as Task).params.inputs : inputs}
      controlSend={controlSend}
      controlRetry={task?.status === TaskStatus.failed ? controlRetry : 0}
      controlStopResponding={controlStopResponding}
      onShowRes={showResSidebar}
      taskId={task?.id}
      onCompleted={handleCompleted}
      visionConfig={visionConfig}
      completionFiles={completionFiles}
    />
  )

  const renderBatchRes = () => showTaskList.map(task => renderRes(task))

  // ===================== RENDER =====================

  const renderResultPanel = (
    <div
      ref={resRef}
      className={cn(
        s.resultPanel, s.fadeIn,
        'flex flex-col h-full',
        isPC ? 'px-10 py-8' : '',
        isTablet && 'p-6',
        isMobile && 'p-4',
      )}
    >
      {/* Result header */}
      <div className="shrink-0 flex items-center justify-between mb-8">
        <div className={s.resultHeader}>
          <div className={s.resultIcon}>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className={s.resultTitle}>
              {t('app.generation.title')}
            </div>
            <div className={s.resultSubtitle}>{t('app.generation.generatedOutput')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isResponsing && (
            <button className={s.stopButton} onClick={handleStopResponding}>
              <StopIcon className="w-3.5 h-3.5" />
              <span>{t('app.generation.stopResponding') || 'Stop'}</span>
            </button>
          )}
          {allFailedTaskList.length > 0 && (
            <div className="flex items-center gap-2">
              <span className={cn(s.badge, s.badgeError)}>
                {t('app.generation.failedBadge', { count: allFailedTaskList.length })}
              </span>
              <button className={s.retryButton} onClick={handleRetryAllFailedTask}>
                <ArrowPathIcon className="w-3 h-3" />
                {t('app.generation.batchFailed.retry')}
              </button>
            </div>
          )}
          {allSuccessTaskList.length > 0 && (
            <ResDownload isMobile={isMobile} values={exportRes} />
          )}
          {!isPC && (
            <button
              className={s.ghostButton}
              onClick={hideResSidebar}
              style={{ padding: '6px 8px' }}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className={s.editorialRule} />

      {/* Result content */}
      <div className={cn('grow overflow-y-auto', s.customScroll)}>
        {!isCallBatchAPI ? renderRes() : renderBatchRes()}
        {!noPendingTask && (
          <div className="mt-4">
            <Loading type="area" />
          </div>
        )}
      </div>
    </div>
  )

  // Loading / Unavailable states
  if (appUnavailable)
    return <AppUnavailable isUnknwonReason={isUnknownReason} errMessage="" />

  if (!appInfo || !promptConfig) {
    return (
      <div className={s.pageBg}>
        <div className={cn(s.container, 'flex items-center justify-center')}>
          <Loading type="app" />
        </div>
      </div>
    )
  }

  return (
    <div className={s.pageBg}>
      <div className={cn(
        s.container,
        s.warmTheme,
        isPC ? 'flex' : 'flex flex-col',
      )}>
        {/* ========== LEFT PANEL: Input ========== */}
        <div className={cn(
          s.leftPanel, s.fadeIn,
          'flex flex-col shrink-0',
          isPC ? 'w-[520px] max-w-[45%] h-full' : '',
          !isPC && 'border-b border-r-0',
        )}>
          <div className={cn(
            s.leftPanelInner,
            isPC ? 'px-10 py-8' : 'px-5 py-5',
          )}>
            {/* Title */}
            <div className={s.titleArea}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className={s.titleLabel}>{t('app.generation.textGeneratorLabel')}</span>
                  <h1 className={s.titleMain}>{appInfo.title}</h1>
                  {appInfo.description && (
                    <p className={s.titleDesc}>{appInfo.description}</p>
                  )}
                </div>
                {!isPC && (
                  <button
                    className={s.ghostButton}
                    onClick={showResSidebar}
                  >
                    <span>{t('app.generation.resultsButton')}</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className={s.editorialRule} />

            {/* Tabs */}
            <div className={s.tabBar}>
              <button
                className={cn(s.tabItem, currTab === 'create' && s.tabItemActive)}
                onClick={() => setCurrTab('create')}
              >
                {t('app.generation.tabs.create')}
              </button>
              <button
                className={cn(s.tabItem, currTab === 'batch' && s.tabItemActive)}
                onClick={() => setCurrTab('batch')}
              >
                {t('app.generation.tabs.batch')}
              </button>
              <button
                className={cn(s.tabItem, currTab === 'history' && s.tabItemActive)}
                onClick={() => {
                  setCurrTab('history')
                  if (historyLogs.length === 0) loadHistoryLogs(1)
                }}
              >
                <ClockIcon className="w-3.5 h-3.5 inline-block mr-1 -mt-px" />
                {t('app.generation.tabs.history')}
              </button>
            </div>

            {/* Form area */}
            <div className={cn('grow overflow-y-auto', s.customScroll)}>
              <div className={cn(currTab === 'create' ? 'block' : 'hidden')}>
                <RunOnce
                  inputs={inputs}
                  onInputsChange={setInputs}
                  promptConfig={promptConfig}
                  onSend={handleSend}
                  visionConfig={visionConfig}
                  onVisionFilesChange={setCompletionFiles}
                />
              </div>
              <div className={cn(isInBatchTab ? 'block' : 'hidden')}>
                <RunBatch
                  vars={promptConfig.prompt_variables}
                  onSend={handleRunBatch}
                  isAllFinished={allTaskRuned}
                />
              </div>
              <div className={cn(currTab === 'history' ? 'block' : 'hidden')}>
                {/* History panel */}
                <div className={s.historyPanel}>
                  <div className={s.historyHeader}>
                    <div className={s.historyHeaderLeft}>
                      <span className={s.historyCount}>{t('app.generation.historyRunsCount', { count: historyTotal })}</span>
                    </div>
                    <button
                      className={s.ghostButton}
                      onClick={() => loadHistoryLogs(1)}
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      <ArrowPathIcon className="w-3 h-3" />
                      <span>{t('app.generation.historyRefresh')}</span>
                    </button>
                  </div>

                  {historyLoading && historyLogs.length === 0 && (
                    <div className="flex justify-center py-8">
                      <Loading type="area" />
                    </div>
                  )}

                  {!historyLoading && historyLogs.length === 0 && (
                    <div className={s.historyEmpty}>
                      <ClockIcon className="w-8 h-8 text-gray-300 mb-2" />
                      <p>{t('app.generation.historyEmpty')}</p>
                      <p className="text-xs mt-1">{t('app.generation.historyEmptyHint')}</p>
                    </div>
                  )}

                  <div className={s.historyList}>
                    {historyLogs.map(log => (
                      <div
                        key={log.id}
                        className={cn(s.historyItem, IS_WORKFLOW && s.historyItemClickable)}
                        onClick={() => IS_WORKFLOW && loadHistoryDetail(log.workflow_run.id)}
                        title={IS_WORKFLOW ? t('app.generation.historyClickToView') ?? undefined : undefined}
                      >
                        <div className={s.historyItemHeader}>
                          <span className={cn(
                            s.historyStatus,
                            log.workflow_run.status === 'succeeded' && s.historyStatusSuccess,
                            log.workflow_run.status === 'failed' && s.historyStatusFailed,
                            log.workflow_run.status === 'stopped' && s.historyStatusStopped,
                          )}>
                            {log.workflow_run.status}
                          </span>
                          <span className={s.historyTime}>
                            {new Date(log.created_at * 1000).toLocaleString()}
                          </span>
                        </div>
                        <div className={s.historyItemMeta}>
                          <span>{t('app.generation.historySteps', { count: log.workflow_run.total_steps })}</span>
                          <span className={s.historyDot}>·</span>
                          <span>{t('app.generation.historyElapsed', { elapsed: log.workflow_run.elapsed_time.toFixed(2) })}</span>
                          <span className={s.historyDot}>·</span>
                          <span>{t('app.generation.historyTokens', { count: log.workflow_run.total_tokens })}</span>
                        </div>
                        {log.workflow_run.error && (
                          <div className={s.historyError}>
                            {log.workflow_run.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {historyHasMore && (
                    <button
                      className={cn(s.ghostButton, s.historyLoadMore)}
                      onClick={() => loadHistoryLogs(historyPage + 1, true)}
                      disabled={historyLoading}
                    >
                      {historyLoading ? t('app.generation.historyLoading') : t('app.generation.historyLoadMore')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className={cn(s.copyright, 'mt-6 pt-4')} style={{ borderTop: '1px solid #e8e3db' }}>
              <span>© {appInfo.copyright || appInfo.title} {(new Date()).getFullYear()}</span>
              {appInfo.privacy_policy && (
                <>
                  <span className="mx-2">·</span>
                  <span>
                    {t('app.generation.privacyPolicyLeft')}
                    <a href={appInfo.privacy_policy} target="_blank" rel="noreferrer">
                      {t('app.generation.privacyPolicyMiddle')}
                    </a>
                    {t('app.generation.privacyPolicyRight')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========== RIGHT PANEL: Results ========== */}
        {isPC && (
          <div className={cn('grow h-full overflow-hidden', s.fadeIn)} style={{ animationDelay: '0.08s' }}>
            {renderResultPanel}
          </div>
        )}

        {/* Mobile / Tablet result drawer */}
        {(!isPC && isShowResSidebar) && (
          <div className={s.drawerOverlay}>
            <div
              className={cn(
                s.slideInRight,
                'absolute top-0 right-0 bottom-0',
                isTablet ? 'left-[128px]' : 'left-6',
              )}
              style={{ background: '#f6f3ee' }}
            >
              {renderResultPanel}
            </div>
          </div>
        )}
      </div>

      {/* History Detail Modal */}
      {historyDetailId && (
        <div className={s.historyDetailOverlay} onClick={closeHistoryDetail}>
          <div className={s.historyDetailPanel} onClick={(e) => e.stopPropagation()}>
            <div className={s.historyDetailHeader}>
              <span className={s.historyDetailTitle}>{t('app.generation.historyDetailTitle')}</span>
              <button className={s.ghostButton} onClick={closeHistoryDetail} style={{ padding: '6px 10px' }}>
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <div className={cn(s.historyDetailBody, s.customScroll)}>
              {historyDetailLoading && (
                <div className="flex justify-center py-12">
                  <Loading type="area" />
                </div>
              )}
              {historyDetail && !historyDetailLoading && (
                <>
                  {/* Status & Meta */}
                  <div className={s.historyDetailSection}>
                    <div className={s.historyDetailSectionTitle}>{t('app.generation.historyDetailOverview')}</div>
                    <div className={s.historyDetailMeta}>
                      <div className={s.historyDetailMetaItem}>
                        <span className={s.historyDetailMetaLabel}>{t('app.generation.historyDetailStatus')}</span>
                        <span className={s.historyDetailMetaValue}>{historyDetail.status}</span>
                      </div>
                      <div className={s.historyDetailMetaItem}>
                        <span className={s.historyDetailMetaLabel}>{t('app.generation.historyDetailElapsed')}</span>
                        <span className={s.historyDetailMetaValue}>{historyDetail.elapsed_time?.toFixed(2)}s</span>
                      </div>
                      <div className={s.historyDetailMetaItem}>
                        <span className={s.historyDetailMetaLabel}>{t('app.generation.historyDetailTokens')}</span>
                        <span className={s.historyDetailMetaValue}>{historyDetail.total_tokens}</span>
                      </div>
                      <div className={s.historyDetailMetaItem}>
                        <span className={s.historyDetailMetaLabel}>{t('app.generation.historyDetailSteps')}</span>
                        <span className={s.historyDetailMetaValue}>{historyDetail.total_steps}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  {historyDetail.inputs && Object.keys(historyDetail.inputs).length > 0 && (
                    <div className={s.historyDetailSection}>
                      <div className={s.historyDetailSectionTitle}>{t('app.generation.historyDetailInputs')}</div>
                      <div className={s.historyDetailContent}>
                        {JSON.stringify(historyDetail.inputs, null, 2)}
                      </div>
                    </div>
                  )}

                  {/* Outputs */}
                  {historyDetail.outputs && Object.keys(historyDetail.outputs).length > 0 && (
                    <div className={s.historyDetailSection}>
                      <div className={s.historyDetailSectionTitle}>{t('app.generation.historyDetailOutputs')}</div>
                      <div className={s.historyDetailContent}>
                        {typeof historyDetail.outputs === 'string'
                          ? historyDetail.outputs
                          : JSON.stringify(historyDetail.outputs, null, 2)}
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {historyDetail.error && (
                    <div className={s.historyDetailSection}>
                      <div className={s.historyDetailSectionTitle}>{t('app.generation.historyDetailError')}</div>
                      <div className={s.historyError}>
                        {historyDetail.error}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Completion
