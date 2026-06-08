import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useClientRemindersContext } from '../../context/ClientRemindersContext';
import { Button } from '../../Components/Buttons';
import { Card, CardBody, CardHeader, PageTitle, SummaryCard } from '../../Components/uiCheck';
import { Tab } from '../../Components/Tabs';
import NewRaportTable from "./HomeTable";
import RemindersPanel from "./RemindersPanel";
import { useHomePageData } from '../../services/Hooks';
import { useTrackLoading } from '../../Components/LoadingProgress';
import { CLIENT_MODAL_PARAMS } from '../../utils/clientModalRoute';

const DASHBOARD_TABS = [
  { id: 'records', label: 'Client records' },
  { id: 'reminders', label: 'Reminders' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const { dueCount, refresh: refreshReminders } = useClientRemindersContext();
  const tabParam = searchParams.get(CLIENT_MODAL_PARAMS.TAB);
  const webClientParam = searchParams.get(CLIENT_MODAL_PARAMS.WEB_CLIENT);
  const [activeTab, setActiveTab] = useState(
    tabParam === 'reminders' || webClientParam ? 'reminders' : 'records'
  );

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
  } = useHomePageData('all');

  useTrackLoading(loading);

  useEffect(() => {
    if (tabParam === 'reminders' || webClientParam) {
      setActiveTab('reminders');
      refreshReminders({ silent: true });
      return;
    }

    setActiveTab('records');
  }, [tabParam, webClientParam, refreshReminders]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    if (tabId === 'reminders') {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(CLIENT_MODAL_PARAMS.TAB, 'reminders');
        next.delete(CLIENT_MODAL_PARAMS.FISA);
        return next;
      });
      refreshReminders({ silent: true });
      return;
    }

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(CLIENT_MODAL_PARAMS.TAB);
      next.delete(CLIENT_MODAL_PARAMS.WEB_CLIENT);
      return next;
    });
  };

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

  const isRecordsTab = activeTab === 'records';

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
          title={isRecordsTab ? 'Client records' : 'Reminders'}
          subtitle={
            isRecordsTab
              ? (isAdmin ? 'All consultant records' : 'Your records only')
              : `Active reminders — In Progress${dueCount ? ` · ${dueCount} due` : ''}`
          }
          actions={(
            <div className="flex flex-wrap gap-2">
              {DASHBOARD_TABS.map((tab, index) => (
                <Tab
                  key={tab.id}
                  label={tab.label}
                  index={index}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  showIndex={false}
                />
              ))}
            </div>
          )}
        />
        <CardBody>
          {isRecordsTab ? (
            <NewRaportTable
              raports={raports}
              loading={loading || fisaLoading}
              onDelete={onDeleteReport}
            />
          ) : (
            <RemindersPanel loading={loading} />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default HomePage;
