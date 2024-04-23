// getContent.js
import React from 'react';
import ContractDetails from '../UserData/ContractDetails'; // Make sure the path is correct
// import CustomerDetails from '../components/ContractDetails'; // Uncomment this if you have a different component

const getContent = (id, data) => { // Assuming data is passed to determine content dynamically
    switch (id) {
        case 'contractDetails':
            return {
                label: 'Contract Details',
                component: <ContractDetails data={data} />
            };
        case 'customerDetails':
            return {
                label: 'Customer Details',
                component: <ContractDetails data={data} /> // Assume a different component for customers
            };
        default:
            return {
                label: 'Not Found',
                component: <p>No content available.</p>
            };
    }
}

export default getContent;
