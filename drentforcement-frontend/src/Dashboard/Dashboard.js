// imports
import React, { Component } from 'react';
import Web3 from 'web3';
// import ethers from 'ethers';
// import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';
// import { Redirect } from 'react-router-dom';

// local imports
import { address, abi } from '../contractArtifacts';
import './Dashboard.css';

// local variables
var web3 = undefined;
var userAccount = undefined;

/**
 * checks in dashboard
 * 1. check for provider
 * 2. set required flag if not found
 * 3. fetch account function
 * 4 .case1: if accounts fetched: use them 
 * 5. case2: if accounts not fetched: popup
 */
class Dashboard extends React.Component {

    state = {
        isAuth: false,
        isValid: false,
        isMetamaskInstalled: false,
    };

    async componentDidMount() {
        const provider = await detectEthereumProvider();

        if (provider) {

            this.setState({ isMetamaskInstalled: true });
            if (provider !== window.ethereum) {
                this.setState({ isValid: false })
                alert('Multiple wallets are installed!');
                return;
    
            } else {

                console.log('Single wallet!');
                this.setState({ isValid: true });

                // fetch accounts
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                userAccount = accounts[0];
                console.log('Account fetched: ' + userAccount);

                // check here if account already exists or not;
                // if exists: skip personal message sign;
                // if not: make user sign

                web3 = new Web3(provider);
                var rentforcementContract = new web3.eth.Contract(abi, address);

            }
        
        } else {
            this.setState({ isMetamaskInstalled: false });
            window.alert('Please install MetaMask!');
            return;
        }


    }

    render() {
        // this.componentDidMount();
        const { isValid } = this.state;
        const { isAuth } = this.state;
        const { isMetamaskInstalled } = this.state;

        if (isMetamaskInstalled) {
            if (isValid) {
                if (!isAuth) {
                    return (
                        <div className="Dashboard">
                            {/* <Redirect to="/auth" /> */}
                            <h3>Redirect</h3>
                        </div>
                    )
                } else {
                    return (
                        <div className="Dashboard">
                            <h3>Welcome to D-rentforcement</h3>
                        </div>
                    )
                }
            } else {
                return (
                    <div className="Dashboard">
                        <h3>Multiple wallets are installed! This dapp is only compatible with Metamask!</h3>
                    </div>
                )
            }
        } else {
            return (
                <div className="Dashboard">
                    <h3>Please install a compatible wallet such as Metamask!</h3>
                </div>
            )

        }

    }

}

export default Dashboard