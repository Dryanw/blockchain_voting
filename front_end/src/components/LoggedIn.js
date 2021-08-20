import React from 'react';
import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from 'react-router-dom';
import Home from './Home';
import Events from './Events';
import CreateEvent from './CreateEvent';
import Vote from './Vote';
import '../styles/LoggedIn.css';
import {Grid} from "@material-ui/core";


class LoggedIn extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <nav id='loggedInNav'>
                        <NavLink activeClassName="currentTab" to="/home">Home</NavLink>
                        <NavLink activeClassName="currentTab" to="/events">Events</NavLink>
                        <NavLink activeClassName="currentTab" to="/createEvent">Create Event</NavLink>
                        <NavLink activeClassName="currentTab" to="/vote">Vote</NavLink>
                        <button onClick={this.props.logout}>Log Out</button>
                    </nav>

                    <Switch>
                        <Route path="/events"><Events/></Route>
                        <Route path="/createEvent">
                            <Grid container justifyContent="center">
                                <CreateEvent/>
                            </Grid>
                        </Route>

                        <Route path="/vote">

                            <Grid container justifyContent="center">
                                <Grid item xs={false} sm={7} id='vote-img'>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Vote/>
                                </Grid>
                            </Grid>
                        </Route>
                        <Route path="/home">
                            <Grid container justifyContent="center">
                                <Home/>
                            </Grid>
                        </Route>
                        <Redirect from="/login" to="/home"/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default LoggedIn;