import React from 'react';
import Public from './components/Public';
import LoggedIn from './components/LoggedIn';
import './styles/main.css';


class App extends React.Component {
    state = {
        loggedIn: false,
        userId: '',
        ethProvider: null
    }

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.receiveEthProvider = this.receiveEthProvider.bind(this);
    }

    login() {
        console.log('Logging in');
        this.setState({loggedIn: true});
    }

    logout() {
        console.log('logging out');
        this.setState({loggedIn: false});
    }

    receiveEthProvider(_ethProvider) {
        console.log('Connected with eth provider');
        this.setState({ethProvider: _ethProvider});
    }

    render() {
        return (
            <div>
                {
                    (this.state.loggedIn)?<LoggedIn logout={this.logout} ethProvider={this.state.ethProvider}/>
                                         :<Public login={this.login} receiveEthProvider={this.receiveEthProvider}/>
                }
            </div>
        )
    }
}

export default App;
