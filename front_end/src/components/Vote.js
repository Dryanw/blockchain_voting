import axios from 'axios';
import {ethers} from 'ethers';
import {React, useState, useEffect} from 'react';
import {useWeb3React} from "@web3-react/core";
import { Button } from "@chakra-ui/react";
import {ABI} from '../artifacts/VotingEvent.js';
import {RadioGroup, FormControlLabel, Radio, FormLabel} from '@material-ui/core';
import {Input, InputLabel, IconButton, InputAdornment, FormControl} from "@material-ui/core";
import '../styles/UserForm.css';


function Vote(props) {
    const {library} = useWeb3React();
    const [contractAddr, setContractAddr] = useState('');
    const [signature, setSignature] = useState('');
    const [choices, setChoices] = useState([]);
    const [choice, setChoice] = useState(null);
    const [nonce, setNonce] = useState(0);
    const [verifiedAddr, setVerifiedAddr] = useState(false);
    const [warnText, setWarnText] = useState('');
    const [transacting, setTransacting] = useState(false);

    useEffect(() => {
        setWarnText('');
    }, [verifiedAddr]);

    return (<div className="vote">
        <form className="vote-form" onSubmit={(e) => {
            async function findEvent() {
                const res = await axios.get(`http://localhost:3001/findEvent?address=${contractAddr}`,
                                            {crossDomain: true});
                console.log(res);
                if (res.data.success) {
                    setChoices(res.data.msg.choices);
                    setVerifiedAddr(true);
                } else {
                    setWarnText('There is no event with the address given');
                }
            }
            e.preventDefault();
            findEvent();
        }}>
            <label htmlFor='contractAddr'>Contract Address: </label>
            <input type='string' name='contractAddr' onChange={(e) => {
                setVerifiedAddr(false);
                setContractAddr(e.target.value);
            }}/>
            <button type='submit'>Verify address</button>
        </form>
        {
            (verifiedAddr)
                ?<form onSubmit={(e) => {
                    async function vote() {
                        setTransacting(true);
                        const contract = new ethers.Contract(contractAddr, ABI, library.getSigner());
                        try{
                            await contract.vote(choice, nonce, signature);
                        } catch(error){
                            console.log(error);
                            setWarnText(JSON.stringify(error));
                        }
                        setTransacting(false);
                    }
                    e.preventDefault();
                    vote();
                }}>
                    <label htmlFor='signature'>Signature: </label>
                    <input required type='string' name='signature' onChange={(e) => {
                        setSignature(e.target.value);
                    }}/><br/>
                    <label htmlFor='nonce'>Nonce: </label>
                    <input required min={0} type='number' name='nonce' onChange={(e) => {setNonce(e.target.value)}}/><br/>
                    <FormLabel color="primary">You are voting for:</FormLabel>
                    <RadioGroup value={choice} onChange={(e)=>setChoice(e.target.value)}>
                        {choices.map(x => <FormControlLabel value={x}  control={<Radio/>}label={x}/>)}
                    </RadioGroup>
                    <Button isLoading={transacting} type='submit'>Vote</Button>
                </form>
                :<></>
        }
        {
            (warnText)?<span className='warnText'>{warnText}</span>:<></>
        }
        </div>
    )
}

export default Vote;