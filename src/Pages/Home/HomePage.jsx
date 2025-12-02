import { FetchContractData, FetchCustomersData } from '../../services/Hooks';
import CardSmall from '../../Components/CardSmall/_CardSmall';
import CurrentDateTimeComp from '../../Components/utils/_CurrentTime';
import NewRaportTable from "./HomeTable";

const HomePage = ({ user }) => {
    const { customerData, customersAddedOnCurrentDay, nameOfLastAddedCustomer } = FetchCustomersData();
    const { lastContractName, contractsLength } = FetchContractData();
    const userName = user ? user.email.split('@')[0].toUpperCase() : 'User';

    const cardData = [
        {
            _one: 'Total Clients',
            _two: customerData.length,
            _three: 'All clients',
            icon: 'alarmClock',
            className: '',
        },
        {
            _one: 'Today Clients',
            _two: customersAddedOnCurrentDay.length,
            _three: nameOfLastAddedCustomer ? nameOfLastAddedCustomer : "No new clients",
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
                        <CurrentDateTimeComp />
                    </div>
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-3xl">👋</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
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
            <div className="rounded-xl p-6 border border-gray-700 bg-gray-900 shadow-lg">
                <NewRaportTable />
            </div>
        </div>
    );
};

export default HomePage;
