
import { FetchContractData, FetchCustomersData } from '../../services/Hooks';
import CardSmall from '../../Components/utils/_CardSmall';

import CurrentDateTimeComp from '../../Components/utils/_CurrentTime'
const HomePage = ({ user }) => {
    const { customerData, customersAddedOnCurrentDay, nameOfLastAddedCustomer } = FetchCustomersData();
    const { lastContractName, contractsLength } = FetchContractData()
    const userName = user ? user.email.split('@')[0].toUpperCase() : 'User';

    const cardData = [
        {
            _one: 'Total Clients',
            _two: customerData.length,
            _three: 'Details',
            icon: 'alarmClock',
            className: 'bg-blue-200',
        },
        {
            _one: 'Today Clients',
            _two: customersAddedOnCurrentDay.length,
            _three: nameOfLastAddedCustomer ? nameOfLastAddedCustomer : "Nothing",
            icon: 'alarmClock',
            className: 'bg-blue-200',
        },

        {
            _one: 'Contracte',
            _two: contractsLength,
            _three: lastContractName,
            icon: 'cards',
        },
        {
            _one: 'Consultanti',
            _two: "4",
            _three: 'total',
            icon: 'cards',
        },

    ];

    return (
        <>
            <div>
                <h1 className="font-bold w-full text-start text-3xl uppercase mb-2">Welcome {userName}</h1>
                <CurrentDateTimeComp />
            </div >
            <div className="w-full">
                <hr />
                <h3 className="text-start mb-2">Clienti</h3>
                <div className="flex flex-row space-x-3">
                    {cardData.map((card, index) => (
                        <CardSmall key={index} {...card} />
                    ))}
                </div>

                <hr />
                <h3 className="text-start mb-2">Info Deadline</h3>
                <div className="flex flex-row space-x-3">
                    <CardSmall
                        _one="Active"
                        _two={customersAddedOnCurrentDay.length}
                        _three="Details"
                        icon="FcAbout"
                        className="bg-blue-200"

                    />
                    <CardSmall
                        _one="In Asteptare"
                        _two={customersAddedOnCurrentDay.length}
                        _three="Nume Client"
                        icon="hightPriority"
                        className="bg-yellow-200"
                    />
                    <CardSmall
                        _one="Finalizate"
                        _two={customersAddedOnCurrentDay.length}
                        _three="Nr.Doc"
                        icon="FcOk"
                        className="bg-green-200"
                    />
                    <CardSmall
                        _one="Nerezolvate"
                        _two={customersAddedOnCurrentDay.length}
                        _three="Details"
                        icon="FcBearish"
                        className="bg-red-200"
                    />

                </div>
            </div>
        </>
    );
};

export default HomePage;
