import PropTypes from 'prop-types'
import { Card, CardBody } from './index.js'
import { cx } from './utils.js'

export function SourceFiles({ files = [] }) {
  if (!files.length) return null
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {files.map((file) => (
        <li
          key={file}
          className="rounded-md border border-border-subtle bg-surface-muted px-2 py-0.5 font-mono text-[11px] text-ink-tertiary"
        >
          {file}
        </li>
      ))}
    </ul>
  )
}

export default function UiCheckSection({
  id,
  title,
  description,
  sources = [],
  className = '',
  children,
}) {
  return (
    <section id={id} className={cx('scroll-mt-24', className)}>
      <header className="mb-5 border-b border-border-subtle pb-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-primary">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm text-ink-secondary">{description}</p>
        ) : null}
        <SourceFiles files={sources} />
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export function DemoCard({ title, subtitle, children, className = '' }) {
  return (
    <Card className={className}>
      {(title || subtitle) && (
        <div className="border-b border-border-subtle px-4 py-3">
          {title ? <h3 className="text-sm font-semibold text-ink-primary">{title}</h3> : null}
          {subtitle ? <p className="mt-0.5 text-xs text-ink-tertiary">{subtitle}</p> : null}
        </div>
      )}
      <CardBody>{children}</CardBody>
    </Card>
  )
}

SourceFiles.propTypes = {
  files: PropTypes.arrayOf(PropTypes.string),
}

UiCheckSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  sources: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

DemoCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
