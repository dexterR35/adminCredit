import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CardSmall from '../../Components/CardSmall/_CardSmall';
import PeriodFilter from '../../Components/Layout/PeriodFilter';
import NewRaportTable from "./HomeTable";
import { useHomePageData } from '../../services/Hooks';
import { useTrackLoading } from '../../Components/LoadingProgress';

const HomePage = () => {
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
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Dashboard</h1>
          <p className="dash-page-subtitle">
            {isAdmin ? 'Admin overview of all activity.' : 'Your assigned work overview.'}
          </p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      <section>
        <div className="dash-stat-grid">
          {cardData.map((card) => (
            <CardSmall key={card._one} {...card} loading={loading} />
          ))}
        </div>
      </section>

      <section className="dash-card">
        <div className="dash-card-header">
          <div>
            <h2 className="text-lg font-display font-semibold text-gray-900">Client Records</h2>
            <p className="text-sm text-gray-500">
              {isAdmin ? "All consultant reports" : "Your reports only"}
            </p>
          </div>
        </div>
        <NewRaportTable
          period={period}
          raports={raports}
          loading={loading || fisaLoading}
          onDelete={onDeleteReport}
        />
      </section>
    </div>
  );
};

export default HomePage;
