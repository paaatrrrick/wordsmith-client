//@ts-ignore
import { Route, Switch } from "react-router-dom";
import CONSTANTS from '../constants/api';
import Home from './Home';
import Dashboard from './Dashboard';
import Error from './Error';
import Resources from './Resources';
//@ts-ignore
import Auth from './auth/Auth';
import Privacypolicy from "./Privacypolicy";

const Router = () => {
    return (
        <div className="Router">
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/home' component={Home} />
                <Route exact path='/error' component={Error} />
                <Route exact path='/resources' component={Resources} />
                <Route exact path='/signup' render={() => <Auth screen={'Sign Up'} />} />
                <Route exact path='/signin' render={() => <Auth screen={'Sign In'} />} />
                <Route exact path='/privacypolicy' component={Privacypolicy} />
                {/* <Route exact path='/signup' render={<Auth screen={'Sign Up'} />} />
                <Route exact path='/signin' render={<Auth screen={'Sign In'} />} /> */}
                {/* <Route exact path='/login/chrome' render={<Login shouldCloseTabOnSubmit={true} />} /> */}
                {/* <Route exact path='/profile/:id' render={routeProps => <ViewProfile {...routeProps} />} /> */}
                <Route exact path='/*' component={Home} />
                <Route exact path='*' component={Home} />
            </Switch>
        </div>
    );
}

export default Router;
