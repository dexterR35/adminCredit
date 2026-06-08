import { useState } from 'react'
import { Tabs } from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'

const TAB_OPTIONS = [
  { value: 'overview', label: 'Overview' },
  { value: 'acquisition', label: 'Acquisition' },
  { value: 'marketing', label: 'Marketing' },
]

export default function TabsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'tabs')
  const [tab, setTab] = useState('overview')

  return (
    <UiCheckSection
      id="tabs"
      title="Tabs"
      description="Google-style underline tabs — accent bottom border when selected. Used in ContextBar and LookupManager."
      sources={section?.sources}
    >
      <DemoCard title="Tabs component" subtitle="Google-style underline tabs — accent bottom border when selected">
        <Tabs value={tab} onChange={setTab} options={TAB_OPTIONS} />
        <p className="mt-4 text-sm text-ink-tertiary">
          Production: <code className="text-xs">ContextBar.jsx</code> (Dashboard, Management, Analytics rows),{' '}
          <code className="text-xs">LookupManager.jsx</code> (Markets, Products, Departments, AI Used).
          Analytics breakdown sidebar uses <code className="text-xs">AnalyticsSectionNav</code>.
        </p>
      </DemoCard>
    </UiCheckSection>
  )
}
