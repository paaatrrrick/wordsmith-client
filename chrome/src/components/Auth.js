import React from 'react';
import { render } from 'react-dom';
import { POPUP_CONSTANTS } from "../constants";

const Auth = () => {
    const login = () => {
        window.open(
            `${POPUP_CONSTANTS.BROWSWER_LOCATION}${POPUP_CONSTANTS.BROWSER_LOGIN}`, "_blank");
    };

    const signup = () => {
        window.open(
            `${POPUP_CONSTANTS.BROWSWER_LOCATION}${POPUP_CONSTANTS.BROWSER_SIGNUP}`, "_blank");
    };
    return (
        <div className="Auth">
            <h3>You're just three clicks away from getting started</h3>
            <button className='button2' onClick={login}>Log in</button>
            <button className='button3' onClick={signup}>Sign up</button>

        </div>

    )
}

export default Auth; 