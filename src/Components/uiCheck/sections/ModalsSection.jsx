import { Button } from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { CatalogTable } from '../shared.jsx'
import { UI_USAGE_MAP } from '../usageMap.js'

const modalRow = UI_USAGE_MAP.find((r) => r.component === 'Modal')
const modalUsages = modalRow?.usages ?? []

export default function ModalsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'modals')

  return (
    <UiCheckSection
      id="modals"
      title="Modals"
      description="Dialog shell used across the app. Pass title + badge + subtitle on Modal; footer uses Cancel (secondary sm) + action (primary sm)."
      sources={section?.sources}
    >
      <DemoCard title="Modal usage in codebase" subtitle={`${modalUsages.length} import sites`}>
        <CatalogTable
          columns={[
            { key: 'file', label: 'File', mono: true },
            { key: 'note', label: 'Context' },
          ]}
          rows={modalUsages.map((u, i) => ({ ...u, id: i }))}
          rowKey="id"
        />
      </DemoCard>

      <DemoCard title="Modal chrome (static preview)" subtitle="Same layout as live Modal — title, slate badge, subtitle, footer">
        <div className="modal-panel modal-panel--md mx-auto overflow-hidden">
          <div className="modal-header">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap min-w-0 w-full">
                <h2 className="modal-title shrink-0 m-0">Export CSV</h2>
                <span className="badge badge--slate shrink-0">Export</span>
              </div>
              <p className="modal-subtitle">tasks_export</p>
            </div>
          </div>
          <div className="modal-body text-sm text-ink-secondary">
            Modal body — forms, pickers, or confirm text go here.
          </div>
          <div className="modal-footer">
            <Button type="button" variant="secondary" size="sm">Cancel</Button>
            <Button type="button" size="sm">Confirm</Button>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="SlideProgressModal" subtitle="Dashboard only · wraps Modal + AsyncProgressBar">
        <p className="text-sm text-ink-secondary">
          Used in <code className="text-xs">src/pages/DashboardPage.jsx</code> when generating board presentations.
          See <strong>Loaders</strong> section for the live progress demo.
        </p>
      </DemoCard>
    </UiCheckSection>
  )
}
