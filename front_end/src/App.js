import {React, useState} from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import {Web3Provider} from "@ethersproject/providers";
import Public from './components/Public';
import LoggedIn from './components/LoggedIn';
import WalletConnect from './components/WalletConnect';
import './styles/main.css';


function getLibrary(provider) {
    return new Web3Provider(provider);
}

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <WalletConnect logout={() => setLoggedIn(false)}/>
            {
                (loggedIn)
                    ?<LoggedIn logout={() => setLoggedIn(false)}/>
                    :<Public login={() => setLoggedIn(true)}/>
            }
        </Web3ReactProvider>
    )

}

export default App;
