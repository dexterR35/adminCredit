import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./firebase/config.jsx"; // assuming this sets up Firebase
import App from "./App.jsx";
import "./index.css";
// Get the root element from the HTML document
const rootElement = document.getElementById("root");
// Create a root.
const root = ReactDOM.createRoot(rootElement);

// Render the App component wrapped in BrowserRouter with basename for /admin subdirectory.
// Always use /admin basename since obtinecredit.ro is the main website and /admin is the dashboard
root.render(
    <Router 
        basename="/admin"
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        <App />
    </Router>
);