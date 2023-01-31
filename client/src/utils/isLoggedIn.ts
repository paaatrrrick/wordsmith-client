import CONSTANTS from '../constants/api';
import AUTH_CONSTANTS from '../constants/auth';

//set typescript return types to boolean for the function
const isLoggedIn: () => Promise<boolean> = async () => {
    //fetch the api to check if the user is logged in with the token
    const res = await fetch(`${CONSTANTS.API_ENDPOINT}${CONSTANTS.CHECK_IF_LOGGED_IN}`, {
        //@ts-ignore
        headers: { "x-access'wordsmith-auth-token": window.localStorage.getItem(AUTH_CONSTANTS.token) }
    });
    if (res.ok) {
        return true;
    }
    return false;
}


export default isLoggedIn;