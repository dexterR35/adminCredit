import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { CatalogTable } from '../shared.jsx'

const CSS_GROUPS = [
  {
    title: 'Buttons',
    classes: [
      { class: '.btn-primary', used: 'Primary actions' },
      { class: '.btn-secondary', used: 'Cancel' },
      { class: '.btn-outline', used: 'Export, toolbar' },
      { class: '.btn-ghost', used: 'Dismiss, nav menu rows' },
      { class: '.btn-danger-muted', used: 'Stop sync, delete confirm, destructive actions' },
      { class: '.btn-gray', used: 'Neutral secondary' },
      { class: '.btn-link', used: 'Text link style' },
      { class: '.btn-tone--*', used: 'Semantic tone buttons' },
      { class: '.btn-sm / .btn-lg', used: 'Size modifiers' },
    ],
  },
  {
    title: 'Badges',
    classes: [
      { class: '.badge', used: 'Base chip' },
      { class: '.badge--default', used: 'Default / primary badge' },
      { class: '.badge--accent', used: 'Active, selected toggle' },
      { class: '.badge--slate', used: 'Neutral, Edit button' },
      { class: '.badge--success / .badge--error', used: 'Diff chips, status' },
      { class: '.badge--warning / .badge--info / .badge--sky', used: 'Semantic tones' },
    ],
  },
  {
    title: 'Forms',
    classes: [
      { class: '.input-wrap', used: 'Field container' },
      { class: '.input', used: 'Input & select' },
      { class: '.input--error', used: 'Invalid state' },
      { class: '.input-label', used: 'Label' },
      { class: '.input-error / .input-hint', used: 'Messages' },
      { class: '.input--sm / .input--lg', used: 'Sizes' },
      { class: '.input-color', used: 'ColorInput picker' },
      { class: '.checkbox-wrap', used: 'Checkbox field' },
    ],
  },
  {
    title: 'Layout',
    classes: [
      { class: '.card', used: 'Panel shell' },
      { class: '.card-header', used: 'Card title row' },
      { class: '.page-title', used: 'H1 pages' },
      { class: '.summary-card__*', used: 'SummaryCard metrics' },
      { class: '.tabs / .tabs__tab', used: 'Tabs component' },
    ],
  },
  {
    title: 'Loaders & progress',
    classes: [
      { class: '.chat-sync-progress__bar--active', used: 'ProgressLoader animation' },
      { class: '.chat-sync-progress__label', used: 'Progress label text' },
      { class: '.progress-bar', used: 'AsyncProgressBar track' },
      { class: '.progress-bar__fill', used: 'Determinate fill' },
      { class: '.progress-bar--indeterminate', used: 'Shimmer fallback' },
      { class: '.task-form__overlay', used: 'Task save dimmer' },
    ],
  },
  {
    title: 'Skeletons',
    classes: [
      { class: '.skeleton', used: 'Shimmer block' },
      { class: '.skeleton-card', used: 'Card placeholder' },
      { class: '.skeleton-table', used: 'Table placeholder' },
    ],
  },
]

const CSS_VARS = [
  '--accent', '--surface', '--surface-elevated', '--surface-muted',
  '--ink-primary', '--ink-secondary', '--ink-tertiary',
  '--border', '--border-subtle', '--radius-control', '--radius-surface',
]

export default function CssReferenceSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'css')

  return (
    <UiCheckSection
      id="css"
      title="CSS classes & tokens"
      description="Key selectors from src/index.css mapped to where they appear in JSX."
      sources={section?.sources}
    >
      <DemoCard title="Design tokens (:root)" subtitle="Semantic CSS variables used across components">
        <div className="flex flex-wrap gap-2">
          {CSS_VARS.map((token) => (
            <div
              key={token}
              className="flex items-center gap-2 rounded-md border border-border-subtle bg-surface-muted px-2 py-1"
            >
              <span
                className="h-4 w-4 shrink-0 rounded border border-border-subtle"
                style={{ background: token.includes('ink') || token.includes('border') ? `var(${token})` : `var(${token})` }}
              />
              <code className="text-[11px] text-ink-tertiary">{token}</code>
            </div>
          ))}
        </div>
      </DemoCard>

      {CSS_GROUPS.map((group) => (
        <DemoCard key={group.title} title={group.title} subtitle="index.css selectors">
          <CatalogTable
            columns={[
              { key: 'class', label: 'Class', mono: true },
              { key: 'used', label: 'Used for' },
            ]}
            rows={group.classes.map((row, i) => ({ ...row, id: `${group.title}-${i}` }))}
            rowKey="id"
          />
        </DemoCard>
      ))}
    </UiCheckSection>
  )
}
