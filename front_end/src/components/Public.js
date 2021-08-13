import '../styles/Public.css';
import React from 'react';
import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from 'react-router-dom';
import Home from './Home';
import Events from './Events';
import Login from './Login';
import Register from './Register';


class Public extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <nav id='publicNav'>
                        <NavLink activeClassName="currentTab" to="/home">Home</NavLink>
                        <NavLink activeClassName="currentTab" to="/events">Events</NavLink>
                        <NavLink activeClassName="currentTab" to="/login">Log In</NavLink>
                        <NavLink activeClassName="currentTab" to="/register">Register</NavLink>
                    </nav>

                    <Switch>
                        <Route path="/home"><Home/></Route>
                        <Route path="/events"><Events/></Route>
                        <Route path="/login"><Login login={this.props.login}
                                                    receiveEthProvider={this.props.receiveEthProvider}/></Route>
                        <Route path="/register"><Register/></Route>
                        <Redirect from="/logout" to="/home"/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default Public;