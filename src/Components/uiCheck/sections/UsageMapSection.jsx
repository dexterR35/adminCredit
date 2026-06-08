import { useMemo, useState } from 'react'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { CatalogTable } from '../shared.jsx'
import { UI_USAGE_MAP, PAGE_UI_MAP, NOT_IN_INDEX } from '../usageMap.js'

export default function UsageMapSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'usage-map')
  const [filter, setFilter] = useState('')
  const q = filter.trim().toLowerCase()

  const filteredComponents = useMemo(() => {
    if (!q) return UI_USAGE_MAP
    return UI_USAGE_MAP.filter(
      (row) =>
        row.component.toLowerCase().includes(q)
        || row.source.toLowerCase().includes(q)
        || row.usages.some(
          (u) => u.file.toLowerCase().includes(q) || (u.note || '').toLowerCase().includes(q),
        ),
    )
  }, [q])

  const usageRows = useMemo(
    () =>
      filteredComponents.flatMap((row) =>
        row.usages.map((usage, index) => ({
          id: `${row.component}-${index}`,
          component: row.component,
          source: row.source,
          css: row.css,
          file: usage.file,
          note: usage.note || '—',
        })),
      ),
    [filteredComponents],
  )

  return (
    <UiCheckSection
      id="usage-map"
      title="Where components are used"
      description="Every import of src/components/ui across pages and features. Filter by component name, file path, or screen."
      sources={section?.sources}
    >
      <DemoCard title="Filter usage map" subtitle="Search component, path, or note">
        <input
          id="ui-check-usage-map-filter"
          name="usageMapFilter"
          type="search"
          className="input max-w-md"
          placeholder="e.g. TaskForm, Button, chat-assets…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </DemoCard>

      <DemoCard
        title="Component → file map"
        subtitle={`${usageRows.length} usage rows · ${filteredComponents.length} components`}
      >
        <CatalogTable
          columns={[
            { key: 'component', label: 'Component' },
            { key: 'file', label: 'Used in', mono: true },
            { key: 'note', label: 'Context' },
            { key: 'css', label: 'CSS', mono: true },
          ]}
          rows={usageRows}
          rowKey="id"
        />
      </DemoCard>

      <DemoCard title="By page / route" subtitle="What each screen pulls from the design system">
        <CatalogTable
          columns={[
            { key: 'page', label: 'Page' },
            { key: 'route', label: 'Route', mono: true },
            { key: 'file', label: 'File', mono: true },
            { key: 'components', label: 'UI used' },
          ]}
          rows={PAGE_UI_MAP.map((row) => ({
            ...row,
            components: Array.isArray(row.components) ? row.components.join(', ') : row.components,
          }))}
          rowKey="route"
        />
      </DemoCard>

      <DemoCard title="Not in components/ui/index.js" subtitle="Imported directly from their files">
        <CatalogTable
          columns={[
            { key: 'name', label: 'Component' },
            { key: 'file', label: 'File', mono: true },
            { key: 'note', label: 'Note' },
          ]}
          rows={NOT_IN_INDEX}
          rowKey="name"
        />
      </DemoCard>
    </UiCheckSection>
  )
}
