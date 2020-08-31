// imports
import React, { Component } from 'react';
import Web3 from 'web3';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';

// import { Redirect } from 'react-router-dom';

// local imports
import { address, abi } from '../contractArtifacts';
import './Dashboard.css';

// local variables
var sigUtil = require('eth-sig-util')
var web3 = undefined;
var userAccount = undefined;
var rentforcementContract = undefined;

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            isValid: false,
            isMetamaskInstalled: false,
            isUserProfileComplete: true,
            dummyImage: "",
        };

        this.fetchAllProducts = this.fetchAllProducts.bind(this);
    }

    async validateUser() {
        const nonce = Math.round(Math.random() * 100 + Math.random() * 100);
        var message = "Hello friend, Please sign this message! Your one time random nonce is " + nonce;
        var result = await web3.eth.personal.sign(
            message,
            userAccount,
            function (err, result) {
                if (err) {
                    console.log('Unable to create personal sign message!');
                    console.log('error: ' + err);
                    return false;
                }
            }
        );

        const msgParams = { data: message }
        msgParams.sig = result
        const recovered = sigUtil.recoverPersonalSignature(msgParams)

        console.log('recovered: ' + recovered);
        console.log('user account: ' + userAccount);

        if (recovered.toLowerCase() === userAccount.toLowerCase()) {
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

                    rentforcementContract = new web3.eth.Contract(
                        abi,
                        address,
                        { gasPrice: '20000000000', from: userAccount }
                    );

                    try {
                        var result = await rentforcementContract.methods.checkIfUserExists().call();
                        console.log('Account fetched(yes/no): ' + result);
                        if (!result) {
                            try {
                                // const isUserValid = await this.validateUser();
                                // this.setState({ isAuth: isUserValid });
                                this.setState({ isAuth: false });
                                this.setState({ isUserProfileComplete: false })

                            } catch (error) {
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

                    // if auth is true
                    if (this.state.isAuth) {

                        // contract call for fetching profile!
                        try {

                            var fetchedUserProfile = await rentforcementContract.methods.fetchUserProfle().call();
                            console.log('type: ' + typeof fetchedUserProfile);
                            console.log(fetchedUserProfile);

                            try {

                                // check if profile is complete
                                // if yes, proceed with addition
                                // if no, redirect to profile

                                var isProfileComplete = true;

                                if (
                                    fetchedUserProfile["userName"] == "" ||
                                    fetchedUserProfile["userEmail"] == "" ||
                                    fetchedUserProfile["userPhone"] == "" ||
                                    fetchedUserProfile["userAddress"] == "" ||
                                    fetchedUserProfile["userCity"] == "" ||
                                    fetchedUserProfile["userState"] == ""
                                ) {
                                    isProfileComplete = false;
                                }

                                if (isProfileComplete) {
                                    // continue with product add form!
                                    this.setState({ isUserProfileComplete: true });
                                } else {
                                    // redirect to profile
                                    this.setState({ isUserProfileComplete: false });
                                }


                            } catch (error) {
                                // unable to fetch details!
                                console.log('Unable to parse details! Error in fetching!');
                            }


                        } catch (error) {
                            console.log('error: ' + error)
                            console.log('Error in calling fetch profile function!');
                        }
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

    async fetchAllProducts() {

        if (rentforcementContract) {

            try {

                var products = await rentforcementContract.methods.fetchAllProducts().call();
                console.log("Products fetched: " + products);
                console.log(products[0]['productName']);
                console.log(products[1]['productName']);
                this.setState({ dummyImage: products[0]["productImage"] });

            } catch (error) {

                // error in fetching!
                console.log('error: ' + error);
                console.log('Error in calling product fetch function!');
            }

        } else {
            // undefined!
            console.log('Contract instance undefined!');
        }

    }

    render() {
        // this.componentDidMount();
        const { isMetamaskInstalled, isValid, isAuth, isUserProfileComplete, dummyImage } = this.state;

        if (isMetamaskInstalled) {
            if (isValid) {

                if (isUserProfileComplete) {
                    return (
                        <h2>Hello!</h2>
                    )
                } else {
                    return (
                        <div>
                            <Redirect to='/profile' />
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