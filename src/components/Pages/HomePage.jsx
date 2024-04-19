import React, { useEffect, useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import CardSmall from '../utils/_CardSmall';
import CustomModal from './ModalPage';
const HomePage = ({ user }) => {

    const { customerData } = FetchCustomersData();  // Fetches and subscribes to customer data
    const [stats, setStats] = useState({
        newCustomers: 0,
        customersInDeadline: 0,
        totalCustomers: 0,
        resolvedCustomers: 0,
        unresolvedCustomers: 0,
        totalEmployees: 0,
    });
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const userName = user ? user.email.split("@")[0].toUpperCase() : "GUEST";

    // Update stats based on customerData changes
    useEffect(() => {
        setStats(prev => ({
            ...prev,
            totalCustomers: customerData.length,
            newCustomers: customerData.filter(c => c.status === 'new').length,
            // You can add more stats calculations here
        }));
        console.log(customerData, "Customer data log");
    }, [customerData]);
    const handleDetailsClick = (data) => {
        setModalData(data);
        setModalOpen(true);
    };

    return (
        <>
            <div >
                <h1 className='font-bold w-full text-start text-2xl uppercase'>Welcome {userName}</h1>
                <span className='text-sm text-gray-600 mr-2'>Astazi este: 20.12.2025</span>
                <span className='text-sm text-gray-600 mr-2'>ora: 12:20 AM</span>
                <span className='text-sm text-gray-600 mr-2'>+25grade</span>
            </div>
            <div className='w-full'>
                <hr />
                <h3 className='text-start mb-2'>Clienti</h3>
                <div className='flex flex-row space-x-3 '>
                    <CardSmall
                        _one="Clienti Noi"
                        _two="1"
                        _three="Astazi"
                        icon="alarmClock"
                        className="bg-green-200"
                    />
                    <CardSmall
                        _one="Clienti Site"
                        _two={stats.totalCustomers}
                        _three="24.04.2005"
                        icon="businessMan"

                    />
                    <CardSmall
                        _one="Contracte"
                        _two={stats.totalCustomers / 2.5}
                        _three="total"
                        icon="cards"
                    />
                </div>
                <br />
                <hr />
                <h3 className='text-start mb-2'>Info Deadline</h3>
                <div className='flex flex-row space-x-3'>
                    <CardSmall
                        _one="Active"
                        _two={stats.totalCustomers}
                        _three="Details"
                        icon="FcAbout"
                        className="bg-blue-200"
                        onDetailsClick={() => handleDetailsClick({ id: stats.totalCustomers, firstName: "John", lastName: "Doe" })}
                    />
                    <CardSmall
                        _one="In Asteptare"
                        _two={stats.totalCustomers - 20}
                        _three="Nume Client"
                        icon="hightPriority"
                        className="bg-yellow-200"
                    />

                    <CardSmall
                        _one="Finalizate"
                        _two={stats.totalCustomers / 2.5}
                        _three="Nr.Doc"
                        icon="FcOk"
                        className="bg-green-200"
                    />
                    <CardSmall
                        _one="Nerezolvate"
                        _two={stats.totalCustomers - 60}
                        _three="Details"
                        icon="FcBearish"
                        className="bg-red-200"
                    />
                </div>
                <br />
                <hr />

            </div >
            <CustomModal
                isOpen={isModalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Customer Details"
                data={modalData}
            />
        </>
    );
}

export default HomePage;
