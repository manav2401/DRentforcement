// imports
import React, { Component } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

// import { Redirect } from 'react-router-dom';

// local imports
import { address, abi } from '../contractArtifacts';
import './Dashboard.css';

// local variables
var sigUtil = require('eth-sig-util')
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

    async validateUser() {
        var message = "Hello friend, Please sign this message! Your one time random nonce is " + Math.random();
        var result = await web3.eth.personal.sign(
          message,
          userAccount,
          function (err, result) {
            if (err) return console.log('error: ' + err);
          }
        );

        const msgParams = { data: message }
        msgParams.sig = result
        const recovered = sigUtil.recoverPersonalSignature(msgParams)

        if (recovered === userAccount) {
            console.log('Verified!');
            return true;
        } else {
            console.log('Unable to verify');
            return false;
        }

    }


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
                web3 = new Web3(provider);

                // fetch accounts
                try {
                    var accounts = await provider.request({ method: 'eth_requestAccounts' });
                    accounts = await web3.eth.getAccounts();
                    userAccount = accounts[0];
                    console.log('Account fetched: ' + userAccount);

                    var rentforcementContract = new web3.eth.Contract(
                        abi, 
                        address, 
                        {gasPrice: '12345678', from: userAccount}
                    );

                    try {
                        var result = await rentforcementContract.methods.checkIfUserExists().call();
                        console.log('Account fetched(yes/no): ' + result);
                        if (!result) {
                            try {
                                const isUserValid = await this.validateUser();
                                this.setState({ isAuth: isUserValid });
                            } catch(error) {
                                console.log('Error: ' + error);
                                window.alert('Error in validating user!');
                            }
                        } else {
                            // user already validated
                            this.setState({ isAuth: true });
                        }
                        
                    } catch (error) {
                        console.log('error: ' + error);
                        window.alert('Error in calling contract function!');
                        return;
                    }

                } catch (error) {
                    console.log('error: ' + error);
                    window.alert('Error in fetching accounts!');
                    return;
                }

            }
        
        }
        else {
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