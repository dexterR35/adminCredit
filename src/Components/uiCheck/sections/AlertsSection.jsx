import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'

export default function AlertsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'alerts')

  return (
    <UiCheckSection
      id="alerts"
      title="Alerts & banners"
      description="Inline feedback blocks from index.css — not separate components."
      sources={section?.sources}
    >
      <DemoCard title="Task form alerts" subtitle=".task-form__alert · .task-form__alert--error">
        <div className="space-y-3 max-w-xl">
          <div className="task-form__alert rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <p className="font-medium">Classification only</p>
            <p className="text-xs mt-0.5 text-amber-800">Metadata-only edit warning.</p>
          </div>
          <div className="task-form__alert task-form__alert--error">
            <p className="font-semibold">Please fix the following:</p>
            <ul className="list-disc list-inside text-xs space-y-0.5 mt-1">
              <li>Start Date: required</li>
            </ul>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Empty states" subtitle=".data-table-empty">
        <div className="data-table-empty text-ink-tertiary py-10 text-center text-sm">
          No rows match your filters.
        </div>
      </DemoCard>
    </UiCheckSection>
  )
}
