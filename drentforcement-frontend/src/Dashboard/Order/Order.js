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

export default function Order(props) {

    const classes = useStyles();

    const [productId, setProductId] = useState(props.location.id);
    const [rentforcementContract, setRentforcementContract] = useState(props.location.instance)
    const [isValid, setIsValid] = useState(productId == undefined ? false : true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isAvailable, setIsAvailable] = useState(-1);

    console.log('product id: ' + productId);

    useEffect(() => {

        let isMounted = true;

        async function temp() {
            if (isMounted) {
                if (isValid) {
                    console.log('Valid');

                } else {
                    console.log('Invalid!');
                }
            }    
        }

        temp();

        return() => { isMounted = false };

    }, []);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    }

    const handleEndDateChange = (date) => {
        setEndDate(date);
    }

    const onCheckClick = async () => {

        var stDate = new Date(startDate);
        var eDate = new Date(endDate);
        console.log('start date: ' + stDate);
        console.log('end date: ' + eDate);
        setStartDate(stDate);
        setEndDate(eDate);
        var numberOfDays = (Math.ceil(Math.abs((eDate.getTime() - stDate.getTime() + 86400000) / (1000*3600*24))))

        // instantiate contract
        /*
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
        }*/

        var result = false;
        try {
            var result = await rentforcementContract.methods.checkAvailability(
                productId,
                parseInt(stDate.getTime() / 1000),
                numberOfDays
            ).call();
            console.log('result: ' + result);    
        } catch (err) {
            console.log('Error in calling function! ' + err);
        }

        if (result) {
            // available
            setIsAvailable(1);

        } else {
            // not available
            setIsAvailable(0);
        }

    }

    const AvailabilityForm = (
        <React.Fragment>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Select Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Select End Date"
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
            </Grid>
        </Grid>
        </MuiPickersUtilsProvider>
        </React.Fragment>
    )

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
                        <Typography component="h1" variant="h5" align="center">
                            Check availability of product
                        </Typography>

                        <React.Fragment>
                            {AvailabilityForm}
                            
                            <div style={{'paddingTop': '1cm'}}>
                            <Button 
                                type="submit"
                                variant="outlined"
                                color="primary"
                                className={classes.submit}
                                onClick={onCheckClick}
                            >
                                Check Availability
                            </Button>
                            </div>


                            {isAvailable == 1 
                                ?<Typography>
                                    The product is available for the given time range. Please click on proceed for booking!
                                </Typography>
                            :isAvailable == 0 
                                ?<Typography>
                                    Sorry, the product is not available for the selected time range!
                                </Typography>
                            :<Typography></Typography>}

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
                                {
                                isAvailable == 1 
                                ? 
                                <RouterLink to={{
                                    pathname: '/checkout',
                                    id: productId, 
                                    startDate: startDate,
                                    endDate: endDate,
                                    instance: rentforcementContract
                                }}>
                                <Button 
                                    variant="outlined"
                                    color="primary"
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