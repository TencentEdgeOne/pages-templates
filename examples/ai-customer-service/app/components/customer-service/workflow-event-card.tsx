'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { WorkflowEventMessage } from '@/types/app'
import { WorkflowRunningStatus, BlockEnum } from '@/types/app'

type Props = {
  event: WorkflowEventMessage
}

const STATUS_LABEL: Record<WorkflowRunningStatus, string> = {
  [WorkflowRunningStatus.Waiting]: 'Waiting',
  [WorkflowRunningStatus.Running]: 'Running…',
  [WorkflowRunningStatus.Succeeded]: 'Completed',
  [WorkflowRunningStatus.Failed]: 'Failed',
  [WorkflowRunningStatus.Stopped]: 'Stopped',
}

const NODE_TYPE_LABEL: Partial<Record<BlockEnum, string>> = {
  [BlockEnum.Start]: 'Start',
  [BlockEnum.End]: 'End',
  [BlockEnum.Answer]: 'Output',
  [BlockEnum.LLM]: 'LLM',
  [BlockEnum.KnowledgeRetrieval]: 'Knowledge Retrieval',
  [BlockEnum.QuestionClassifier]: 'Question Classifier',
  [BlockEnum.IfElse]: 'Condition Branch',
  [BlockEnum.Code]: 'Code',
  [BlockEnum.HttpRequest]: 'HTTP Request',
  [BlockEnum.Tool]: 'Tool',
  [BlockEnum.TemplateTransform]: 'Template Transform',
  [BlockEnum.VariableAssigner]: 'Variable Assigner',
}

export const WorkflowEventCard: React.FC<Props> = ({ event }) => {
  const [expanded, setExpanded] = useState(event.expanded ?? false)

  // Sync controlled-expansion state when parent drives event.expanded
  useEffect(() => {
    if (event.expanded !== undefined) {
      setExpanded(event.expanded)
    }
  }, [event.expanded])

  const isRunning = event.status === WorkflowRunningStatus.Running || event.status === WorkflowRunningStatus.Waiting
  const isSuccess = event.status === WorkflowRunningStatus.Succeeded
  const isFailed = event.status === WorkflowRunningStatus.Failed || event.status === WorkflowRunningStatus.Stopped

  return (
    <div className="wf-card">
      {/* Top status bar */}
      <div className={`wf-card__header wf-card__header--${event.status}`}>
        <span className="wf-card__status-icon">
          {isSuccess && <CheckCircleIcon aria-hidden="true" className="wf-icon wf-icon--success" />}
          {isFailed && <XCircleIcon aria-hidden="true" className="wf-icon wf-icon--error" />}
          {isRunning && <ClockIcon aria-hidden="true" className="wf-icon wf-icon--running wf-spin" />}
        </span>
        <span className="wf-card__status-label">{STATUS_LABEL[event.status]}</span>
        {event.elapsedMs !== undefined && (
          <span className="wf-card__elapsed">{(event.elapsedMs / 1000).toFixed(2)}s</span>
        )}
        {event.nodes.length > 0 && (
          <button
            type="button"
            className="wf-card__toggle"
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? 'Collapse node details' : 'Expand node details'}
          >
            {expanded
              ? <ChevronDownIcon aria-hidden="true" className="wf-icon" />
              : <ChevronRightIcon aria-hidden="true" className="wf-icon" />}
            <span>{event.nodes.length} node(s)</span>
          </button>
        )}
      </div>

      {/* Node timeline */}
      {expanded && event.nodes.length > 0 && (
        <div className="wf-card__timeline">
          {event.nodes.map((node) => (
            <div key={node.id} className={`wf-node wf-node--${node.status}`}>
              <div className="wf-node__dot" />
              <div className="wf-node__body">
                <span className="wf-node__title">
                  {NODE_TYPE_LABEL[node.node_type] ?? node.node_type}
                  {node.title && NODE_TYPE_LABEL[node.node_type] !== node.title ? ` · ${node.title}` : ''}
                </span>
                <span className="wf-node__time">{node.elapsed_time.toFixed(2)}s</span>
                {node.error && (
                  <p className="wf-node__error">{node.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error details */}
      {isFailed && event.error && (
        <div className="wf-card__error-detail">
          <p>{event.error}</p>
        </div>
      )}
    </div>
  )
}

export default WorkflowEventCard
