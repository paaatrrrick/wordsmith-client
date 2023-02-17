import { CHROME_CONSTANTS } from '../constants.js';

const messageListener = (event) => {
    if (event.source != window) {
        return;
    }
    if (event.data) {
        const type = event.data.wordsmithType;
        const jwt = event.data.jwtToken;
        if (type) {
            if (type === CHROME_CONSTANTS.CHROME_SIGNUP) {
                chrome.storage.sync.set({ wordsmith_944_jwt_chrome: jwt }, function () {
                    // console.log("JWT token saved to chrome.storage signup");
                });
                // chrome.storage.sync.get(['wordsmith_944_jwt_chrome'], function (result) {
                //     console.log('Value currently is ' + result.wordsmith_944_jwt_chrome);
                // });
            } else if (type === CHROME_CONSTANTS.CHROME_LOGOUT) {
                console.log('we are in the logout function');
                logout();
            }
        }
    }
};


const logout = () => {
    chrome.storage.sync.set({ wordsmith_944_jwt_chrome: "" }, function () {
        // console.log("JWT token saved to chrome.storage logout");
    });
};


const postRequest = async (data) => {
    try {
        const result = await window.chrome.storage.sync.get([CHROME_CONSTANTS.JWT_CHROME]);
        if (result.wordsmith_944_jwt_chrome) {
            const jwt = result.wordsmith_944_jwt_chrome;
            const response = await fetch(`${CHROME_CONSTANTS.API_ENDPOINT}${CHROME_CONSTANTS.WORK_MAGIC}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-access'wordsmith-auth-token": jwt
                },
                body: JSON.stringify(data),
            });
            return response;
        } else {
            return { ok: false, status: 401 };
        };
    } catch (error) {
        return { ok: false };
    }
};


export { messageListener, logout, postRequest }