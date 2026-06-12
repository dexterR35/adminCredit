import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { UI_CHECK_GROUPS, UI_CHECK_SECTIONS } from './config.js'
import { cx } from './utils.js'

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function UiCheckShell({
  children,
  sections = UI_CHECK_SECTIONS,
  groups = UI_CHECK_GROUPS,
  navAriaLabel = 'UI Check sections',
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? 'overview')

  useEffect(() => {
    if (!sections.some((s) => s.id === activeId)) {
      setActiveId(sections[0]?.id ?? 'overview')
    }
  }, [activeId, sections])

  const grouped = useMemo(() => {
    return groups.map((group) => ({
      group,
      items: sections.filter((s) => s.group === group),
    }))
  }, [groups, sections])

  useEffect(() => {
    const sectionEls = sections.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!sectionEls.length) return undefined

    const pickActiveSection = () => {
      const probeY = Math.min(window.innerHeight * 0.22, 180)
      const withTop = sectionEls.map((el) => ({ el, top: el.getBoundingClientRect().top }))

      const passed = withTop
        .filter((item) => item.top <= probeY)
        .sort((a, b) => b.top - a.top)

      const upcoming = withTop
        .filter((item) => item.top > probeY)
        .sort((a, b) => a.top - b.top)

      const target = passed[0]?.el ?? upcoming[0]?.el ?? sectionEls[0]
      if (target?.id) setActiveId(target.id)
    }

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        pickActiveSection()
        ticking = false
      })
    }

    pickActiveSection()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [sections])

  const onSelect = useCallback((id) => {
    setActiveId(id)
    scrollToSection(id)
  }, [])

  return (
    <div className="ui-check-layout">
      <nav
        className="ui-check-nav lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
        aria-label={navAriaLabel}
      >
        <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wide text-ink-tertiary lg:block">
          On this page
        </p>

        <div className="ui-check-nav__mobile mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={cx(
                'context-bar__pill shrink-0',
                activeId === section.id && 'context-bar__pill--active',
              )}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="hidden space-y-5 lg:block">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-tertiary">
                {group}
              </p>
              <ul className="space-y-0.5">
                {items.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(section.id)}
                      className={cx(
                        'ui-check-nav__link w-full text-left',
                        activeId === section.id && 'ui-check-nav__link--active',
                      )}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="ui-check-main min-w-0 space-y-20">{children}</div>
    </div>
  )
}

const sectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  group: PropTypes.string,
})

UiCheckShell.propTypes = {
  children: PropTypes.node.isRequired,
  sections: PropTypes.arrayOf(sectionShape),
  groups: PropTypes.arrayOf(PropTypes.string),
  navAriaLabel: PropTypes.string,
}
