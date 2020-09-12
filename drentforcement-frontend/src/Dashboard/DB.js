// imports
import React, { useState, useEffect } from 'react';
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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const cards2 = [
    {"index": 1, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 2, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 3, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 4, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 5, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
    {"index": 6, "link": "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"},
]

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    buttons: {
        alignItems: 'center',
    }
}));

function DB(props) {

    const classes = useStyles();

    const [isAuth, setIsAuth] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
    const [isUserProfileComplete, setIsUserProfileComplete] = useState(true);
    const [products, setProducts] = useState([]);

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

    useEffect(async () => {
        
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
                                // this.setState({ isAuth: false });
                                // this.setState({ isUserProfileComplete: false })
                                setIsAuth(false);
                                setIsUserProfileComplete(false);

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
                        window.alert('Error in calling contract function!');
                        return;
                    }

                    // if auth is true
                    if (isAuth) {

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
                                    // this.setState({ isUserProfileComplete: true });
                                    setIsUserProfileComplete(true);

                                    // fetch products
                                    await fetchAllProducts();

                                } else {
                                    // redirect to profile
                                    // this.setState({ isUserProfileComplete: false });
                                    setIsUserProfileComplete(false);
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
            // this.setState({ isMetamaskInstalled: false });
            setIsMetamaskInstalled(false);
            window.alert('Please install MetaMask!');
            return;
        }
    }, []);

    const fetchAllProducts = async () => {
        if (rentforcementContract) {

            try {

                var fetchedProducts = await rentforcementContract.methods.fetchRemainingProducts().call();
                console.log("Products fetched: " + fetchedProducts);
                // this.setState({ products: fetchedProducts })
                setProducts(fetchedProducts);

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

    const TopBar = (
        <AppBar position="relative">
            <Toolbar>
                <Typography variant="h6" color="inherit" noWrap>
                    D-Rentforcement
                </Typography>
            </Toolbar>
        </AppBar>
    )

    const Body = (
        <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                D-Rentforcement
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                A Decentralized C2C Renting Platform!
            </Typography>

            {/* buttons to be added here */}
            {/* <div className={classes.heroButtons}> */}
            {/* <Grid container spacing={2} justify="center"> */}
            {/* <Grid item> */}
            {/* <Button variant="contained" color="primary"> */}
            {/* Main call to action */}
            {/* </Button> */}
            {/* </Grid> */}
            {/* <Grid item> */}
            {/* <Button variant="outlined" color="primary"> */}
            {/* Secondary action */}
            {/* </Button> */}
            {/* </Grid> */}
            {/* </Grid> */}
            {/* </div> */}

        </Container>
    )

    const Footer = (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )


    if (isMetamaskInstalled) {
        if (isValid) {
            if (isUserProfileComplete) {
                return (
                    <React.Fragment>
                    <CssBaseline />
                    {TopBar}
                    <main>
                        <div className={classes.heroContent}>
                            {Body}
                        </div>
                        <Container className={classes.cardGrid} maxWidth="md">
                        <Grid container spacing={4}>
                        {cards2.map((card) => (
                            <Grid item key={card.index} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={card.link}
                                        title="Image title"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Product
                                        </Typography>
                                        <Typography>
                                            Product Description
                                        </Typography>
                                    </CardContent>
                                    
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            Borrow
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}        
                        </Grid>
                        </Container>
                    </main>
                    <footer className={classes.footer}>
                        {Footer}
                    </footer>
                    </React.Fragment>
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

export default DB