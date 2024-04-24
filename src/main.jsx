import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./firebase/config.jsx"; // assuming this sets up Firebase
import App from "./App.jsx";
import "./index.css";
// import { Twrapp } from './utils/Twrapp';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Import i18n instance
// Get the root element from the HTML document
const rootElement = document.getElementById("root");
// Create a root.
const root = ReactDOM.createRoot(rootElement);

// Render the App component wrapped in BrowserRouter.
root.render(
    <I18nextProvider i18n={i18n}>

        <Router>
            <App />
        </Router>

    </I18nextProvider>
);