import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Web3 from 'web3';
import { address, abi } from '../contractArtifacts';
import detectEthereumProvider from '@metamask/detect-provider';
import './Profile.css';

var sigUtil = require('eth-sig-util')
var ethUtil = require('ethereumjs-util');
var web3 = undefined;
var userAccount = undefined;
var rentforcementContract = undefined;

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
            state: "",
            isProfileUpdated: false
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.onProfileSave = this.onProfileSave.bind(this);

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
                                const isUserValid = await this.validateUser();
                                this.setState({ isAuth: isUserValid });
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
                        console.log('Error in calling check user exists function!');
                        // window.alert('Error in calling contract function!');
                        return;
                    }

                    if (this.state.isAuth) {

                        // contract call for fetching profile!
                        try {

                            var fetchedUserProfile = await rentforcementContract.methods.fetchUserProfle().call();
                            console.log('type: ' + typeof fetchedUserProfile);
                            console.log(fetchedUserProfile);

                            try {

                                // case1:
                                // if any one field is empty: profile incomplete
                                // if redirected or not, stay on page

                                // case2:
                                // if none field is empty: profile complete
                                // if redirected: leave page
                                // if not: stay on page

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
                                    // if redirected, should go back there again
                                    // currently, not redirected again
                                    this.setState({ username: fetchedUserProfile["userName"] });
                                    this.setState({ emailaddress: fetchedUserProfile["userEmail"] });
                                    this.setState({ contact: fetchedUserProfile["userPhone"] });
                                    this.setState({ address: fetchedUserProfile["userAddress"] });
                                    this.setState({ city: fetchedUserProfile["userCity"] });
                                    this.setState({ state: fetchedUserProfile["userState"] });

                                } else {

                                    this.setState({ username: fetchedUserProfile["userName"] });
                                    this.setState({ emailaddress: fetchedUserProfile["userEmail"] });
                                    this.setState({ contact: fetchedUserProfile["userPhone"] });
                                    this.setState({ address: fetchedUserProfile["userAddress"] });
                                    this.setState({ city: fetchedUserProfile["userCity"] });
                                    this.setState({ state: fetchedUserProfile["userState"] });
    
                                }


                            } catch (error) {
                                // unable to fetch details!
                                console.log('Unable to parse details! Error in fetching!');
                            }

                            /*
                            // not implemented in soldity yet!
                            if (fetchedUserProfile["isProfileComplete"]) {
                                // can skip this page, if called from other page!
                                // need to show, if called from profile page
                            } else {
                                // need to show in any condition
                                this.setState()
                            }*/

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

    async saveProfileDetails() {

        if (rentforcementContract) {

            try {

                var profielUpdated = await rentforcementContract.methods.createNewUser(
                    this.state.username,
                    this.state.emailaddress,
                    this.state.contact,
                    this.state.address,
                    this.state.city,
                    this.state.state
                ).send();

                console.log('Is profile updated: ' + profielUpdated);
                if (profielUpdated) {
                    this.setState({ isProfileUpdated: true });
                } else {
                    // not gonna happen! (contract always returns true)
                    // still
                    this.setState({ isProfileUpdated: false });

                }

            } catch (error) {
                // error in saving!
                console.log('error: ' + error);
                console.log('Error in calling profile update contract!');
                this.setState({ isProfileUpdated: true });
            }

        } else {
            // undefined!
            console.log('Contract instance undefined!');
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

    async onProfileSave() {

        console.log("details saved!")
        console.log(this.state.username)
        console.log(this.state.emailaddress)
        console.log(this.state.contact)
        console.log(this.state.address)
        console.log(this.state.city)
        console.log(this.state.state)

        // contract call
        // to update the details!

        await this.saveProfileDetails();

    }

    render() {

        const { isValid } = this.state;
        const { isAuth } = this.state;
        const { isMetamaskInstalled } = this.state;
        const { isProfileUpdated } = this.state;

        var isUpdatedMessage;
        if (isProfileUpdated) {
            isUpdatedMessage = <h2>Profile updated!</h2>
        } else {
            isUpdatedMessage = <h2></h2>
        }

        if (isMetamaskInstalled) {
            if (isValid) {
                if (!isAuth) {
                    return (
                        <div className="Dashboard">
                            <h3>Please validate your metamask wallet account in order to proceed!</h3>
                        </div>
                    )
                } else {
                    return (
                        // <!-- Latest compiled and minified CSS -->
                        <div className="profile-main">
                            {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"></link> */}
                            <h2>Profile!</h2>
                            <div className="profile-form" autoComplete="off">
                                <TextField id="standard-basic" label="Name" value={this.state.username} onChange={this.handleUsernameChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Email Address" value={this.state.emailaddress} onChange={this.handleEmailChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Contact Number" value={this.state.contact} onChange={this.handleContactChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Address" value={this.state.address} onChange={this.handleAddressChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="City" value={this.state.city} onChange={this.handleCityChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="State" value={this.state.state} onChange={this.handleStateChange} />
                                <br></br><br></br>
                                <Button variant="contained" color="primary" onClick={this.onProfileSave}>
                                    Save
                                </Button>
                                {isUpdatedMessage}
                            </div>
                            {/* <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script> */}
                        </div>
                        // <!-- Latest compiled and minified JavaScript -->

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