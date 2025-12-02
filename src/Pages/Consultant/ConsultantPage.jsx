// ConsultantPage.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsultantByUserName } from '../../services/Hooks';

const ConsultantPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username');
    const [consultant, setConsultant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultant = async () => {
            try {
                const consultantData = await getConsultantByUserName(username);
                setConsultant(consultantData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching consultant:", error);
                setLoading(false);
            }
        };

        fetchConsultant();

        return () => {
            // Cleanup code if needed
        };
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!consultant) {
        return <div>Consultant not found!</div>;
    }

    return (
        <div className="animate-fade-in">
            {/* Page Title & Subtitle */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">Consultant Profile</h1>
                <p className="text-slate-400 text-sm">View consultant details and information</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-slate-100 mb-4">{consultant.username}'s Page</h2>
                <p className="text-slate-300">Email: {consultant.email}</p>
                {/* Display other consultant details as needed */}
            </div>
        </div>
    );
};

export default ConsultantPage;
