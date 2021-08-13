import React from 'react';


class Register extends React.Component {
    state = {
        confirm: false,
        address: null,
        password: null,
        warnText: '',
        registered: false
    }

    constructor(props) {
        super(props);
        this.register = this.register.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    setPassword(event) {
        event.preventDefault();
        this.setState({password: event.target.value});
    }

    register(event) {
        event.preventDefault();
        // TODO: put it into db
        if (!this.state.address) {
            this.setState({warnText: 'You have not connected your eth account'});
        } else {
            this.setState({registered: true})
        }
    }

    render() {
        return (
            <div>
                <p>Register</p>
                {
                    (this.state.registered)?
                        <p>You have successfully registered!</p>:
                        (this.state.confirm)?
                            <div>
                                <p>Address: {this.state.address}</p>
                                <p>Password: {this.state.password}</p>
                            </div>:
                            <form onSubmit={this.register}>
                                <label htmlFor="pw">Password</label>
                                <input type='text' name='pw' onChange={this.setPassword}/>
                            </form>
                }

                {
                    (this.state.warnText)?
                        <p className='warn'>{this.state.warnText}</p>:
                        <></>
                }

            </div>
        )
    }

}

export default Register;