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
        <select onChange={changeLanguage} defaultValue={i18n.language} className='border-0 outline-none'>
            <option value="en">EN</option>
            <option value="ro">RO</option>
        </select>
    );
};

export default SwitchLang;
