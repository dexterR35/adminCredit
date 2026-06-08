import { HiOutlineCheckCircle, HiOutlineGlobeAlt } from 'react-icons/hi2'
import { Card, CardHeader, CardBody, PageTitle, SummaryCard } from '../index.js'
import UiCheckSection, { DemoCard } from '../UiCheckSection.jsx'
import { UI_CHECK_SECTIONS } from '../config.js'

export default function CardsSection() {
  const section = UI_CHECK_SECTIONS.find((s) => s.id === 'cards')

  return (
    <UiCheckSection
      id="cards"
      title="Cards & titles"
      description="Layout shells for pages and metrics. CSS: .card · .card-header · .summary-card__* · .page-title"
      sources={section?.sources}
    >
      <DemoCard title="PageTitle" subtitle=".page-title · page headings">
        <PageTitle>Example page title</PageTitle>
      </DemoCard>

      <DemoCard title="Card" subtitle=".card · .card--padded · .card-header">
        <Card>
          <CardHeader title="Card title" subtitle="Optional subtitle" />
          <CardBody>
            <p className="text-sm text-ink-secondary">Card body content with standard padding.</p>
          </CardBody>
        </Card>
      </DemoCard>

      <DemoCard title="SummaryCard" subtitle=".summary-card__icon · __label · __value · __detail">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            label="Total Active"
            value="128"
            subLabel="Enabled LPs"
            icon={HiOutlineCheckCircle}
          />
          <SummaryCard
            label="Total LPs"
            value="342"
            detail="All landing pages"
            icon={HiOutlineGlobeAlt}
            variant="compact"
          />
        </div>
      </DemoCard>
    </UiCheckSection>
  )
}
