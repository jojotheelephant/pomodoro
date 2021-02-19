import React from "react";
import "./App.css";
import MainBody from "./Components/MainBody";
import Footer from "./Components/Footer";

function App() {
    return (
        <div className="app">
            <MainBody />
            <div className="footer-wrapper">
                <Footer />
            </div>
        </div>
    );
}

export default App;
