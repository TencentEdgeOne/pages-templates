'use client'

import React from 'react'
import styles from './draggable-widget.module.css'

interface WidgetButtonProps {
  onClick: () => void
}

/**
 * WidgetButton
 *
 * Bottom-right floating trigger button: a circular orange button with a
 * breathing animation that expands the chat panel on click.
 */
const WidgetButton: React.FC<WidgetButtonProps> = ({ onClick }) => {
  return (
    <button
      className={styles.triggerBtn}
      onClick={onClick}
      aria-label="Open AI customer service"
      title="Open AI customer service"
    >
      {/* Chat bubble SVG icon */}
      <svg
        className={styles.triggerIcon}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}

export default WidgetButton
