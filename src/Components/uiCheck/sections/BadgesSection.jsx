import { useState } from 'react'
import {
  ActiveToggleBadge,
  BADGE_VARIANT_CLASS,
  BADGE_VARIANT_KEYS,
  Badge,
  ErrorBadge,
  ToggleOptionBadge,
} from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'
import { CatalogTable } from '../shared.jsx'

const BADGE_CSS_MODIFIERS = [...new Set(Object.values(BADGE_VARIANT_CLASS))]

export default function BadgesSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'badges')
  const [toggleOn, setToggleOn] = useState(true)
  const [active, setActive] = useState(true)

  return (
    <UiCheckSection
      id="badges"
      title="Badges"
      description="Status chips and badge-as-button patterns. CSS: .badge and .badge--* in index.css."
      sources={section?.sources}
    >
      <DemoCard title="Variant to CSS class" subtitle="BADGE_VARIANT_CLASS maps prop to badge--* class">
        <CatalogTable
          columns={[
            { key: 'variant', label: 'variant prop' },
            { key: 'modifier', label: 'CSS class', mono: true },
          ]}
          rows={BADGE_VARIANT_KEYS.map((variant) => ({
            variant,
            modifier: BADGE_VARIANT_CLASS[variant],
          }))}
          rowKey="variant"
        />
      </DemoCard>

      <DemoCard title="All badge classes" subtitle="Unique .badge--* classes">
        <div className="flex flex-wrap gap-2">
          {BADGE_CSS_MODIFIERS.map((modifier) => (
            <span key={modifier} className={`badge ${modifier}`}>
              {modifier}
            </span>
          ))}
        </div>
      </DemoCard>

      <DemoCard title="Badge variants" subtitle="Default Badge component">
        <div className="flex flex-wrap gap-2">
          {BADGE_VARIANT_KEYS.map((variant) => (
            <Badge key={variant} variant={variant}>{variant}</Badge>
          ))}
        </div>
      </DemoCard>

      <DemoCard title="Badge as button" subtitle="Edit and delete actions">
        <div className="flex flex-wrap gap-3">
          <Badge as="button" type="button" variant="slate" interactive>Edit</Badge>
          <Badge as="button" type="button" variant="error" interactive>Delete</Badge>
        </div>
      </DemoCard>

      <DemoCard title="Toggle badges" subtitle="Selected state uses accent">
        <div className="flex flex-wrap gap-2">
          <ToggleOptionBadge label="UK" checked={toggleOn} onClick={() => setToggleOn((v) => !v)} />
          <ToggleOptionBadge label="DE" checked={false} onClick={() => {}} />
          <ToggleOptionBadge label="Disabled" checked={false} disabled />
        </div>
      </DemoCard>

      <DemoCard title="Active toggle" subtitle="Active / Inactive">
        <ActiveToggleBadge active={active} onClick={() => setActive((v) => !v)} />
      </DemoCard>

      <DemoCard title="ErrorBadge" subtitle="Positive and negative deltas">
        <div className="flex flex-wrap gap-2">
          <ErrorBadge diff={12} />
          <ErrorBadge diff={-8} />
          <ErrorBadge diff={0} hideZero={false} />
        </div>
      </DemoCard>
    </UiCheckSection>
  )
}
