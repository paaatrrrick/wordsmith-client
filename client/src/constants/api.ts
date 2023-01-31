type constantTypes = {
    API_ENDPOINT: string;
    EMAIL_SIGNUP_AUTH: string;
    EMAIL_LOGIN_AUTH: string;
    GOOGLE_AUTH: string;
    CHECK_IF_LOGGED_IN: string;
    RECENT_CHANGES: string;
}

const PRODUCTION_API_ENDPOINT: string = 'https://wordsmith-api-production.up.railway.app';
const DEVELOPMENT_API_ENDPOINT: string = 'http://localhost:3000';

const CONSTANTS: constantTypes = {
    API_ENDPOINT: PRODUCTION_API_ENDPOINT,
    EMAIL_SIGNUP_AUTH: '/auth/signup-email',
    EMAIL_LOGIN_AUTH: '/auth/login-email',
    GOOGLE_AUTH: '/auth/google',
    CHECK_IF_LOGGED_IN: '/auth/isLoggedIn',
    RECENT_CHANGES: '/recentchanges',
};

export default CONSTANTS;