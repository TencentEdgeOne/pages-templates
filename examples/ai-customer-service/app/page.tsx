import NavBar from '@/app/components/nav-bar'
import DemoHomePage from '@/app/components/demo-home-page'

/**
 * Home page: deployment effect demo
 *
 * Shows what it looks like to deploy the AI customer service template on your own website —
 * the main body is a simulated product landing page, with a draggable AI service widget
 * overlaid in the bottom-right corner.
 */
const App = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <NavBar />
    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <DemoHomePage />
    </div>
  </div>
)

export default App
