import axios from 'axios';
import {ethers, ContractFactory} from 'ethers';
import {React, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import { Button } from "@chakra-ui/react";
import {ABI, BYTECODE} from '../artifacts/VotingEvent.js'


function CreateEvent(props) {
    const {library, account} = useWeb3React();
    const [eventName, setEventName] = useState('');
    const [useToken, setUseToken] = useState(false);
    const [allowChange, setAllowChange] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');
    const [warnText, setWarnText] = useState('');
    const [deploying, setDeploying] = useState(false);
    const [result, setResult] = useState('');
    const [numberChoices, setNumberChoices] = useState(0);
    const [choices, setChoices] = useState([]);
    const [prize, setPrize] = useState(0);

    return (
        <div>
            <form onSubmit={(event)=>{
                event.preventDefault();
                setWarnText('');
                let distinctChoices = [...new Set(choices.map((item) => item.value))];
                if (distinctChoices.length != numberChoices){
                    setWarnText('There are duplicated choices, please check again');
                    return;
                }
                if (tokenAddress && !ethers.utils.isAddress(tokenAddress)){
                    setWarnText('Invalid token address given, please check again');
                    return;
                }
                setDeploying(true);

                // Check if any event with the same name exist already
                axios.get(SCRUBBED_LINK, {crossDomain: true})
                    .then(
                        res => {
                            if (res.data.success){
                                setWarnText('There is an event with the same name for you already');
                                setDeploying(false);
                            } else if (res.data.msg === ''){
                                const factory = new ContractFactory(ABI, BYTECODE, library.getSigner());
                                // TODO: Read number of voters and create the signature after deploying the contract
                                factory.deploy((useToken)?ethers.utils.getAddress(tokenAddress):ethers.constants.AddressZero, prize, 10, allowChange)
                                    .then((contract) => {
                                        setResult(contract.address);
                                        let dbChoices = choices.map((item)=>item.value).join('|');
                                        axios.get(SCRUBBED_LINK,
                                            {crossDomain: true})
                                            .then(res => {
                                                setDeploying(false);
                                            });
                                    });
                            } else {
                                setDeploying(false);
                                setWarnText(res.data.msg);
                            }
                        }
                    );

            }}>
                <label htmlFor="eventName">Event Name: </label>
                <input type='text' name='eventName' onChange={(event) => {setEventName(event.target.value)}}/><br/>
                <label htmlFor="numberChoices">Number of Voting Choices: </label>
                <input type="number" name="numberChoices" onChange={(event) => {
                    setNumberChoices(event.target.value);
                    let temp = []
                    for (let i=0; i<event.target.value; i++){
                        temp.push({id: i, value: ''});
                    }
                    setChoices(temp);
                }}/><br/>
                {
                    choices.map(choice => <>
                        <label htmlFor={'choice' + (choice.id + 1)}>{'Choice ' + (choice.id + 1) + ': '}</label>
                        <input type='text' name={'choice' + (choice.id + 1)} onChange={(event) => {
                            setChoices(choices.map((item) => {
                                if (item.id === choice.id) {
                                    item.value = event.target.value;
                                }
                                return item;
                            }));
                        }}/><br/>
                    </>)
                }

                <label htmlFor="useToken">Use ERC20 Token? </label>
                <input type='checkbox' name='useToken' onChange={(event) => {setUseToken(!useToken)}}/><br/>
                {
                    (useToken)
                        ?<>
                         <label htmlFor="tokenAddress">Token Address: </label>
                         <input type='text' name='tokenAddress' onChange={(event) => {setTokenAddress(event.target.value)}}/><br/>
                         </>
                        :<></>
                }
                <label htmlFor="allowChange">Allow Change of Vote? </label>
                <input type='checkbox' name='allowChange' onChange={(event) => {setAllowChange(!allowChange)}}/><br/>

                <label htmlFor='prize'>Prize: </label>
                <input type='number' name='prize' step={1} onChange={(event) => {setPrize(event.target.value)}}/><br/>

                <br/>
                <Button isLoading={deploying} loadingText="Deploying" type="submit">Create an event</Button>
            </form>
            {
                (result)?<p className='result'>The contract is deployed at {result}</p>:<></>
            }
            {
                (warnText)?<p className='warnText'>{warnText}</p>:<></>
            }
        </div>
    )
}

export default CreateEvent;