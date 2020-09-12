import React, { useState, useEffect } from 'react';
import {Redirect, Link as RouterLink } from 'react-router-dom';

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
import './ProductAdd.css';

var sigUtil = require('eth-sig-util')
var ethUtil = require('ethereumjs-util');
var web3 = undefined;
var userAccount = undefined;
var rentforcementContract = undefined;
var uploadImage = undefined;
var convertBase64 = undefined;
var flag = false;

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

function ProductAdd(props) {

    const classes = useStyles();

    const [isAuth, setIsAuth] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
    const [isUserProfileComplete, setIsUserProfileComplete] = useState(true);
    const [toRedirect, setToRedirect] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productNumberOfDays, setProductNumberOfDays] = useState('');
    const [isProductAdded, setIsProductAdded] = useState(false);

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        console.log('image uploaded: ' + base64);
        // this.setState({ productImage: base64 });
        setProductImage(base64);
    };
    
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
    
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
    
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    useEffect(() => {

        async function preChecks() {
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
                            { gasPrice: '20000000000', from: userAccount }
                        );

                        try {
                            var result = await rentforcementContract.methods.checkIfUserExists().call();
                            console.log('Account fetched(yes/no): ' + result);
                            flag = true;
                            if (!result) {
                                // redirect user to profile page
                                // for validation
                                // and profile completion
                                // this.setState({ isAuth: false });
                                // this.setState({ isUserProfileComplete: false });
                                setIsAuth(false);
                                setIsUserProfileComplete(false);
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

                                    // check if profile is complete
                                    // if yes, proceed with addition
                                    // if no, redirect to profile

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

                                    if (isProfileComplete) {
                                        // continue with product add form!
                                        // this.setState({ isUserProfileComplete: true });
                                        setIsUserProfileComplete(true);
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
        }

        preChecks();

    }, [flag]);

    const addNewProduct = async () => {

        // contract call
        // for product addition/updation here

        if (rentforcementContract) {

            try {

                const price = productPrice;
                var priceInWei = +(web3.utils.toWei(price, 'ether'));
                const numOfDays = +(productNumberOfDays) >>> 0;

                var productAdded = await rentforcementContract.methods.addProductOnRent(
                    productName,
                    productDesc,
                    numOfDays,
                    priceInWei,
                    productImage
                ).send();

                console.log('Is product added: ' + productAdded);

                if (productAdded) {
                    // this.setState({ isProductAdded: true });
                    setIsProductAdded(true);
                    window.alert('Product added successfully!');
                } else {
                    // not gonna happen! (contract always returns true)
                    // still
                    // this.setState({ isProductAdded: false });
                    setIsProductAdded(false);

                }

            } catch (error) {
                // error in saving!
                console.log('error: ' + error);
                console.log('Error in calling product add function!');
                setIsProductAdded(false);
                // this.setState({ isProfileUpdated: false });
            }

        } else {
            // undefined!
            console.log('Contract instance undefined!');
        }

    }

    const handleProductNameChange = (e) => {
        // this.setState({ productName: e.target.value });
        setProductName(e.target.value);
    }

    const handleProductDescChange = (e) => {
        // this.setState({ productDesc: e.target.value });
        setProductDesc(e.target.value);
    }

    const handleProductPriceChange = (e) => {
        // this.setState({ productPrice: e.target.value });
        setProductPrice(e.target.value);
    }

    const handleProductNumberOfDaysChange = (e) => {
        // this.setState({ productNumberOfDays: e.target.value });
        setProductNumberOfDays(e.target.value);
    }

    const onProductAdd = async () => {

        console.log("details saved!")
        console.log(productName)
        console.log(productDesc)
        console.log(productPrice)
        console.log(productNumberOfDays)
        console.log(productImage)

        // update details here
        await addNewProduct();

    }

    const ProductForm = (
        <React.Fragment>
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <TextField
                required
                id="name"
                name="name"
                label="Product Name"
                fullWidth
                autoComplete="product-name"
                value={productName}
                onChange={handleProductNameChange}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                required
                id="desc"
                name="desc"
                label="Product Description"
                fullWidth
                autoComplete="product-description"
                value={productDesc}
                onChange={handleProductDescChange}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                id="price"
                name="price"
                label="Per Day Price (in ETH)"
                fullWidth
                autoComplete="price-in-eth"
                value={productPrice}
                onChange={handleProductPriceChange}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                id="number-of-days"
                name="number-of-days"
                label="Number of Days Available"
                fullWidth
                autoComplete="number-of-days"
                value={productNumberOfDays}
                onChange={handleProductNumberOfDaysChange}
            />
            </Grid>

            <Grid item xs={12} sm={6}>
                <div style={{'paddingTop': '1cm'}}>
                    Choose an image of product
                </div>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div style={{'paddingTop': '1cm'}}>
                <input
                        type="file"
                        onChange={(e) => {uploadImage(e);}}
                        // style={{'paddingTop': '1cm'}}
                    />

                </div>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onProductAdd}
            >
                Save
            </Button>
        </Grid>
        </React.Fragment>
    )

    if (isMetamaskInstalled) {
        if (isValid) {
            if (isAuth && isUserProfileComplete) {
                    return (

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
                                    Rent @ rentforcementContract
                                </Typography>

                                <Typography component="h1" variant="h6" align="center">
                                    (Note: Product will be on rent from this instant)
                                </Typography>

                                <React.Fragment>
                                    <div style={{'paddingTop': '1cm'}}>
                                        {ProductForm}
                                    </div>
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
                                            to={'/'}
                                        >
                                            View your products
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

            } else {
                return (
                    <Redirect to='/profile'/>
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

export default ProductAdd