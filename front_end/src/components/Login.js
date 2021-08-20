import axios from 'axios';
import {ethers} from 'ethers';
import {React, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import {Input, InputLabel, IconButton, InputAdornment, Button, FormControl} from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import '../styles/UserForm.css';


function Login(props) {
    const [warnText, setWarnText] = useState('');
    const {library, account} = useWeb3React();
    const [pw, setPw] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!library) {
        return (
            <div>
                Please connect your account first
            </div>
        )
    }
    return (
        <div className="login">
            <form className="login-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(account + pw));
                    axios.get(`http://localhost:3001/register?address=${account}&hash=${hash}`, {crossDomain: true})
                        .then(
                            res => {
                                (res.data.success)?props.login():setWarnText('Incorrect login info, please try again');
                            }
                        )
                }}>

                <FormControl>
                    <InputLabel htmlFor="address">Address</InputLabel>
                    <Input
                        name="address"
                        disabled
                        defaultValue={account}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="pw">Password</InputLabel>
                    <Input
                        name="pw"
                        value={pw}
                        required
                        type={showPassword?'text':'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={(e) => {setShowPassword(!showPassword)}}
                                    onMouseDown={(e) => {e.preventDefault()}}
                                    edge="end">
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        onChange={(event) => setPw(event.target.value)}
                    />
                </FormControl>
                <Button style={{'margin-top': '30px'}} variant="contained" color="primary" type="submit"
                        >Log In</Button>
            </form>

            {
                (warnText)?<p className='warnText'>{warnText}</p>:<></>
            }
        </div>
    )
}


export default Login;