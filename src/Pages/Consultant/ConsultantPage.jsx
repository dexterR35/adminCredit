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
        <div>
            <h2>{consultant.username}'s Page</h2>
            <p>Email: {consultant.email}</p>
            {/* Display other consultant details as needed */}
        </div>
    );
};

export default ConsultantPage;
