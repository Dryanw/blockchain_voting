import axios from 'axios';
import {ethers} from 'ethers';
import {React, useState} from 'react';
import {useWeb3React} from "@web3-react/core";


function Login(props) {
    const [warnText, setWarnText] = useState('');
    const {library, account} = useWeb3React();
    const [pw, setPw] = useState('');
    if (!library) {
        return (
            <div>
                Please connect your account first
            </div>
        )
    } else {
        return (
            <div>
                <p>Address: {account}</p>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(account + pw));
                    axios.get(`http://localhost:3001/login?address=${account}&hash=${hash}`, {crossDomain: true})
                        .then(
                            res => {
                                (res.data)?props.login():setWarnText('Incorrect login info, please try again');
                            }
                        )
                }}>
                    <label htmlFor="pw">Password: </label>
                    <input type="text" name='pw' onChange={(event) => setPw(event.target.value)}/>
                    <button type='submit'>Submit</button>
                </form>
                {
                    (warnText)?<p className='warnText'>{warnText}</p>:<></>
                }
            </div>
        )
    }
}


export default Login;