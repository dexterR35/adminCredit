import React from 'react';
import { useTranslation } from 'react-i18next';

const SwitchLang = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (e) => {
        const selectedLanguage = e.target.value;
        console.log('Selected Language:', selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <select 
            onChange={changeLanguage} 
            defaultValue={i18n.language} 
            className='border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500'
        >
            <option value="en" className="bg-gray-700">EN</option>
            <option value="ro" className="bg-gray-700">RO</option>
        </select>
    );
};

export default SwitchLang;
