import { useEffect, useState } from 'react';
import './styles/App.css';
import { POPUP_CONSTANTS, BROWSER_COMMUNICATION } from './constants';
import React from 'react';
import { render } from 'react-dom';
import Auth from './react/Auth.js';
import Main from './react/Main.js';
import logo from './images/logo.png';

function Popup() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRewritesChecked, setIsRewritesChecked] = useState(true);
    const [isGrammarChecked, setIsGrammarChecked] = useState(true);

    useEffect(() => {
        window.chrome.storage.sync.get(['wordsmith_944_rewriteChecked'], async (result) => {
            const rewriteChecked = result.wordsmith_944_rewriteChecked;
            console.log('rewriteChecked', result);
            if (rewriteChecked === "false") {
                console.log('switching to false rewrite');
                setIsRewritesChecked(false);
            }
        });
        window.chrome.storage.sync.get(['wordsmith_944_grammarChecked'], async (result) => {
            const grammarChecked = result.wordsmith_944_grammarChecked;
            console.log('grammarChecked', result);
            if (grammarChecked === "false") {
                console.log('switching to false grammar');
                setIsGrammarChecked(false);
            }
        });

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

    const rewriteClick = () => {
        console.log('rewriteClick');
        if (isRewritesChecked) {
            console.log('switch to not allowed');
            window.chrome.storage.sync.set({ wordsmith_944_rewriteChecked: BROWSER_COMMUNICATION.REWRITES_BAD });
            window.postMessage({ wordsmithType: BROWSER_COMMUNICATION.REWRITES, message: BROWSER_COMMUNICATION.REWRITES_BAD }, "*");
        } else {
            window.chrome.storage.sync.set({ wordsmith_944_rewriteChecked: "true" });
            window.postMessage({ wordsmithType: BROWSER_COMMUNICATION.REWRITES, message: "good" }, "*");

        }
        setIsRewritesChecked(!isRewritesChecked);
    };

    const grammarClick = () => {
        console.log('grammarClick');
        if (isGrammarChecked) {
            console.log('switch to not allowed');
            window.chrome.storage.sync.set({ wordsmith_944_grammarChecked: BROWSER_COMMUNICATION.GRAMMAR_BAD });
            window.postMessage({ wordsmithType: BROWSER_COMMUNICATION.GRAMMAR, message: BROWSER_COMMUNICATION.GRAMMAR_BAD }, "*");

        } else {
            window.chrome.storage.sync.set({ wordsmith_944_grammarChecked: "true" });
            window.postMessage({ wordsmithType: BROWSER_COMMUNICATION.GRAMMAR, message: "good" }, "*");
        }
        setIsGrammarChecked(!isGrammarChecked);
    };

    return (
        // <div className="body">
        <div className="App">
            <div className="app-header">
                <div className="app-header-left">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1>wordsmith</h1>
                </div>
                <button className='button1' onClick={() => window.open(CONSTANTS.BROWSWER_LOCATION + CONSTANTS.BROWSER_HOME, "_blank")}>Home</button>
            </div>
            {!isLoggedIn ? <Auth /> : <Main setIsLoggedIn={setIsLoggedIn} />}
            <div className="app-footer">
                {isLoggedIn ?
                    <div className="footer-checkboxes">
                        <div className="checkBox">
                            <p>Rewrites:</p>
                            <div className='checkBoxParent'>
                                <input type="checkbox" id="toggle" checked={isRewritesChecked} onClick={rewriteClick} />
                                <label htmlFor="toggle"></label>
                            </div>
                        </div>
                        <div className="checkBox">
                            <p>Grammar:</p>
                            <div className='checkBoxParent'>
                                <input type="checkbox" id="toggle1" checked={isGrammarChecked} onClick={grammarClick} />
                                <label htmlFor="toggle1"></label>
                            </div>
                        </div>
                    </div>
                    :
                    <div />
                }
            </div>
        </div>
    );
}

render(<Popup />, document.getElementById("react-target"));