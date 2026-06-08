import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../Components/Buttons';
import { Card, CardBody, CardHeader, PageTitle, SummaryCard } from '../../Components/uiCheck';
import PeriodFilter from '../../Components/Layout/PeriodFilter';
import NewRaportTable from "./HomeTable";
import { useHomePageData } from '../../services/Hooks';
import { useTrackLoading } from '../../Components/LoadingProgress';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [period, setPeriod] = useState('month');
  const {
    loading,
    raports,
    fisaLoading,
    onDeleteReport,
    totalCustomers,
    lastCustomerName,
    contractsLength,
    lastContractName,
    fisaTotal,
    lastReportName,
  } = useHomePageData(period);

  useTrackLoading(loading);

  const cardData = [
    {
      _one: 'Total Web Clients',
      _two: totalCustomers,
      _three: 'All website submissions',
      icon: 'businessMan',
      accent: 'primary',
    },
    {
      _one: 'Last Web Client',
      _two: lastCustomerName || "—",
      _three: 'Most recent submission',
      icon: 'alarmClock',
      accent: 'info',
    },
    {
      _one: isAdmin ? 'All Contracts' : 'My Contracts',
      _two: contractsLength,
      _three: lastContractName || "No contracts",
      icon: 'FcReading',
      accent: 'success',
    },
    {
      _one: isAdmin ? 'All Client Records' : 'My Client Records',
      _two: fisaTotal,
      _three: lastReportName || "No records yet",
      icon: 'IconPrint',
      accent: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle
        subtitle={isAdmin ? 'Admin overview of all activity.' : 'Your assigned work overview.'}
        actions={(
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="primary"
              text="Create Report"
              icon={HiOutlinePlus}
              onClick={() => navigate('/newraport')}
            />
            <PeriodFilter value={period} onChange={setPeriod} />
          </div>
        )}
      >
        Dashboard
      </PageTitle>

      <section>
        <div className="summary-grid">
          {cardData.map((card) => (
            <SummaryCard
              key={card._one}
              label={card._one}
              value={card._two}
              detail={card._three}
              icon={card.icon}
              tone={card.accent}
              loading={loading}
            />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader
          title="Client Records"
          subtitle={isAdmin ? "All consultant reports" : "Your reports only"}
        />
        <CardBody>
        <NewRaportTable
          period={period}
          raports={raports}
          loading={loading || fisaLoading}
          onDelete={onDeleteReport}
        />
        </CardBody>
      </Card>
    </div>
  );
};

export default HomePage;
