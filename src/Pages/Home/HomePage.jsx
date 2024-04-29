
import { FetchContractData, FetchCustomersData } from '../../services/Hooks';
import CardSmall from '../../Components/CardSmall/_CardSmall';
import CurrentDateTimeComp from '../../Components/utils/_CurrentTime';
import ContractPage from '../Contract/ContractPage';

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
            className: 'bg-low-color',
        },
        {
            _one: 'Today Clients',
            _two: customersAddedOnCurrentDay.length,
            _three: nameOfLastAddedCustomer ? nameOfLastAddedCustomer : "Nothing",
            icon: 'alarmClock',
            className: 'bg-low-color',
        },

        {
            _one: 'Contracte',
            _two: contractsLength,
            _three: lastContractName,
            icon: 'cards',
            className: 'bg-low-color',
        },
        {
            _one: 'Consultanti',
            _two: "4",
            _three: 'total',
            icon: 'cards',
            className: 'bg-low-color',
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
                <h3 className="text-start">Customers</h3>
                <div className="grid grid-cols-custom-4 gap-5">
                    {cardData.map((card, index) => (
                        <CardSmall key={index} {...card} />
                    ))}
                </div>
                <br />
                <hr />
                <div className="div">
                    <h3>Tabel Raport</h3>
                    <div className="w-full">
                        <ContractPage />
                    </div>
                </div>

            </div>
        </>
    );
};

export default HomePage;
