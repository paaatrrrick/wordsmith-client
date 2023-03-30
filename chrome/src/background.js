import { CHROME_CONSTANTS } from './constants.js';




chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({
        url: CHROME_CONSTANTS.BROWSWER_LOCATION + CHROME_CONSTANTS.BROWSER_SIGNUP,
        active: true
    });
    return false;
});


// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         if (request.greeting === "hello")
//             sendResponse({ farewell: "goodbye" });
//     }
// );

