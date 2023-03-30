
const DEVELOPMENT_API_ENDPOINT = 'http://localhost:3000';
const DEVELOPMENT_BROWSER_ENDPOINT = 'http://localhost:3006';

const PRODUCTION_API_ENDPOINT = 'https://wordsmith-api-production.up.railway.app';
const PRODUCTION_BROWSER_ENDPOINT = 'https://try-wordsmith.netlify.app';


const API_ENDPOINT = DEVELOPMENT_API_ENDPOINT;
const BROWSWER_LOCATION = DEVELOPMENT_BROWSER_ENDPOINT;

const GRAMMAR_CONSTANTS = {
    CLASS_NAME: 'wordsmith-944-g-generic',
}

const BROWSER_COMMUNICATION = {
    REWRITES: 'wordsmith-944-rewrite',
    REWRITES_BAD: 'wordsmith-944-rewrite-bad',
    GRAMMAR: 'wordsmith-944-grammar',
    GRAMMAR_BAD: 'wordsmith-944-grammar-bad',
}


const POPUP_CONSTANTS = {
    API_ENDPOINT: API_ENDPOINT,
    EMAIL_SIGNUP_AUTH: '/auth/signup-email',
    EMAIL_LOGIN_AUTH: '/auth/login-email',
    CHECK_IF_LOGGED_IN: '/auth/isLoggedIn',
    BROWSWER_LOCATION: BROWSWER_LOCATION,
    BROWSER_LOGIN: '/signin',
    BROWSER_HOME: '/',
    BROWSER_SIGNUP: '/signup',
    RECENT_CHANGES: '/recentchanges',
}

const CHROME_CONSTANTS = {
    API_ENDPOINT: API_ENDPOINT,
    BROWSWER_LOCATION: BROWSWER_LOCATION,
    BROWSER_LOGIN: '/signin',
    BROWSER_SIGNUP: '/signup',
    WORK_MAGIC: '/chrome/workmagic',
    CHROME_SIGNUP: "wordsmith-chrome-signup-944",
    CHROME_LOGIN: 'wordsmith-chrome-login-944',
    CHROME_LOGOUT: 'wordsmith-chrome-logout-944',
    JWT_CHROME: "wordsmith_944_jwt_chrome",
    CIRCLE_ID: 'wordsmith-944-wordCircle',
    CAN_REWRITE: 'wordsmith_944_rewriteChecked',
    CAN_GRAMMAR: 'wordsmith_944_grammarChecked',
    REQUIRED_LENGTH: 15,
}

const dropDownPillData = [
    { image: "./images/scholar.svg", value: 'Scholarly', aiTextPrompt: ' sounds very scholarly', hoverText: 'Scholarly Tone', uniqueId: 'wordsmith-944-grammarPill4' },
    { image: "./images/proff.svg", value: 'Professional', aiTextPrompt: ' sounds very professional', hoverText: 'Professional Tone', uniqueId: 'wordsmith-944-grammarPill5' },
    { image: "./images/voab.svg", value: 'Vocabulary', aiTextPrompt: ' has an immense vocabulary', hoverText: 'Broaden Vocabulary', uniqueId: 'wordsmith-944-grammarPill6' },
    { image: "./images/active.svg", value: 'Active Voice', aiTextPrompt: ' is in an active voice', hoverText: 'Active Voice', uniqueId: 'wordsmith-944-grammarPill2' },
    { image: "./images/vivid.svg", value: 'Vivid descriptions', aiTextPrompt: ' written vividly through descriptive language', hoverText: 'Vividly', uniqueId: 'wordsmith-944-grammarPill7' },
    { image: "./images/backwards.svg", value: 'Consice', aiTextPrompt: ' is very concise', hoverText: 'Concise', uniqueId: 'wordsmith-944-grammarPill9' },
    { image: "./images/forward.svg", value: 'Lengthen', aiTextPrompt: ' is lengthy', hoverText: 'Lengthen', uniqueId: 'wordsmith-944-grammarPill8' },
];


//export all three constants
export { POPUP_CONSTANTS, CHROME_CONSTANTS, dropDownPillData, GRAMMAR_CONSTANTS, BROWSER_COMMUNICATION };