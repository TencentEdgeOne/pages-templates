/**
 * /support full-page customer service entry
 *
 * Standalone full-screen customer service page with a persistent history sidebar,
 * for direct user access. Reuses the AppEntry unified entry component (isEmbed=false).
 */
import React from 'react'
import NavBar from '@/app/components/nav-bar'
import AppEntry from '@/app/components'

const SupportPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <NavBar />
    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <AppEntry />
    </div>
  </div>
)

export default SupportPage
