import { Button } from './index.js'

export function DemoToggle({ running, onToggle, runLabel = 'Run', stopLabel = 'Stop' }) {
  return (
    <Button type="button" onClick={onToggle}>
      {running ? stopLabel : runLabel}
    </Button>
  )
}

export function CatalogTable({ columns, rows, rowKey = 'file' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-subtle">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-muted text-left text-ink-tertiary">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey] ?? row.id} className="border-b border-border-subtle last:border-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-2 ${col.mono ? 'font-mono text-xs text-ink-tertiary' : 'text-ink-secondary'}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
