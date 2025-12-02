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

// Render the App component wrapped in BrowserRouter
root.render(
    <Router 
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        <App />
    </Router>
);