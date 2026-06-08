import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { UI_USAGE_MAP, PAGE_UI_MAP } from '../usageMap.js'

const COMPONENT_COUNT = UI_USAGE_MAP.length
const PAGE_COUNT = PAGE_UI_MAP.length
const USAGE_COUNT = UI_USAGE_MAP.reduce((n, row) => n + row.usages.length, 0)

export default function OverviewSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'overview')

  return (
    <UiCheckSection
      id="overview"
      title="Overview"
      description="Living catalog synced with this repo. Use Usage map (next section) to see every file that imports each component."
      sources={section?.sources}
    >
      <DemoCard title="At a glance" subtitle="Counts from usageMap.js — updated with the codebase">
        <dl className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-lg border border-border-subtle bg-surface-muted px-4 py-3">
            <dt className="text-ink-tertiary">UI components tracked</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink-primary">{COMPONENT_COUNT}</dd>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface-muted px-4 py-3">
            <dt className="text-ink-tertiary">Import sites</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink-primary">{USAGE_COUNT}</dd>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface-muted px-4 py-3">
            <dt className="text-ink-tertiary">Pages / routes</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink-primary">{PAGE_COUNT}</dd>
          </div>
        </dl>
      </DemoCard>

      <DemoCard title="How to use this page" subtitle="Sidebar jumps to live previews + CSS reference">
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-secondary">
          <li><strong>Usage map</strong> — searchable table of component → file → context (matches your JSX imports).</li>
          <li><strong>Loaders / Buttons / Badges / Forms</strong> — live demos + CSS class names from index.css.</li>
          <li><strong>By page</strong> — which UI each route uses (Dashboard, Chat Assets, Management, etc.).</li>
          <li>Loader demos have <strong>Run</strong> buttons to preview animations.</li>
        </ul>
      </DemoCard>

      <DemoCard title="Exceptions (not shared Button/Input)" subtitle="Custom markup still in the app">
        <ul className="space-y-2 text-sm text-ink-secondary">
          <li>
            <code className="text-xs">src/pages/LoginPage.jsx</code> —{' '}
            <code className="text-xs">.login-submit</code> + <code className="text-xs">.login-spinner</code> (native button)
          </li>
          <li>
            <code className="text-xs">AnalyticsSectionNav</code> — grouped sidebar for analytics breakdown (not horizontal Tabs)
          </li>
        </ul>
      </DemoCard>
    </UiCheckSection>
  )
}
