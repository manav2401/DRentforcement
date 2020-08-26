import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Web3 from 'web3';
import { address, abi } from '../contractArtifacts';
import detectEthereumProvider from '@metamask/detect-provider';
import './Profile.css';

var sigUtil = require('eth-sig-util')
var web3 = undefined;
var userAccount = undefined;

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            isValid: false,
            isMetamaskInstalled: false,
            username: "",
            emailaddress: "",
            contact: "",
            address: "",
            city: "",
            state: ""
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.onProfileSubmit = this.onProfileSubmit.bind(this);

    }

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
                            
                            // set flag here
                        } else {
                            this.setState({ isAuth: true });
                        }
                        
                    } catch (error) {
                        console.log('error: ' + error);
                        window.alert('Error in calling contract function!');
                        return;
                    }
    
                    this.setState({ isAuth: true });    

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

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handleEmailChange(e) {
        this.setState({ emailaddress: e.target.value });
    }

    handleContactChange(e) {
        this.setState({ contact: e.target.value });
    }

    handleAddressChange(e) {
        this.setState({ address: e.target.value });
    }
    
    handleCityChange(e) {
        this.setState({ city: e.target.value });
    }

    handleStateChange(e) {
        this.setState({ state: e.target.value });
    }

    onProfileSubmit() {

        console.log("details saved!")
        console.log(this.state.username)
        console.log(this.state.emailaddress)
        console.log(this.state.contact)
        console.log(this.state.address)
        console.log(this.state.city)
        console.log(this.state.state)

        // contract call
        // const provider = await detectEthereumProvider();


    }

    render() {

        const { isValid } = this.state;
        const { isAuth } = this.state;
        const { isMetamaskInstalled } = this.state;

        if (isMetamaskInstalled) {
            if (isValid) {
                if (!isAuth) {
                    return (
                        <div className="Dashboard">
                            <h3>Please connect your metamask account in order to use this dapp!</h3>
                        </div>
                    )
                } else {
                    return (
                        <div className="profile-main">
                        <h2>Profile!</h2>
                        <div className="profile-form" autoComplete="off">
                            <TextField id="standard-basic" label="Name" value={this.state.username} onChange={this.handleUsernameChange}/>
                            <br></br><br></br>
                            <TextField id="standard-basic" label="Email Address" value={this.state.emailaddress} onChange={this.handleEmailChange}/>
                            <br></br><br></br>
                            <TextField id="standard-basic" label="Contact Number" value={this.state.contact} onChange={this.handleContactChange}/>
                            <br></br><br></br>
                            <TextField id="standard-basic" label="Address" value={this.state.address} onChange={this.handleAddressChange}/>
                            <br></br><br></br>
                            <TextField id="standard-basic" label="City" value={this.state.city} onChange={this.handleCityChange}/>
                            <br></br><br></br>
                            <TextField id="standard-basic" label="State" value={this.state.state} onChange={this.handleStateChange}/>
                            <br></br><br></br>
                            <Button variant="contained" color="primary" onClick={this.onProfileSubmit}>
                                Submit
                            </Button>
        
                        </div>
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

export default Profile