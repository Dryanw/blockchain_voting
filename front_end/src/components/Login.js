import React from 'react';


class Login extends React.Component {
    state = {
        ethClient: null,
        warnText: ''
    }

    getEthConnector(event) {
        event.preventDefault();
        console.log('TODO: Connect to eth connector');
        let result;
        this.setState({ethClient: {'address': 'test', 'balance': 0}});
        this.props.receiveEthProvider(result);
    }

    handlePasswordChange = event => {
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div>
                <p>Login by connecting your eth provider and entering your password</p>
                {
                    (this.state.ethClient)
                        ?<div>
                            <p>Address: {this.state.ethClient.address}</p>
                            <p>Current Balance: {this.state.ethClient.balance}</p>
                            <button onClick={()=>{this.setState({ethClient: null})}}>Connect to another account</button>
                        </div>
                        :<button onClick={this.getEthConnector}>Connect to your eth provider</button>
                }
                <form onSubmit={this.props.login}>
                    <label htmlFor="pw">Password: </label>
                    <input type="text" name='pw'/>
                    <button type='submit'>Submit</button>
                </form>
                {
                    (this.state.warnText)?<p className='warnText'>{this.state.warnText}</p>:<></>
                }
            </div>
        )
    }
}

export default Login;