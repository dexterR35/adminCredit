import { useCustomersStats, useContractsStats } from '../../services/Hooks';
import CardSmall from '../../Components/CardSmall/_CardSmall';
import CurrentDateTimeComp from '../../Components/utils/_CurrentTime';
import NewRaportTable from "./HomeTable";

const HomePage = ({ user }) => {
    // Use lightweight stats hooks instead of full data hooks to reduce Firebase reads
    const { total: totalCustomers, lastCustomerName } = useCustomersStats();
    const { total: contractsLength, lastContractName } = useContractsStats();
    // Note: contractsLength is now just 'total' from stats
    const userName = user ? user.email.split('@')[0].toUpperCase() : 'User';

    const cardData = [
        {
            _one: 'Total Clients',
            _two: totalCustomers,
            _three: 'All clients',
            icon: 'alarmClock',
            className: '',
        },
        {
            _one: 'Last Client',
            _two: lastCustomerName || "—",
            _three: 'Most recent',
            icon: 'alarmClock',
            className: '',
        },
        {
            _one: 'Contracts',
            _two: contractsLength,
            _three: lastContractName || "No contracts",
            icon: 'cards',
            className: '',
        },
        {
            _one: 'Client Budget',
            _two: "20",
            _three: "12,540 RON",
            icon: 'cards',
            className: '',
        },
        {
            _one: 'Broker Budget',
            _two: "20",
            _three: "12,540 RON",
            icon: 'cards',
            className: '',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page Title & Subtitle */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
                <p className="text-slate-400 text-sm">Welcome back, {userName}! Here's your overview</p>
            </div>

            {/* Welcome Section */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-100 mb-2">Welcome back, {userName}!</h2>
                        <CurrentDateTimeComp />
                    </div>
                    <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center">
                        <span className="text-2xl">👋</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
                    <h2 className="text-xl font-semibold text-slate-100">Dashboard Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {cardData.map((card, index) => (
                        <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardSmall {...card} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Reports Section */}
            <div className="rounded-xl p-6 border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
                <NewRaportTable />
            </div>
        </div>
    );
};

export default HomePage;
