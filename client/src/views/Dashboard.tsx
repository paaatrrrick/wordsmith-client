//@ts-ignore
import { Redirect } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CONSTANTS from '../constants/api';
import AUTH_CONSTANTS from '../constants/auth';
import isLoggedIn from '../utils/isLoggedIn';
import logo from '../resources/logo.png';
import '../styles/Dashboard.css';
import refresh from '../resources/refresh.svg';

interface recentChangeInterface {
    aiEntry: string;
    userEntry: string;
}

const Dashboard = () => {

    const [shouldRedirfect, setShouldRedirect] = useState<Boolean>(false);
    const [recentChanges, setRecentChanges] = useState<recentChangeInterface[]>([]);

    const getRecentChanges = async () => {
        const response = await fetch(CONSTANTS.API_ENDPOINT + CONSTANTS.RECENT_CHANGES, {
            // @ts-ignore
            headers: { "x-access'wordsmith-auth-token": window.localStorage.getItem(AUTH_CONSTANTS.token) }
        });

        if (response.ok) {
            const data = await response.json();
            setRecentChanges(data.recentChanges.reverse());
        };
    }
    useEffect(() => {
        isLoggedIn().then((isAuthenticated: Boolean) => {
            if (!isAuthenticated) {
                setShouldRedirect(true);
            } else {
                getRecentChanges();
            }
        });
    }, []);

    if (shouldRedirfect) {
        return <Redirect to="/" />
    }

    const handleLogout = async () => {
        window.localStorage.removeItem(AUTH_CONSTANTS.token);
        window.postMessage({ wordsmithType: AUTH_CONSTANTS.chrome_logout }, "*");
        setShouldRedirect(true);
    }

    return (
        <div className="Dashboard">
            <div className="dashboard-navbar">
                <div className="dashboarNavbarLeftSide">
                    <img src={logo} alt="logo" />
                    <h1>wordsmith</h1>
                </div>
                <button className="button2" onClick={handleLogout}>Logout</button>
            </div>
            {/* <div className="dashboard-h1div">
                <h1>Dashboard</h1>
            </div> */}
            <div className="dashboard-maincontent">
                <div className="dashboard-textareaDiv">
                    <textarea className="dashboard-textarea" placeholder="Start typing here..." id="mytext" />
                </div>
                <div className="dashboard-recentChanges">
                    <div className="dashboard-rC-top">
                        <h2>Recent Changes</h2>
                        <img onClick={getRecentChanges} src={refresh} alt="refresh" />
                    </div>
                    <div className="dashboard-recentChangesList">
                        {recentChanges.map((change: any, index: number) => {
                            return (
                                <div key={index} className="dashboard-recentChange">
                                    <p>{change.aiEntry}</p>
                                    {/* <p>{change.userEntry}</p> */}
                                    <hr />
                                </div>
                            )
                        })}
                        {(recentChanges.length === 0) && (<p>No recent changesd</p>)}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Dashboard;