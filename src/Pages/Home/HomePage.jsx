
import { FetchContractData, FetchCustomersData } from '../../services/Hooks';
import CardSmall from '../../Components/CardSmall/_CardSmall';
import CurrentDateTimeComp from '../../Components/utils/_CurrentTime';
<<<<<<< HEAD
import  NewRaportTable  from "./HomeTable";
=======
import { CustomButton } from '../../Components/Buttons/Buttons';
// import HomeRaportTable from './HomeRaportTable'

>>>>>>> 44a2cb8 (update files)
const HomePage = ({ user }) => {
    const { customerData, customersAddedOnCurrentDay, nameOfLastAddedCustomer } = FetchCustomersData();
    const { lastContractName, contractsLength } = FetchContractData()
    console.log(contractsLength,"fsaf")
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
            _one: 'Buget Clients',
            _two: "20",
            _three: "12540 RON",
            icon: 'cards',
            className: 'bg-low-color',
        },
        {
            _one: 'Buget Broker',
            _two: "20",
            _three: "12540 RON",
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
                <div className="flex flex-wrap gap-5">
                    {cardData.map((card, index) => (
                        <div key={index} className='min-w-[180px]'>
                            <CardSmall key={index} {...card} />
                        </div>
                    ))}
                </div>
                <br />
                <hr />
                <div className="div">
                    <h3>Raport</h3>
                    <div className="w-full">
<<<<<<< HEAD
                       <NewRaportTable/>
=======
                          {/* <HomeRaportTable /> */}
>>>>>>> 44a2cb8 (update files)
                    </div>
                </div>

            </div>
        </>
    );
};

export default HomePage;
