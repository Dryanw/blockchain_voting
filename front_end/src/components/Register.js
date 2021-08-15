import axios from 'axios';
import {ethers} from 'ethers';
import {React, useState} from 'react';
import {useWeb3React} from "@web3-react/core";


function Register(props) {
    const [pw, setPw] = useState('');
    const {library, account} = useWeb3React();
    const [registered, setRegistered] = useState(false);
    const [warnText, setWarnText] = useState('');

    if (!library) {
        return (
            <div>
                Please connect your account first
            </div>
        )
    }

    return (
        <div>
            {
                (registered)
                    ?<p>You have successfully registered!</p>
                    :<form onSubmit={(event) => {
                        event.preventDefault();
                        let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(account + pw));
                        axios.get(`http://localhost:3001/register?address=${account}&hash=${hash}`, {crossDomain: true})
                             .then(
                                 res => {
                                     (res.data.success)?setRegistered(true):setWarnText(res.data.msg);
                                 }
                             )
                    }}>
                        <label htmlFor="pw">Password: </label>
                        <input type='text' name='pw' onChange={(event) => setPw(event.target.value)}/>
                    </form>
            }
            {
                (warnText)?<p className='warnText'>{warnText}</p>:<></>
            }
        </div>
    )

}

export default Register;