import '../styles/Public.css';
import React from 'react';
import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from 'react-router-dom';
import {Grid} from "@material-ui/core";
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
                        <Redirect exact from="/" to="/home"/>
                        <Route path="/home">
                            <Grid container justifyContent="center">
                                <Home/>
                            </Grid>
                        </Route>
                        <Route path="/events"><Events/></Route>
                        <Route path="/login">
                            <Grid container justify="center">
                                <Grid item xs={false} sm={7} id='login-img'>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Login login={this.props.login}
                                           receiveEthProvider={this.props.ethClient}/>
                                </Grid>
                            </Grid>
                        </Route>
                        <Route path="/register">
                            <Grid container justify="center">
                                <Grid item xs={false} sm={7} id='register-img'>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Register/>
                                </Grid>
                            </Grid>
                        </Route>
                        <Redirect from="/logout" to="/home"/>
                        <Redirect from="/createEvent" to="/home"/>
                        <Redirect from="/vote" to="/home"/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default Public;