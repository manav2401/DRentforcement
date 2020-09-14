import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { Link as RouterLink } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';

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
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { ContractAddress, abi } from '../../contractArtifacts';

var web3 = undefined;
var userAccount = undefined;
var rentforcementContract = undefined;
var fetchedOwner = undefined;

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

export default function Checkout(props) {

    const classes = useStyles();

    const [productId, setProductId] = useState(props.location.id);
    // const [rentforcementContract, setRentforcementContract] = useState(props.location.instance);
    const [startDate, setStartDate] = useState(props.location.startDate);
    const [endDate, setEndDate] = useState(props.location.endDate);
    const [isValid, setIsValid] = useState(productId == undefined ? false : true);
    const [isOrderPlaced, setIsOrderPlaced] = useState(-1);

    // console.log('product id in checkout: ' + productId);
    // console.log('start date in checkout: ' + startDate);
    // console.log('end date in checkout: ' + endDate);
    // console.log(typeof startDate);

    const [product, setProduct] = useState(null);
    const [owner, setOwner] = useState(null);
    // const [is]

    useEffect(() => {

        let isMounted = true;

        async function temp() {
            if (isMounted) {
                if (isValid) {
                    console.log('Valid in checkout');

                    try {
                        var provider = await detectEthereumProvider();
                        web3 = new Web3(provider);
                        var accounts = await provider.request({ method: 'eth_requestAccounts' });
                        accounts = await web3.eth.getAccounts();
                        userAccount = accounts[0];
                
                        rentforcementContract = new web3.eth.Contract(
                            abi,
                            ContractAddress,
                            { gasPrice: '20000000000', from: userAccount }
                        );    
                    } catch(err) {
                        console.log('Error in instantiating contract: ' + err);
                    }
            
            

                    // fetch all product details over here
                    try {
                        var fetchedPrd = await rentforcementContract.methods.fetchProductFromId(productId).call();
                        if (fetchedPrd != undefined || fetchedPrd != null) {
                            console.log(fetchedPrd);
                            setProduct(fetchedPrd);
                        } else {
                            console.log('error in fetching product');
                            // setIsValid(false);
                        }
                    } catch (err) {
                        console.log('error in fetching products');
                        // setIsValid(false); 
                    }


                } else {
                    console.log('Invalid in checkout!');
                }
            }    
        }

        temp();

        return() => { isMounted = false };

    }, []);

    const placeOrder = async () => {

        // call contract here!
        var result = false;
        var numberOfDays = (Math.ceil(Math.abs((endDate.getTime() - startDate.getTime() + 86400000) / (1000*3600*24))))
        var priceToPay = (numberOfDays*product.productPrice)/(Math.pow(10, 18));
        var priceInWei = +(web3.utils.toWei(priceToPay.toString(), 'ether'));
        try {
            result = await rentforcementContract.methods.placeOrder(
                productId,
                parseInt(startDate.getTime() / 1000),
                numberOfDays
            ).send(
                {value: priceInWei}
            );

        } catch (err) {
            console.log('error in placing order: ' + err);
        }

        if (result) {
            setIsOrderPlaced(1);
            console.log('payment done! order placed!');

            // fetch all user details!
            console.log('id passed: ' + product.productId);
            try {
                fetchedOwner = await rentforcementContract.methods.fetchProductFromId(productId).call();
                if (fetchedOwner != undefined || fetchedOwner != null) {
                    setOwner(fetchedOwner);
                }
                console.log('Owner fetched!');
                console.log(fetchedOwner);
                console.log(owner);
            } catch(err) {
                console.log('error in fetching owner details!');
            }

        } else {
            setIsOrderPlaced(0);
            console.log('error in placing order!');
        }

    }

    if (isValid) {
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

                        <React.Fragment>
                        {
                            isOrderPlaced == 1
                            ?
                            
                                owner == null
                                ?
                                <div>
                                <Typography component="h1" variant="h6" align="center">
                                    Unable to fetch user profile!
                                </Typography>
                                </div>
                                :
                                <div>
                                <Typography component="h1" variant="h5" align="center">
                                    Congratulations! Your Order has been placed!
                                </Typography>
                                
                                <div style={{'paddingTop': '1cm'}}>
                                <Typography component="h1" variant="h6" align="left">
                                    Here are the details of the owner of the product!
                                    <br></br>
                                    Name: {fetchedOwner.userName}
                                    <br></br>
                                    Email Address: {fetchedOwner.userEmail}
                                    <br></br>
                                    Contact Number: {fetchedOwner.userPhone}
                                    <br></br>
                                    Address: {fetchedOwner.userAddress}
                                    <br></br>
                                    City: {fetchedOwner.userAddress}
                                    <br></br>
                                    State: {fetchedOwner.userState}
                                </Typography>
                                </div>

                                <div style={{'paddingTop': '1cm'}}>
                                    <RouterLink to='/'>
                                    <Button variant="outlined" color="primary" component={RouterLink} to={'/'}>
                                        Dashboard
                                    </Button>
                                    </RouterLink>
                                </div>

                                </div>
                                

                            :
                                product == null
                                ?
                                <Typography></Typography>
                                :
                                <div>
                                <Typography component="h1" variant="h4" align="center">
                                    Checkout
                                </Typography>

                                <Typography component="h1" variant="h5" align="center">
                                    Review your order
                                </Typography>
                                <div style={{'paddingTop': '1cm'}}>
                                <Typography component="h1" variant="h6" align="left">
                                    Product Name: {product.productName}
                                    <br></br>
                                    Description: {product.productDesc}
                                    <br></br>
                                    Price per day (in ETH): {product.productPrice / Math.pow(10, 18)}
                                    <br></br>
                                    Start Date: {startDate.getDate()}/{startDate.getMonth()}/{startDate.getFullYear()}
                                    <br></br>
                                    End Date: {endDate.getDate()}/{endDate.getMonth()}/{endDate.getFullYear()}
                                    <br></br>
                                    Total price: {((Math.ceil(Math.abs((endDate.getTime() - startDate.getTime() + 86400000) / (1000*3600*24))))*product.productPrice)/(Math.pow(10, 18))} + Gas Price
                                </Typography>
                                                    
                                {
                                    isOrderPlaced == -1
                                    ?
                                    <div>
                                    <Button 
                                        type="submit"
                                        variant="outlined"
                                        color="primary"
                                        className={classes.submit}
                                        onClick={placeOrder}
                                    >
                                        Place Order
                                    </Button>
                                    </div>
                                    :
                                    <div style={{'paddingTop': '1cm'}}>
                                    <Typography component="h1" variant="h6" align="center">
                                        There is some error in placing order. Please try again after some time.
                                    </Typography>
                                    </div>
                                }
                                </div>
                                </div>
                        }

                        </React.Fragment>                            
                    </Paper>
                </main>
                </React.Fragment>

                {/*
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
                                {
                                isAvailable == 1 
                                ? 
                                <RouterLink to={{
                                    pathname: '/checkout',
                                    state: productId, startDate, endDate
                                }}>
                                <Button 
                                    variant="outlined"
                                    color="primary"
                                    component={RouterLink}
                                    to={'/checkout'}
                                >
                                    Proceed
                                </Button>
                                </RouterLink>
                                :
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
                                }
                            </Grid>
                        </Grid>
                        </div>
                    </div>
                    </Container>
                </React.Fragment>
                            */}

            </React.Fragment>
        )
    } else {
        return(
            <div>
                <React.Fragment>
                    <Typography component="h1" variant="h5" align="center">
                        Sorry, there is an error fetching the product! Please visit dashboard!
                    </Typography>
                </React.Fragment>
            </div>
        )
    }

}