// const PRODUCTION_BROWSER_ENDPOINT = 'https://try-wordsmith.netlify.app';
// const DEVELOPMENT_BROWSER_ENDPOINT = 'http://localhost:3006';

// const SIGN_UP = '/signup';




// chrome.runtime.onInstalled.addListener(function () {
//     chrome.tabs.create({
//         url: PRODUCTION_BROWSER_ENDPOINT + SIGN_UP,
//         active: true
//     });

//     return false;
// });


// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log('here123');
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.greeting === "hello")
//             sendResponse({ farewell: "goodbye" });
//     }
// );

