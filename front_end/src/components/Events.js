import axios from 'axios';
import {ethers} from 'ethers';
import {React, useState, useEffect} from 'react';
import {useWeb3React} from "@web3-react/core";
import { Button } from "@chakra-ui/react";
import {ABI} from '../artifacts/VotingEvent.js';
import { DataGrid } from '@material-ui/data-grid';
import Event from './Event';

const colors = ['#00909E', '#89DBEC', '#ED0026', '#FA9D00', '#FFD08D', '#B00051', '#F68370', '#FEABB9', '#6E006C',
                '#91278F', '#CF97D7', '#000000', '#5B5B5B', '#D4D4D4']

function Events(props) {
    const [rows, setRows] = useState([]);
    const [contractAddress, setAddress] = useState(null);
    const [eventStatus, setEventStatus] = useState({});
    const {library, account} = useWeb3React();
    const [warnText, setWarnText] = useState('');
    const [initialized, setInitialized] = useState(false);
    const [choices, setChoices] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [key, setKey] = useState(0);


    const fetchEvents = () => {
        axios.get('http://localhost:3001/getAllEvents', {crossDomain: true})
            .then(
                res => {
                    if (res.data.success) {
                        setRows(res.data.msg.map((x) => {
                            x.id = x.name;
                            return x;
                        }));
                    }
                }
            );
    }

    const columns = [
        {field: 'name', headerName: 'Event Name', flex: 1},
        {field: 'address', headerName: 'Contract Address', flex: 1},
        {field: 'choices', headerName: 'Contract Choices', flex: 1, hide: true},
        {field: 'button', headerName: '', flex: 1,
         renderCell: (params) => {
            const onClick = () => {
                setAddress(params.getValue(params.id, "address"));
                setChoices(params.getValue(params.id, "choices"))
            };

            return <Button isLoading={fetching && (contractAddress === params.getValue(params.id, "address"))}
                           onClick={onClick}>Check Status</Button>
         }}
    ];

    useEffect(() => {
        setWarnText('');
    }, [account])

    useEffect(() => {
        fetchEvents();
        setInitialized(true);
        const timer = setInterval(() => {
            fetchEvents()
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (contractAddress === null) return;
        if (!library) {
            setWarnText('Please connect your account first');
            return
        }
        const contract = new ethers.Contract(contractAddress, ABI, library.getSigner());
        setFetching(true);

        async function fetchData() {
            let status = {};
            status['result'] = [];
            const p = await contract.prize();
            const c = await contract.votedCount();
            const v = await contract.numberVotes();
            for (var index = 0; index < choices.length; index++){
                let choice = choices[index];
                const n = await contract.voteStatus(choice);
                status['result'].push({title: choice,
                                       value: n.toNumber(),
                                       color: colors[index + 1]});
            }
            status['prize'] = p.toString();
            status['process'] = `${c}/${v}`;
            status['result'].push({title: 'Not Voted', value: v.toNumber() - c.toNumber(), color: colors[0]});
            setFetching(false);
            setEventStatus(status);
            setKey(Math.random());
        }
        fetchData();
    }, [contractAddress]);

    return (
        <div>
            {
                (rows.length > 0)
                    ?<DataGrid rows={rows} columns={columns} pageSize={10} autoHeight={true}
                               disableSelectionOnClick={true}/>
                    :(initialized)
                        ?<h3>No event is happening, go create one now!</h3>
                        :<h3>Fetching events</h3>
            }
            {
                (warnText)
                    ?<span className='warnText'>{warnText}</span>
                    :<></>
            }
            {
                (Object.keys(eventStatus).length === 0 && !fetching)
                    ?<></>
                    :<Event key={key} eventStatus={eventStatus}/>
            }
        </div>
    )
}


export default Events;