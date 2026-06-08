import { Avatar } from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'

export default function AvatarsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'avatars')

  return (
    <UiCheckSection
      id="avatars"
      title="Avatars"
      description="User initials or image. Sizes: xs · sm · md. Optional calendar color hex."
      sources={section?.sources}
    >
      <DemoCard title="Sizes" subtitle="Users table uses sm">
        <div className="flex flex-wrap items-end gap-4">
          {['xs', 'sm', 'md'].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar name="Alex Morgan" email="alex@example.com" size={size} color="#2563eb" />
              <span className="font-mono text-xs text-ink-tertiary">{size}</span>
            </div>
          ))}
        </div>
      </DemoCard>

      <DemoCard title="With color vs fallback" subtitle="color prop sets background from user calendar">
        <div className="flex flex-wrap gap-4">
          <Avatar name="Sam Lee" color="#22c55e" />
          <Avatar name="Jordan Kim" color="#a78bfa" />
          <Avatar email="user@company.com" />
        </div>
      </DemoCard>
    </UiCheckSection>
  )
}
