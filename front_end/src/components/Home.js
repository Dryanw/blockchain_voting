import React from 'react';
import ReactMarkdown from 'react-markdown';
import welcome from '../images/welcome.png';
import QR from '../images/QR.png';
import icon from '../images/icon.png'


class Home extends React.Component {
    render() {
        return (
            <div style={{textAlign: "center"}}>
                <h2 style={{textAlign: "left"}}>Welcome to Voltage   <img src={icon} style={{width: '48px'}}/></h2>
                <img src={welcome} alt="Welcome"/><br/>
                Source code on <a href="https://github.com/Dryanw/blockchain_voting">https://github.com/Dryanw/blockchain_voting</a><br/>
                <img src={QR} alt="QR"/>
            </div>
        )
    }
}

export default Home;