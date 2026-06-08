import { useState } from 'react'
import { HiArrowPath, HiPlus, HiTrash } from 'react-icons/hi2'
import { Button, BUTTON_VARIANT_CLASS, BUTTON_VARIANT_KEYS } from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { CatalogTable } from '../shared.jsx'

const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl']
const VARIANT_ALIASES = { default: 'primary' }
const UNIQUE_VARIANTS = BUTTON_VARIANT_KEYS.filter((key) => !VARIANT_ALIASES[key])

const IN_APP = [
  { group: 'Primary', where: 'Dashboard, forms, connect, Chat import', variant: 'primary', size: 'sm', label: 'Create Board', icon: HiPlus },
  { group: 'Secondary', where: 'Cancel in modals', variant: 'secondary', size: 'md', label: 'Cancel' },
  { group: 'Outline', where: 'Export, retry, toolbar', variant: 'outline', size: 'sm', label: 'Export' },
  { group: 'Ghost', where: 'Close, dismiss, reset', variant: 'ghost', size: 'sm', label: 'Close' },
  { group: 'Danger muted', where: 'Stop sync, confirm delete', variant: 'dangerMuted', size: 'sm', label: 'Stop', icon: HiTrash },
  { group: 'Compact xs', where: 'TaskForm Jira edit', variant: 'outline', size: 'xs', label: 'Edit link' },
]

export default function ButtonsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'buttons')
  const [loadingDemo, setLoadingDemo] = useState(false)

  return (
    <UiCheckSection
      id="buttons"
      title="Buttons"
      description="All Button variant and size props. CSS classes live in index.css under .btn-*."
      sources={section?.sources}
    >
      <DemoCard title="Variant → CSS map" subtitle="From BUTTON_VARIANT_CLASS in Button.jsx">
        <CatalogTable
          columns={[
            { key: 'variant', label: 'variant prop' },
            { key: 'css', label: 'CSS class', mono: true },
            { key: 'alias', label: 'Alias' },
          ]}
          rows={BUTTON_VARIANT_KEYS.map((variant) => ({
            variant,
            css: BUTTON_VARIANT_CLASS[variant],
            alias: VARIANT_ALIASES[variant] ?? '—',
          }))}
          rowKey="variant"
        />
      </DemoCard>

      <DemoCard title="All variants" subtitle='size="md"'>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {UNIQUE_VARIANTS.map((variant) => (
            <div key={variant} className="rounded-lg border border-border-subtle bg-surface-muted p-3 space-y-2">
              <p className="text-xs font-semibold text-ink-primary">{variant}</p>
              <p className="font-mono text-[10px] text-ink-tertiary">{BUTTON_VARIANT_CLASS[variant]}</p>
              <Button type="button" variant={variant} size="md">{variant}</Button>
            </div>
          ))}
        </div>
      </DemoCard>

      <DemoCard title="All sizes" subtitle='variant="primary" · CSS .btn-sm / .btn-lg'>
        <div className="flex flex-wrap items-end gap-4">
          {BUTTON_SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-ink-tertiary">{size}</span>
              <Button type="button" variant="primary" size={size}>Primary</Button>
            </div>
          ))}
        </div>
      </DemoCard>

      <DemoCard title="States & layout" subtitle="loading · disabled · fullWidth · icon">
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="primary" disabled>Disabled</Button>
          <Button type="button" variant="primary" loading={loadingDemo} onClick={() => setLoadingDemo((v) => !v)}>
            {loadingDemo ? 'Loading…' : 'Toggle loading'}
          </Button>
          <Button type="button" variant="outline" size="sm" loading>Export…</Button>
          <Button type="button" variant="primary" size="sm" icon={HiPlus}>Icon left</Button>
          <Button type="button" variant="outline" size="sm" icon={HiArrowPath} iconPosition="right">Icon right</Button>
        </div>
        <div className="mt-4 max-w-xs">
          <Button type="button" variant="primary" fullWidth>Full width</Button>
        </div>
      </DemoCard>

      <DemoCard title="Used in the app today" subtitle="Real variant + size combinations">
        <div className="space-y-3">
          {IN_APP.map((row) => (
            <div key={row.group} className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-surface-muted px-3 py-2">
              <div className="min-w-[8rem]">
                <p className="text-xs font-semibold text-ink-primary">{row.group}</p>
                <p className="text-[11px] text-ink-tertiary">{row.where}</p>
              </div>
              <Button type="button" variant={row.variant} size={row.size} icon={row.icon}>{row.label}</Button>
              <code className="ml-auto hidden text-[10px] text-ink-tertiary sm:inline">
                {row.variant} · {row.size}
              </code>
            </div>
          ))}
        </div>
      </DemoCard>
    </UiCheckSection>
  )
}
