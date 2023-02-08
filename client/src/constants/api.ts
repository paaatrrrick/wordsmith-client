type constantTypes = {
    API_ENDPOINT: string;
    EMAIL_SIGNUP_AUTH: string;
    EMAIL_LOGIN_AUTH: string;
    GOOGLE_AUTH: string;
    CHECK_IF_LOGGED_IN: string;
    RECENT_CHANGES: string;
    CHROME_LINK: string;
}

const PRODUCTION_API_ENDPOINT: string = 'https://wordsmith-api-production.up.railway.app';
const DEVELOPMENT_API_ENDPOINT: string = 'http://localhost:3000';

const CONSTANTS: constantTypes = {
    API_ENDPOINT: DEVELOPMENT_API_ENDPOINT,
    EMAIL_SIGNUP_AUTH: '/auth/signup-email',
    EMAIL_LOGIN_AUTH: '/auth/login-email',
    GOOGLE_AUTH: '/auth/google',
    CHECK_IF_LOGGED_IN: '/auth/isLoggedIn',
    RECENT_CHANGES: '/recentchanges',
    CHROME_LINK: 'https://chrome.google.com/webstore/detail/wordsmith/ffjginbaonjceegjiapjgopplicfpbcm/related',
};

export default CONSTANTS;