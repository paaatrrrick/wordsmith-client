// chrome.runtime.onInstalled.addListener(() => {
//     console.log('HEREHRERHEHREHRHREHE')
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



// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log('me 123');
//         console.log(request);
//         sendResponse({ response: "Hello from extension" });
//     });

// if (nextState === "ON") {
//     // Insert the CSS file when the user turns the extension on
//     await chrome.scripting.insertCSS({
//       files: ["focus-mode.css"],
//       target: { tabId: tab.id },
//     });
//   } else if (nextState === "OFF") {
//     // Remove the CSS file when the user turns the extension off
//     await chrome.scripting.removeCSS({
//       files: ["focus-mode.css"],
//       target: { tabId: tab.id },
//     });
//   }