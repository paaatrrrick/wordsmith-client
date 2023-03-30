import { CHROME_CONSTANTS, BROWSER_COMMUNICATION } from '../constants.js';

const messageListener = (event) => {
    console.log('recieving top message');
    if (event.source != window) {
        return;
    }
    if (event.data) {
        console.log(event);
        const data = event.data;
        const type = data.wordsmithType;
        var change = {}
        if (type) {
            if (type === CHROME_CONSTANTS.CHROME_SIGNUP) {
                const jwt = data.jwtToken;
                chrome.storage.sync.set({ wordsmith_944_jwt_chrome: jwt }, () => {
                    change.type = CHROME_CONSTANTS.CHROME_SIGNUP;
                });
                change = { wordsmithType: CHROME_CONSTANTS.CHROME_SIGNUP, data: "good" }
            } else if (type === BROWSER_COMMUNICATION.REWRITES || type === BROWSER_COMMUNICATION.GRAMMAR) {
                change = data;
            } else if (type === CHROME_CONSTANTS.CHROME_LOGOUT) {
                logout();
            }
        }
        console.log('message listener is now returning: ');
        console.log(change);
        return change;
    }
    return {}
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