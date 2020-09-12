// import React, { useState, useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Paper from '@material-ui/core/Paper';
// import Link from '@material-ui/core/Link';
// import ProfileForm from './ProfileForm';

// const useStyles = makeStyles((theme) => ({
//     appBar: {
//         position: 'relative',
//     },
//     layout: {
//         width: 'auto',
//         marginLeft: theme.spacing(2),
//         marginRight: theme.spacing(2),
//         [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
//             width: 600,
//             marginLeft: 'auto',
//             marginRight: 'auto',
//         },
//     },
//     paper: {
//         marginTop: theme.spacing(3),
//         marginBottom: theme.spacing(3),
//         padding: theme.spacing(2),
//         [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
//             marginTop: theme.spacing(6),
//             marginBottom: theme.spacing(6),
//             padding: theme.spacing(3),
//         },
//     },
//     stepper: {
//         padding: theme.spacing(3, 0, 5),
//     },
//     buttons: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//     },
//     button: {
//         marginTop: theme.spacing(3),
//         marginLeft: theme.spacing(1),
//     },
// }));

// function Test(props) {

//     const classes = useStyles();

//     const Footer = (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://material-ui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     )

//     return (
//         <React.Fragment>
//         <CssBaseline />
//         <AppBar position="absolute" color="default" className={classes.appBar}>
//             <Toolbar>
//             <Typography variant="h6" color="inherit" noWrap>
//                 Company name
//             </Typography>
//             </Toolbar>
//         </AppBar>

//         <React.Fragment>

//         <main className={classes.layout}>
//             <Paper className={classes.paper}>
//             <Typography component="h1" variant="h4" align="center">
//                 Checkout
//             </Typography>

//             <React.Fragment>
//                 {ProfileForm}
//                 {/* Hello */}
//             </React.Fragment>
//             </Paper>

//             {Footer}
//         </main>

//         </React.Fragment>
//     </React.Fragment>

//     )
// }

// export default Test