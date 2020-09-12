// imports
import React, { Component } from 'react';
import Web3 from 'web3';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import detectEthereumProvider from '@metamask/detect-provider';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';


// import { Redirect } from 'react-router-dom';

// local imports
import { address, abi } from '../contractArtifacts';
import './Dashboard.css';

// local variables
var sigUtil = require('eth-sig-util')
var web3 = undefined;
var userAccount = undefined;
var rentforcementContract = undefined;

class DashboardClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            isValid: false,
            isMetamaskInstalled: false,
            isUserProfileComplete: true,
            products: []
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
                                    // continue with dashboard
                                    this.setState({ isUserProfileComplete: true });

                                    // fetch products
                                    await this.fetchAllProducts();

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

                var fetchedProducts = await rentforcementContract.methods.fetchRemainingProducts().call();
                console.log("Products fetched: " + fetchedProducts);
                this.setState({ products: fetchedProducts })

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
        const { isMetamaskInstalled, isValid, isAuth, isUserProfileComplete, products } = this.state;

        if (isMetamaskInstalled) {
            if (isValid) {

                if (isUserProfileComplete) {
                        return (
                            <p>
                                Hello world!
                            </p>
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

export default DashboardClass