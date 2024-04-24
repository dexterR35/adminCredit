import React, { useEffect, useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import CardSmall from '../../Components/utils/_CardSmall';

const HomePage = ({ user }) => {
    const { customerData } = FetchCustomersData();
    const userName = user ? user.email.split('@')[0].toUpperCase() : 'GUEST';

    // Calculate stats once when customerData changes
    const stats = React.useMemo(() => {
        const totalCustomers = customerData.length;
        const newCustomers = customerData.filter(c => c.status === 'new').length;
        const unresolvedCustomers = totalCustomers - 60;

        return {
            newCustomers,
            totalCustomers,
            contractCount: totalCustomers - 20,
            unresolvedCustomers,
            resolvedCustomers: totalCustomers - 50,
        };
    }, [customerData]);

    // Define card data
    const cardData = [
        {
            _one: 'Clienti Noi',
            _two: stats.newCustomers,
            _three: 'Astazi',
            icon: 'alarmClock',
            className: 'bg-green-200',
        },
        {
            _one: 'Clienti Site',
            _two: stats.totalCustomers,
            _three: '24.04.2005',
            icon: 'businessMan',
        },
        {
            _one: 'Contracte',
            _two: stats.contractCount,
            _three: 'total',
            icon: 'cards',
        },
        {
            _one: 'Consultanti',
            _two: stats.contractCount,
            _three: 'total',
            icon: 'cards',
        },

    ];

    const handleDetailsClick = data => {
        setModalData(data);
        setModalOpen(true);
    };

    return (
        <>
            <div>
                <h1 className="font-bold w-full text-start text-2xl uppercase">Welcome {userName}</h1>
                <span className="text-sm text-gray-600 mr-2">Astazi este: 20.12.2025</span>
                <span className="text-sm text-gray-600 mr-2">ora: 12:20 AM</span>
                <span className="text-sm text-gray-600 mr-2">+25 grade</span>
            </div>
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
                        _two={stats.totalCustomers}
                        _three="Details"
                        icon="FcAbout"
                        className="bg-blue-200"
                        onDetailsClick={() => handleDetailsClick({ id: stats.totalCustomers, firstName: 'John', lastName: 'Doe' })}
                    />
                    <CardSmall
                        _one="In Asteptare"
                        _two={stats.unresolvedCustomers}
                        _three="Nume Client"
                        icon="hightPriority"
                        className="bg-yellow-200"
                    />
                    <CardSmall
                        _one="Finalizate"
                        _two={stats.resolvedCustomers}
                        _three="Nr.Doc"
                        icon="FcOk"
                        className="bg-green-200"
                    />
                    <CardSmall
                        _one="Nerezolvate"
                        _two={stats.unresolvedCustomers}
                        _three="Details"
                        icon="FcBearish"
                        className="bg-red-200"
                    />
                    <CardSmall
                        _one="Nerezolvate"
                        _two={stats.unresolvedCustomers}
                        _three="Details"
                        icon="FcBearish"
                        className="bg-red-200"
                    />
                </div>

                {/* <CustomModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setModalOpen(false)}
                    contentLabel="Customer Details"
                    data={modalData}
                /> */}
            </div>
        </>
    );
};

export default HomePage;
