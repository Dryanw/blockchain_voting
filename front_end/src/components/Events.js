import axios from 'axios';
import {ethers, ContractFactory} from 'ethers';
import React from 'react';
import {useWeb3React} from "@web3-react/core";
import { Button } from "@chakra-ui/react";
import {ABI, BYTECODE} from '../artifacts/VotingEvent.js'

//function Events(props) {
//    axios.get(`http://localhost:3001/getAllEvents`, {crossDomain: true})
//        .then(
//            res => {
//                if (res.data.success){
//                    for (const {name, address, owner} : res.data.msg) {
//
//                    }
//                }
//            }
//        )
//    return (
//
//    )
//}

class Events extends React.Component {
    render() {
        return (
            <div>
                Events
            </div>
        )
    }
}

export default Events;