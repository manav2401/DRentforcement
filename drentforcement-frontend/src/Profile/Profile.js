import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';

import Web3 from 'web3';
import { ContractAddress, abi } from '../contractArtifacts';
import detectEthereumProvider from '@metamask/detect-provider';
import './Profile.css';

var sigUtil = require('eth-sig-util')
var ethUtil = require('ethereumjs-util');
var web3 = undefined;
var userAccount = undefined;
var rentforcementContract = undefined;

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    bottom: {
        display: 'flex',
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 3),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
}));

function Profile(props) {

    const classes = useStyles();

    const [isAuth, setIsAuth] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const [username, setUsername] = useState('');
    const [emailaddress, setEmailaddress] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [flag, setFlag] = useState(false);

    const validateUser = async () => {
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

    useEffect(() => {

        let isMounted = true;

        async function preChecks() {

            if (isMounted) {

                const provider = await detectEthereumProvider();

                if (provider) {
        
                    // this.setState({ isMetamaskInstalled: true });
                    setIsMetamaskInstalled(true);
                    if (provider !== window.ethereum) {
                        // this.setState({ isValid: false })
                        setIsValid(false);
                        alert('Multiple wallets are installed!');
                        return;
        
                    } else {
        
                        console.log('Single wallet!');
                        // this.setState({ isValid: true });
                        setIsValid(true);
                        web3 = new Web3(provider);
        
                        // fetch accounts
                        try {
                            var accounts = await provider.request({ method: 'eth_requestAccounts' });
                            accounts = await web3.eth.getAccounts();
                            userAccount = accounts[0];
                            console.log('Account fetched: ' + userAccount);
        
                            rentforcementContract = new web3.eth.Contract(
                                abi,
                                ContractAddress,
                                { gasPrice: '200000000000', from: userAccount }
                            );
        
                            try {
                                var result = await rentforcementContract.methods.checkIfUserExists().call();
                                console.log('Account fetched(yes/no): ' + result);
                                if (!result) {
                                    try {
                                        const isUserValid = await validateUser();
                                        // this.setState({ isAuth: isUserValid });
                                        setIsAuth(isUserValid);
                                    } catch (error) {
                                        console.log('Error: ' + error);
                                        window.alert('Error in validating user!');
                                    }
                                } else {
                                    // user already validated
                                    // this.setState({ isAuth: true });
                                    setIsAuth(true);
                                }
        
                            } catch (error) {
                                console.log('error: ' + error);
                                console.log('Error in calling check user exists function!');
                                // window.alert('Error in calling contract function!');
                                return;
                            }
        
                            if (isAuth) {
        
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
                                            fetchedUserProfile["userName"] === "" || 
                                            fetchedUserProfile["userEmail"] === "" ||
                                            fetchedUserProfile["userPhone"] === "" ||
                                            fetchedUserProfile["userAddress"] === "" ||
                                            fetchedUserProfile["userCity"] === "" ||
                                            fetchedUserProfile["userState"] === ""
                                        ) {
                                            isProfileComplete = false;
                                        }
                                        
                                        console.log('Profile Completed: ' + isProfileComplete);
                                        console.log('Fetched profile')
                                        console.log(fetchedUserProfile);
                                        setUsername(fetchedUserProfile['userName']);
                                        setEmailaddress(fetchedUserProfile['userEmail']);
                                        setContact(fetchedUserProfile['userPhone']);
                                        setAddress(fetchedUserProfile['userAddress']);
                                        setCity(fetchedUserProfile['userCity']);
                                        setState(fetchedUserProfile['userState']);
        
                                        /*
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
            
                                        }*/
        
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
                    // this.setState({ isMetamaskInstalled: false });
                    setIsMetamaskInstalled(false);
                    window.alert('Please install MetaMask!');
                    return;
                }
            }

            // flag = false;
            setFlag(true);

        }

        preChecks();

        return() => { isMounted = false };

    }, [flag]);

    const saveProfileDetails = async () => {

        if (rentforcementContract) {
            try {

                var profielUpdated = await rentforcementContract.methods.createNewUser(
                    username,
                    emailaddress,
                    contact,
                    address,
                    city,
                    state
                ).send();

                console.log('Is profile updated: ' + profielUpdated);
                if (profielUpdated) {
                    // this.setState({ isProfileUpdated: true });
                    setIsProfileUpdated(true);
                } else {
                    // not gonna happen! (contract always returns true)
                    // still
                    // this.setState({ isProfileUpdated: false });
                    setIsProfileUpdated(false);
                }

            } catch (error) {
                // error in saving!
                console.log('error: ' + error);
                console.log('Error in calling profile update contract!');
                // this.setState({ isProfileUpdated: true });
                setIsProfileUpdated(false);
            }

        } else {
            // undefined!
            console.log('Contract instance undefined!');
        }
    }

    const handleUsernameChange = (e) => {
        // this.setState({ username: e.target.value });
        setUsername(e.target.value);
    }

    const handleEmailChange = (e) => {
        // this.setState({ emailaddress: e.target.value });
        setEmailaddress(e.target.value);
    }

    const handleContactChange = (e) => {
        // this.setState({ contact: e.target.value });
        setContact(e.target.value);
    }

    const handleAddressChange = (e) => {
        // this.setState({ address: e.target.value });
        setAddress(e.target.value);
    }

    const handleCityChange = (e) => {
        // this.setState({ city: e.target.value });
        setCity(e.target.value);
    }

    const handleStateChange = (e) => {
        // this.setState({ state: e.target.value });
        setState(e.target.value);
    }

    const onProfileSave = async () => {

        console.log("details saved!")
        console.log(username)
        console.log(emailaddress)
        console.log(contact)
        console.log(address)
        console.log(city)
        console.log(state)

        // contract call
        // to update the details!

        await saveProfileDetails();

    }

    const goToDashboard = async () => {
        console.log('go to dashboard');

    }

    const ProfileForm = (
        <React.Fragment>
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <TextField
                required
                id="name"
                name="name"
                label="Full Name"
                fullWidth
                autoComplete="full-name"
                value={username}
                onChange={handleUsernameChange}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                id="email"
                name="email"
                label="Email Address"
                fullWidth
                autoComplete="email-address"
                value={emailaddress}
                onChange={handleEmailChange}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                id="contact"
                name="contact"
                label="Contact Number"
                fullWidth
                autoComplete="contact-number"
                value={contact}
                onChange={handleContactChange}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                required
                id="address"
                name="address"
                label="Address line"
                fullWidth
                autoComplete="address-line"
                value={address}
                onChange={handleAddressChange}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                id="city"
                name="city"
                label="City"
                fullWidth
                autoComplete="city"
                value={city}
                onChange={handleCityChange}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                id="state"
                name="state"
                label="State/Province/Region"
                fullWidth
                autoComplete="state"
                value={state}
                onChange={handleStateChange}
            />
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onProfileSave}
            >
                Save
            </Button>
        </Grid>
        </React.Fragment>
    )


    const isUpdatedMessage = () => {
        if (isProfileUpdated) {
            return (
                <div><h3>Profile updated!</h3></div>
            )
        } else {
            return (
                <div></div>
            )
        }
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
                return(
                    
                    <React.Fragment>
                        <CssBaseline />
                        <AppBar position="absolute" color="default" className={classes.appBar}>
                            <Toolbar>
                            <Typography variant="h6" color="inherit" noWrap>
                                DRentforcement
                            </Typography>
                            </Toolbar>
                        </AppBar>

                        <React.Fragment>
                        <main className={classes.layout}>
                            <Paper className={classes.paper}>
                                <Typography component="h1" variant="h4" align="center">
                                    Profile
                                </Typography>

                                <React.Fragment>
                                    {ProfileForm}
                                </React.Fragment>                            
                            </Paper>
                        </main>
                        </React.Fragment>

                        <React.Fragment>
                            <Container maxWidth="sm">
                            <div className={classes.heroContent}>
                                <div className={classes.heroButtons}>
                                <Grid container spacing={2} justify="center">
                                    <Grid item>
                                        <RouterLink to='/'>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            component={RouterLink}
                                            to={'/'}
                                        >
                                            Go to Dashboard
                                        </Button>
                                        </RouterLink>
                                    </Grid>
                                    <Grid item>
                                        <RouterLink to='/add'>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            component={RouterLink}
                                            to={'/add'}
                                        >
                                            Get started! Add a new product
                                        </Button>
                                        </RouterLink>
                                    </Grid>
                                </Grid>
                                </div>
                            </div>
                            </Container>
                        </React.Fragment>

                    </React.Fragment>

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

export default Profile