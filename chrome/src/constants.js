const PRODUCTION_API_ENDPOINT = 'https://wordsmith-api-production.up.railway.app';
const DEVELOPMENT_API_ENDPOINT = 'http://localhost:3000';

const PRODUCTION_BROWSER_ENDPOINT = 'https://try-wordsmith.netlify.app';
const DEVELOPMENT_BROWSER_ENDPOINT = 'http://localhost:3006';

const CONSTANTS = {
    API_ENDPOINT: PRODUCTION_API_ENDPOINT,
    EMAIL_SIGNUP_AUTH: '/auth/signup-email',
    EMAIL_LOGIN_AUTH: '/auth/login-email',
    CHECK_IF_LOGGED_IN: '/auth/isLoggedIn',
    BROWSWER_LOCATION: PRODUCTION_BROWSER_ENDPOINT,
    BROWSER_LOGIN: '/signin',
    BROWSER_HOME: '/',
    BROWSER_SIGNUP: '/signup',
    RECENT_CHANGES: '/recentchanges',
}

export default CONSTANTS;