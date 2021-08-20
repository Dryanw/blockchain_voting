import axios from 'axios';
import {ethers, ContractFactory} from 'ethers';
import {React, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import { Button } from "@chakra-ui/react";
import {ABI, BYTECODE} from '../artifacts/VotingEvent.js';
import {Input, InputLabel, IconButton, InputAdornment, FormControl, FormControlLabel, Checkbox} from "@material-ui/core";
import "../styles/createEvent.css"


function CreateEvent(props) {
    let fileReader;
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
    const [signatures, setSignatures] = useState(null);

    return (
        <div className="createEvent">
            <form className="create-form"
                onSubmit={(event)=>{
                async function deployContract(response) {
                    const deployValue = (useToken)?0:signatures.length * prize;
                    const factory = new ContractFactory(ABI, BYTECODE, library.getSigner());
                    const contract = await factory.deploy(
                        (useToken)?ethers.utils.getAddress(tokenAddress):ethers.constants.AddressZero,
                        prize, signatures.length, allowChange, {value: deployValue});
                    await contract.deployed();
                    setResult(contract.address);
                    let dbChoices = choices.map((item) => item.value).join('|');
                    await axios.get(`http://localhost:3001/newEvent?name=${eventName}&address=${contract.address}&owner=${account}&choices=${dbChoices}`,
                                    {crossDomain: true});
                    setDeploying(false);

                }

                event.preventDefault();
                setWarnText('');
                let distinctChoices = [...new Set(choices.map((item) => item.value))];
                console.log(distinctChoices.length === numberChoices);

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
                axios.get(`http://localhost:3001/findEvent?name=${eventName}&owner=${account}`, {crossDomain: true})
                    .then(
                        res => {
                            console.log(res);
                            if (res.data.success){
                            } else if (res.data.msg === ''){
                                deployContract(res);
                            } else {
                                setDeploying(false);
                                setWarnText(res.data.msg);
                            }
                        }
                    );
            }}>
                <FormControl>
                    <InputLabel htmlFor="eventName">Event Name</InputLabel>
                    <Input
                        required
                        type="text"
                        name="eventName"
                        onChange={(event) => {setEventName(event.target.value)}}
                    />
                </FormControl>

                <FormControl>
                    <InputLabel htmlFor="numberChoice">Number of Voting Choices</InputLabel>
                    <Input
                        required
                        type="number"
                        name="numberChoice"
                        onChange={(event) => {
                                            setNumberChoices(event.target.value);
                                            let temp = []
                                            for (let i=0; i<event.target.value; i++){
                                                temp.push({id: i, value: ''});
                                            }
                                            setChoices(temp);
                                        }}
                    />
                </FormControl>
                {
                    choices.map(choice =>
                        <FormControl>
                            <InputLabel htmlFor={"choice" + (choice.id + 1)}>{'Choice ' + (choice.id + 1)}</InputLabel>
                            <Input
                                required
                                type="text"
                                name={"choice" + (choice.id + 1)}
                                onChange={(event) => {
                                    setChoices(choices.map((item) => {
                                        if (item.id === choice.id) {
                                            item.value = event.target.value;
                                        }
                                        return item;
                                    }));
                                }}
                            />
                        </FormControl>)
                }
                <label htmlFor='voters'>File with all Voters: </label>
                <input required type='file' onChange={(e) => {
                    console.log(e.target.files[0]);
                    let signatures = [];
                    fileReader = new FileReader();
                    fileReader.onloadend = (e) => {
                        const content = fileReader.result.split('\n').filter((x) => (x !== ''));
                        console.log(content);
                        // Verify the addresses in the file
                        for (var index = 0; index < content.length; index++){
                            try {
                                ethers.utils.getAddress(content[index]);
                            } catch (err) {
                                setWarnText('Invalid address in the file: ' + content[index] + ' please upload again');
                                return
                            }
                        }

                        // Get signatures
                        content.forEach((a, index) => {
                            let message = ethers.utils.solidityKeccak256(['address', 'uint256'], [a, index]);
                            library.getSigner().signMessage(ethers.utils.arrayify(message)).then((s) => {
                                signatures.push([index, a, s]);
                                console.log(`${index} | ${a} | ${s}`);
                            });
                        });
                        setSignatures(signatures)
                    };
                    fileReader.readAsText(e.target.files[0]);
                }} onClick={e => {e.target.value = null}} /><br/>

                <FormControlLabel
                    label="Use ERC20 Token?"
                    labelPlacement="end"
                    control={<Checkbox
                                color="primary"
                                onChange={(event) => {setUseToken(!useToken)}}
                             />}
                />
                {
                    (useToken)
                        ?<>
                         <label htmlFor="tokenAddress">Token Address: </label>
                         <input required type='text' name='tokenAddress' onChange={(event) => {setTokenAddress(event.target.value)}}/><br/>
                         </>
                        :<></>
                }
                <FormControlLabel
                    label="Allow Change of Vote?"
                    labelPlacement="end"
                    control={<Checkbox
                                color="primary"
                                onChange={(event) => {setAllowChange(!allowChange)}}
                             />}
                />

                <FormControl>
                    <InputLabel htmlFor="prize">Prize</InputLabel>
                    <Input
                        required
                        type="number"
                        name="prize"
                        inputProps={{min: 0, step: 1}}
                        onChange={(event) => {setPrize(event.target.value)}}
                    />
                </FormControl>
                {
                    (prize === null || signatures === null)
                        ?<></>
                        :<><span>You need {prize * signatures.length} {(useToken)?'token':'wei'} for deploying</span><br/></>
                }
                <br/>
                <Button isLoading={deploying} loadingText="Deploying" type="submit">Create an event</Button>
            </form>
            {
                (result)?(
                    <div>
                        <p className='result'>The contract is deployed at {result}</p>
                        <table>
                            <tr><th>Nonce</th><th>Address</th><th>Signature</th></tr>
                            {signatures.map((x) => <tr>{x.map((y)=><td>{y}</td>)}</tr>)}
                        </table>
                    </div>
                ):<></>
            }
            {
                (warnText)?<p className='warnText'>{warnText}</p>:<></>
            }
        </div>
    )
}

export default CreateEvent;