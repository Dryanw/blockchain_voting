import axios from 'axios';
import {ethers} from 'ethers';
import {React, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import {Input, InputLabel, IconButton, InputAdornment, Button, FormControl} from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import '../styles/UserForm.css';


function Register(props) {
    const [pw, setPw] = useState('');
    const {library, account} = useWeb3React();
    const [registered, setRegistered] = useState(false);
    const [warnText, setWarnText] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!library) {
        return (
            <div className="register">
                Please connect your account first
            </div>
        )
    }

    return (
        <div className='register'>
            {
                (registered)
                    ?<p>You have successfully registered!</p>
                    :<form className='register-form' onSubmit={(event) => {
                        event.preventDefault();
                        let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(account + pw));
                        axios.get(`http://localhost:3001/register?address=${account}&hash=${hash}`, {crossDomain: true})
                             .then(
                                 res => {
                                     (res.data.success)?setRegistered(true):setWarnText(res.data.msg);
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
                                required
                                value={pw}
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
                        <Button style={{'margin-top': '30px'}} variant="contained" color="secondary" type="submit"
                                >Register</Button>
                    </form>
            }
            {
                (warnText)?<p className='warnText'>{warnText}</p>:<></>
            }
        </div>
    )

}

export default Register;