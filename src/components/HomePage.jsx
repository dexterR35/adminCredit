import React, { useEffect, useState } from 'react';
import { FetchCustomersData } from '../services/Hooks'; // Assuming these functions exist
import CardSmall from './_cardData/_cardSmall'
const HomePage = ({ user }) => {
    const { customerData } = FetchCustomersData();
    const [employeeData, setEmployeeData] = useState([]);
    const [stats, setStats] = useState({
        newCustomers: 0,
        customersInDeadline: 0,
        totalCustomers: 0,
        resolvedCustomers: 0,
        unresolvedCustomers: 0,
        totalEmployees: 0,
    });

    const userName = user ? user.email.split("@")[0].toUpperCase() : "GUEST";

    useEffect(() => {
        const fetchEmployees = async () => {
            const dataFetch = await FetchCustomersData(); // Assume this returns data
            if (JSON.stringify(dataFetch) !== JSON.stringify(employeeData)) {
                setEmployeeData(dataFetch);
                setStats(prev => ({ ...prev, totalEmployees: dataFetch.length }));
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        if (customerData.length > 0) {
            setStats(prev => ({
                ...prev,
                totalCustomers: customerData.length,
                newCustomers: customerData.filter(c => c.status === 'new').length,
                // customersInDeadline: customerData.filter(c => c.deadlineApproaching).length,
                // resolvedCustomers: customerData.filter(c => c.status === 'resolved').length,
                // unresolvedCustomers: customerData.filter(c => c.status !== 'resolved').length,
            }));
        }
        console.log(customerData, "Customer data log");
    }, [customerData]);
    return (
        <div className='w-full'>
            <h1 className='font-bold'>Bine ai venit, {userName}</h1>
            <p>Ai Clienti noi (nr): {stats.newCustomers}</p>
            <div className='flex flex-row max-w-[20em]'>

                <CardSmall
                    _one="Clienti Site"
                    _two={stats.totalCustomers}
                    _three=""
                />
                <CardSmall
                    _one="John Doe"
                    _two="123-456-7890"
                    _three=""
                />
            </div>
            <p>Ai Clienti in Deadline (nr): {stats.customersInDeadline}</p>
            <p>Total clienti (numar): {stats.totalCustomers}</p>
            <p>Total clienti (rezolvati): {stats.resolvedCustomers}</p>
            <p>Total clienti (nerezolvati): {stats.unresolvedCustomers}</p>
            <p>Total angajati (nr): {stats.totalEmployees}</p>
            <button>creeaza user (pt angajat)</button>
        </div>
    );
}

export default HomePage;
