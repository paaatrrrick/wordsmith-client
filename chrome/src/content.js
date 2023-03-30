import './styles/content.css';
import './styles/Grammar.css'
import { messageListener } from './methods/authentication.js';
import { createRewrite, createGrammar } from './methods/initializeClasses.js';
import { CHROME_CONSTANTS, BROWSER_COMMUNICATION } from './constants.js';

const result = await window.chrome.storage.sync.get([CHROME_CONSTANTS.JWT_CHROME]);
const rerwriteState = await window.chrome.storage.sync.get([CHROME_CONSTANTS.CAN_REWRITE]);
const grammarState = await window.chrome.storage.sync.get([CHROME_CONSTANTS.CAN_GRAMMAR]);

console.log(result);
console.log(rerwriteState);
console.log(grammarState);
console.log('chrome extneions just loaded');


const isAuth = result[CHROME_CONSTANTS.JWT_CHROME]

const stateManagment = {
    isAuthenticated: ((isAuth && isAuth !== "") ? true : false),
    reWritesAllowed: ((rerwriteState === BROWSER_COMMUNICATION.REWRITES_BAD) ? false : true),
    grammarAllowed: ((grammarState === BROWSER_COMMUNICATION.GRAMMAR_BAD) ? false : true),
    deployedRewrite: false,
    deployedGrammar: false,
}


console.log(stateManagment);


if (stateManagment.isAuthenticated && stateManagment.reWritesAllowed && !stateManagment.deployedRewrite) {
    stateManagment.deployedRewrite = true;
    createRewrite();
}

if (stateManagment.isAuthenticated && stateManagment.grammarAllowed && !stateManagment.deployedGrammar) {
    stateManagment.deployedGrammar = true;
    createGrammar();
}


window.addEventListener("message", (event) => {
    console.log('we got a message');
    const res = messageListener(event);
    if (res.wordsmithType) {
        if (res.wordsmithType === CHROME_CONSTANTS.CHROME_SIGNUP) {
            console.log('1')
            stateManagment.isAuthenticated = true;
            if (stateManagment.reWritesAllowed && !stateManagment.deployedRewrite) {
                console.log('2')
                stateManagment.deployedRewrite = true;
                createRewrite();
            }
            if (stateManagment.grammarAllowed && !stateManagment.deployedGrammar) {
                console.log('3')
                stateManagment.deployedGrammar = true;
                createGrammar();
            }
        } else if (res.wordsmithType === BROWSER_COMMUNICATION.REWRITES) {
            console.log('4')
            if (res.message !== BROWSER_COMMUNICATION.REWRITES_BAD) {
                stateManagment.reWritesAllowed = true;
                if (!stateManagment.deployedRewrite && stateManagment.isAuthenticated.wordsmith_944_jwt_chrome) {
                    console.log('5')
                    stateManagment.deployedRewrite = true;
                    createRewrite();
                }
            }
        } else if (res.wordsmithType === BROWSER_COMMUNICATION.GRAMMAR) {
            console.log('6')

            if (res.message !== BROWSER_COMMUNICATION.GRAMMAR_BAD) {
                console.log('7')

                stateManagment.grammarAllowed = true;
                if (!stateManagment.deployedRewrite && stateManagment.isAuthenticated.wordsmith_944_jwt_chrome) {
                    console.log('8')
                    stateManagment.deployedGrammar = true;
                    createGrammar();
                }
            }
        }
    }
}, false);










