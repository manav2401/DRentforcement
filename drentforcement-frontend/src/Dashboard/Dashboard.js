// imports
import React, { Component } from 'react';
import Web3 from 'web3';
import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';
// import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

// local imports
// import { address, abi } from '../contractArtifacts';
import './Dashboard.css';

// local variables
var web3 = undefined;
var userAccount = undefined;

class Dashboard extends Component {

    state = {
        loading: false
    };

    handleClick = async () => {
        const provider = await detectEthereumProvider();

        if (provider) {
            await this.fetchWalletDetails(provider);
        } else {
            window.alert('Please install MetaMask!');
            return;
        }
    }

    async fetchWalletDetails(provider) {

        if (provider !== window.ethereum) {
            alert('Multiple wallets are installed!');
        } else {
            console.log('Single account!');
            try {

                // testing for isConnected!
                var connected = provider.isConnected();
                console.log("is connected: " + connected);

                /*
                // allowing user to connect and fetch accounts
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                userAccount = accounts[0];

                // personal message sign
                web3 = new Web3(provider);  // create a new web3 instance

                var message = "Hello friend, Please sign this message!";

                var result = await web3.eth.personal.sign(
                    message,
                    userAccount,
                    function (err, result) {
                        if (err) return console.log('error: ' + err);
                    }
                );

                console.log('Result received: ' + result);

                // set the state
                this.setState({ loading: true });
                */

            } catch (error) {
                // the case if user denies account access
                console.log('Error: ' + error)
                alert('Please create / select a wallet account to proceed further!');
            }
        }
    }

    tempFunction() {
        console.log('Temp function called!');
    }

    render() {
        this.tempFunction();
        const { loading } = this.state;
        return (
            <div className="Dashboard">
                <div className="message">
                    <p>For performing this operation, you need to Connect your Metamask Wallet!</p>
                </div>

                <div className="metamask-login-button">
                    <Button variant="contained" color="primary" onClick={this.handleClick} disableElevation>
                        {loading ? `Connected ${userAccount}` : 'Connect with metamask'}
                    </Button>
                </div>
            </div>

        )
    }

}

export default Dashboard