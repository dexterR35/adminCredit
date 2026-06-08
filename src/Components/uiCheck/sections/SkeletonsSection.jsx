import {
  SkeletonBoardCards,
  SkeletonSummaryCards,
  SkeletonTable,
} from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'

export default function SkeletonsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'skeletons')

  return (
    <UiCheckSection
      id="skeletons"
      title="Skeletons"
      description="Dashboard loading placeholders only. CSS: .skeleton · .skeleton-card · .skeleton-table"
      sources={section?.sources}
    >
      <DemoCard title="SkeletonSummaryCards" subtitle="Dashboard KPI row · DashboardPage.jsx">
        <SkeletonSummaryCards />
      </DemoCard>

      <DemoCard title="SkeletonBoardCards" subtitle="History boards grid">
        <SkeletonBoardCards count={2} />
      </DemoCard>

      <DemoCard title="SkeletonTable" subtitle="Table placeholder layout">
        <SkeletonTable rows={4} cols={4} />
      </DemoCard>
    </UiCheckSection>
  )
}
