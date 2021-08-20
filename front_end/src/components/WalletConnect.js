import {React, useState, useEffect} from 'react';
import {useWeb3React} from "@web3-react/core";
import {InjectedConnector, UserRejectedRequestError} from "@web3-react/injected-connector";
import { Button } from "@chakra-ui/react";

const injected = new InjectedConnector();

function WalletConnect(props) {
    const {active, error, activate, setError, account} = useWeb3React();
    const [connecting, setConnecting] = useState(false);
    const [connectedAccount, setConnectedAccount] = useState('');

    useEffect(() => {
        if (active || error) {
            setConnecting(false);
        }
        setConnectedAccount(account);
    }, [active, error, account]);

    useEffect(() => {
        props.logout();
    }, [account])

    if (connectedAccount) {
        return (
            <div>
                Your connected account is {account}
            </div>
        )
    } else {
        return (
            <Button isLoading={connecting} onClick={() => {
                setConnecting(true);
                activate(injected, undefined, true).catch((e) => {
                    if (e instanceof UserRejectedRequestError) {
                        setConnecting(false);
                    } else {
                        setError(e);
                    }
                }
                );
                setConnecting(false);
            }}>Connect with injected provider</Button>
        );
    }
}

export default WalletConnect;