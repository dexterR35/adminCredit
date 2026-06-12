import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { HiXMark } from 'react-icons/hi2'
import {
  Button,
  ProgressLoader,
  AsyncProgressBar,
  Loader,
} from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { CatalogTable, DemoToggle } from '../shared.jsx'

const TASK_SAVE_STEPS = [
  'Preparing…',
  'Updating Tempo worklog…',
  'Saving task…',
  'Saving details…',
]

const LOADER_CATALOG = [
  { component: 'Loader', where: 'Router suspense, auth gates', file: 'src/app/router.jsx' },
  { component: 'ProgressLoader', where: 'DataTable loading body', file: 'src/components/Table/DataTable.jsx' },
  { component: 'ProgressLoader', where: 'Chat asset grid initial load', file: 'src/features/chatAssets/components/ChatAssetGrid.jsx' },
  { component: 'ProgressLoader', where: 'Analytics dashboard shell', file: 'src/features/analytics/components/AnalyticsDashboardShell.jsx' },
  { component: 'ProgressLoader', where: 'Task form save overlay', file: 'src/features/tasks/components/TaskForm/TaskForm.jsx' },
  { component: 'ProgressLoader', where: 'Chat full history import panel', file: 'src/features/chatAssets/components/FullSyncPanel.jsx' },
  { component: 'ProgressLoader', where: 'Floating chat sync toast', file: 'src/features/chatAssets/components/FloatingSyncBar.jsx' },
  { component: 'AsyncProgressBar', where: 'Slide generation modal', file: 'src/components/ui/SlideProgressModal.jsx' },
]

function ElapsedTimer({ running }) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now()
      setElapsed(0)
      const tick = () => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  return (
    <span className="chat-sync-progress__stats">
      {mins > 0 ? `${mins}m ` : ''}
      {String(secs).padStart(2, '0')}s
    </span>
  )
}

ElapsedTimer.propTypes = {
  running: PropTypes.bool,
}

export default function LoadersSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'loaders')
  const [pageLoading, setPageLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [gridLoading, setGridLoading] = useState(false)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [taskSaving, setTaskSaving] = useState(false)
  const [taskStep, setTaskStep] = useState(0)
  const [importPanel, setImportPanel] = useState(false)
  const [floatingSync, setFloatingSync] = useState(false)
  const [slideModal, setSlideModal] = useState(false)
  const [slideCurrent, setSlideCurrent] = useState(0)
  const [slideTotal, setSlideTotal] = useState(0)
  const [slideLabel, setSlideLabel] = useState('Fetching tasks…')

  useEffect(() => {
    if (!taskSaving) {
      setTaskStep(0)
      return undefined
    }
    let step = 0
    const interval = window.setInterval(() => {
      step = (step + 1) % TASK_SAVE_STEPS.length
      setTaskStep(step)
    }, 1500)
    return () => window.clearInterval(interval)
  }, [taskSaving])

  useEffect(() => {
    if (!slideModal) {
      setSlideCurrent(0)
      setSlideTotal(0)
      setSlideLabel('Fetching tasks…')
      return undefined
    }
    setSlideCurrent(0)
    setSlideTotal(0)
    setSlideLabel('Fetching tasks…')
    const startTimer = window.setTimeout(() => {
      setSlideTotal(24)
      setSlideLabel('Building slides…')
    }, 1200)
    const progressTimer = window.setInterval(() => {
      setSlideCurrent((value) => (value >= 24 ? value : value + 1))
    }, 400)
    return () => {
      window.clearTimeout(startTimer)
      window.clearInterval(progressTimer)
    }
  }, [slideModal])

  return (
    <UiCheckSection
      id="loaders"
      title="Loaders"
      description="Loader spinner for routes. ProgressLoader (Google bar) for data and async work. AsyncProgressBar when slide counts exist."
      sources={section?.sources}
    >
      <DemoCard title="Where each loader is used" subtitle="Matches production placement">
        <CatalogTable
          columns={[
            { key: 'component', label: 'Component' },
            { key: 'where', label: 'Placement' },
            { key: 'file', label: 'Source', mono: true },
          ]}
          rows={LOADER_CATALOG}
        />
      </DemoCard>

      <DemoCard title="Loader — routes" subtitle="CSS: spinner · min-h 40vh · router.jsx">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface">
            {pageLoading ? (
              <Loader />
            ) : (
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-tertiary">
                Lazy route / auth gate
              </div>
            )}
          </div>
          <DemoToggle running={pageLoading} onToggle={() => setPageLoading((v) => !v)} />
        </div>
      </DemoCard>

      <DemoCard title="ProgressLoader — table / grid / analytics" subtitle="CSS: chat-sync-progress__bar--active">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { label: 'Table', running: tableLoading, set: setTableLoading, child: (
              <ProgressLoader label="Loading tasks…" centered className="min-h-48" />
            ) },
            { label: 'Chat grid', running: gridLoading, set: setGridLoading, child: (
              <ProgressLoader label="Loading assets…" centered className="min-h-48" />
            ) },
            { label: 'Analytics', running: analyticsLoading, set: setAnalyticsLoading, child: (
              <ProgressLoader label="Loading analytics…" centered className="min-h-40" />
            ) },
          ].map(({ label, running, set, child }) => (
            <div key={label} className="rounded-lg border border-border-subtle bg-surface p-3 space-y-3">
              <p className="text-xs font-semibold text-ink-secondary">{label}</p>
              <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-elevated">
                {running ? child : (
                  <div className="flex min-h-48 items-center justify-center text-xs text-ink-tertiary">Idle</div>
                )}
              </div>
              <DemoToggle running={running} onToggle={() => set((v) => !v)} runLabel={`Run ${label}`} />
            </div>
          ))}
        </div>
      </DemoCard>

      <DemoCard title="ProgressLoader — task save overlay" subtitle="CSS: task-form__overlay · task-form__progress">
        <div className="space-y-4">
          <form className="relative task-form min-h-52 rounded-lg border border-border-subtle bg-surface-elevated p-6">
            <p className="text-sm text-ink-secondary">Task form fields…</p>
            {taskSaving && (
              <div className="task-form__overlay">
                <ProgressLoader label={TASK_SAVE_STEPS[taskStep]} className="task-form__progress px-4" />
              </div>
            )}
          </form>
          <DemoToggle running={taskSaving} onToggle={() => setTaskSaving((v) => !v)} runLabel="Run save overlay" />
        </div>
      </DemoCard>

      <DemoCard title="ProgressLoader — chat sync" subtitle="FullSyncPanel + FloatingSyncBar">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-3">
            <p className="text-xs font-semibold text-ink-secondary">Import panel</p>
            {importPanel ? (
              <>
                <ProgressLoader label="Importing history…" trailing={<ElapsedTimer running />} />
                <p className="chat-sync-progress__stats">12 batches · 4,820 messages · 186 assets</p>
              </>
            ) : (
              <p className="text-sm text-ink-tertiary">Idle</p>
            )}
            <DemoToggle running={importPanel} onToggle={() => setImportPanel((v) => !v)} runLabel="Run panel" />
          </div>
          <div className="relative min-h-40 rounded-lg border border-dashed border-border-subtle bg-surface-muted p-4">
            <p className="text-xs font-semibold text-ink-secondary mb-2">Floating toast</p>
            {floatingSync && (
              <div className="absolute bottom-3 right-3 w-64 rounded-xl border border-border-subtle bg-surface-elevated shadow-lg p-3">
                <ProgressLoader
                  label="Importing Chat history…"
                  trailing={(
                    <button type="button" className="text-ink-tertiary" onClick={() => setFloatingSync(false)} aria-label="Stop">
                      <HiXMark className="h-4 w-4" />
                    </button>
                  )}
                />
              </div>
            )}
            <DemoToggle running={floatingSync} onToggle={() => setFloatingSync((v) => !v)} runLabel="Run toast" />
          </div>
        </div>
      </DemoCard>

      <DemoCard title="AsyncProgressBar — slides" subtitle="CSS: progress-bar · progress-bar__fill · SlideProgressModal only">
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-border-subtle bg-surface-elevated p-5">
          {slideModal ? (
            <>
              <AsyncProgressBar label={slideLabel} current={slideCurrent} total={slideTotal} indeterminate={slideTotal <= 0} />
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" type="button" onClick={() => setSlideModal(false)}>Cancel</Button>
              </div>
            </>
          ) : (
            <p className="py-4 text-center text-sm text-ink-tertiary">Indeterminate → determinate 24 slides</p>
          )}
          <DemoToggle running={slideModal} onToggle={() => setSlideModal((v) => !v)} runLabel="Run slide progress" />
        </div>
      </DemoCard>
    </UiCheckSection>
  )
}
