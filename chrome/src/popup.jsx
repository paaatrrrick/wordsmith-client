import { useEffect, useState } from 'react';
import './styles/App.css';
import { POPUP_CONSTANTS } from './constants';
import React from 'react';
import { render } from 'react-dom';
import Auth from './components/Auth.js';
import Main from './components/Main.js';
import logo from './images/logo.png';

function Popup() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        window.chrome.storage.sync.get(['wordsmith_944_jwt_chrome'], async (result) => {
            const jwt = result.wordsmith_944_jwt_chrome;
            if (jwt && jwt !== "" && jwt !== undefined && jwt !== null && jwt !== "undefined" && jwt !== "null") {
                const response = await fetch(POPUP_CONSTANTS.API_ENDPOINT + POPUP_CONSTANTS.CHECK_IF_LOGGED_IN, {
                    headers: { "x-access'wordsmith-auth-token": jwt }
                });
                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    window.chrome.storage.sync.set({ wordsmith_944_jwt_chrome: "" });
                };
            };
        });
    }, []);


    return (
        // <div className="body">
        <div className="App">
            <div className="app-header">
                <img src={logo} className="app-logo" alt="logo" />
                <h1>wordsmith</h1>
            </div>
            {!isLoggedIn ? <Auth /> : <Main setIsLoggedIn={setIsLoggedIn} />}
            <div className="app-footer">
                <button className='button1' onClick={() => window.open(CONSTANTS.BROWSWER_LOCATION + CONSTANTS.BROWSER_HOME, "_blank")}>Home</button>
            </div>
        </div>

        // </div>
    );
}

render(<Popup />, document.getElementById("react-target"));