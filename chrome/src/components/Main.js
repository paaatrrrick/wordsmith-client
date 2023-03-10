import React from 'react';
import { useEffect, useState } from 'react';
import { POPUP_CONSTANTS } from "../constants";


const Main = (setIsLoggedIn) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [recentChanges, setRecentChanges] = useState([]);

    useEffect(() => {
        window.chrome.storage.sync.get(['wordsmith_944_jwt_chrome'], async (result) => {
            if (result.wordsmith_944_jwt_chrome) {
                const jwt = result.wordsmith_944_jwt_chrome;
                const response = await fetch(POPUP_CONSTANTS.API_ENDPOINT + POPUP_CONSTANTS.RECENT_CHANGES, {
                    headers: { "x-access'wordsmith-auth-token": jwt }
                });
                if (response.status === 401) {
                    window.chrome.storage.sync.set({ wordsmith_944_jwt_chrome: "" });
                    setIsLoggedIn(false);
                } else if (!response.ok) {
                    setErrorMessage("Oops, we had an error. Please try again later.");
                } else {
                    const data = await response.json();
                    setRecentChanges(data.recentChanges.reverse());
                };
            } else {
                setIsLoggedIn(false);
                window.chrome.storage.sync.set({ wordsmith_944_jwt_chrome: "" });
            }
        });
    }, []);
    return (
        <div className="Main">
            {/*if there are any errors display them. If not, make an h1 and loop recent change make a p for each one */}
            {errorMessage ? <p>{errorMessage}</p> :
                <div className='Main2'>
                    <div className="main2H1Div">
                        <h1>Recent Changes</h1>
                    </div>
                    {recentChanges.map((change, index) => {
                        return (
                            <div key={index} className="main2Section">
                                <p >{change.aiEntry}</p>
                                <hr />
                            </div>
                        )
                    })}
                </div>
            }
        </div>


    )

}

export default Main;