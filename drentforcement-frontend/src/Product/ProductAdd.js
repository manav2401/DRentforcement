import React, { Component, useState } from 'react';
import {Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Web3 from 'web3';
import { address, abi } from '../contractArtifacts';
import detectEthereumProvider from '@metamask/detect-provider';
import './ProductAdd.css';

var sigUtil = require('eth-sig-util')
var ethUtil = require('ethereumjs-util');
var web3 = undefined;
var userAccount = undefined;
var rentforcementContract = undefined;
var uploadImage = undefined;
var convertBase64 = undefined;

class ProductAdd extends Component {

    constructor(props) {

        super(props);
        this.state = {
            isAuth: false,
            isValid: false,
            isMetamaskInstalled: false,
            toRedirect: false,
            productName: "",
            productDesc: "",
            productPrice: "",
            productImage: "",
            productNumberOfDays: "",
            isUserProfileComplete: true,
            isProductAdded: false,
        };

        this.handleProductNameChange = this.handleProductNameChange.bind(this);
        this.handleProductDescChange = this.handleProductDescChange.bind(this);
        this.handleProductPriceChange = this.handleProductPriceChange.bind(this);
        this.handleProductNumberOfDaysChange = this.handleProductNumberOfDaysChange.bind(this);
        this.onProductAdd = this.onProductAdd.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

    }

    async uploadImage(e) {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        console.log('image uploaded: ' + base64);
        this.setState({ productImage: base64 });
    };
    
    convertBase64 = (file) => {
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
                            // redirect user to profile page
                            // for validation
                            // and profile completion
                            this.setState({ isAuth: false });
                            this.setState({ isUserProfileComplete: false });                            
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

    async addNewProduct() {

        // contract call
        // for product addition/updation here

        if (rentforcementContract) {

            try {

                const price = this.state.productPrice;
                var priceInWei = +(web3.utils.toWei(price, 'ether'));
                const numOfDays = +(this.state.productNumberOfDays) >>> 0;

                var productAdded = await rentforcementContract.methods.addProductOnRent(
                    this.state.productName,
                    this.state.productDesc,
                    numOfDays,
                    priceInWei,
                    this.state.productImage
                ).send();

                console.log('Is product added: ' + productAdded);

                if (productAdded) {
                    this.setState({ isProductAdded: true });
                    window.alert('Product added successfully!');
                } else {
                    // not gonna happen! (contract always returns true)
                    // still
                    this.setState({ isProductAdded: false });

                }

            } catch (error) {
                // error in saving!
                console.log('error: ' + error);
                console.log('Error in calling product add function!');
                this.setState({ isProfileUpdated: true });
            }

        } else {
            // undefined!
            console.log('Contract instance undefined!');
        }

    }

    handleProductNameChange(e) {
        this.setState({ productName: e.target.value });
    }

    handleProductDescChange(e) {
        this.setState({ productDesc: e.target.value });
    }

    handleProductPriceChange(e) {
        this.setState({ productPrice: e.target.value });
    }

    handleProductNumberOfDaysChange(e) {
        this.setState({ productNumberOfDays: e.target.value });
    }

    async onProductAdd() {

        console.log("details saved!")
        console.log(this.state.productName)
        console.log(this.state.productDesc)
        console.log(this.state.productPrice)
        console.log(this.state.productNumberOfDays)
        console.log(this.state.productImage)

        // update details here
        await this.addNewProduct();

    }

    render() {

        const { isValid, isAuth, isMetamaskInstalled, isUserProfileComplete, isProductAdded, productImage } = this.state;

        var script;
        if (isProductAdded) {
            script = <h2>Product Added!</h2>
        } else {
            script = <h2></h2>
        }

        if (isMetamaskInstalled) {
            if (isValid) {

                // auth is already true in this case
                if (isUserProfileComplete) {
                    return (
                        <div className="product-add">
                            <h2>Rent @ Rentforcement</h2>
                            <h3>Just fill in some basic info and you're good to go!</h3>

                            <div className="product-add-form" autoComplete="off">
                                <TextField id="standard-basic" label="Product Name" value={this.state.productName} onChange={this.handleProductNameChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Product Description" multiline rowsMax={4} value={this.state.productDesc} onChange={this.handleProductDescChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Per Day Price of Product in Ethers" value={this.state.productPrice} onChange={this.handleProductPriceChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Number of days available" value={this.state.productNumberOfDays} onChange={this.handleProductNumberOfDaysChange} />
                                <br></br><br></br>
                                <h3>Upload an image of product</h3>
                                <input type="file" onChange={(e) => {this.uploadImage(e);}}/>
                                <br></br><br></br>
                                {/* <img src={`${productImage}`} /> */}
                                <br></br>
                                <Button variant="contained" color="primary" onClick={this.onProductAdd}>
                                    Save
                                </Button>
                            </div>

                            <div className="add-note">
                                <h3>Kindly note that your product will be available on rent, from this time onwards!</h3>
                            </div>

                            {script}

                        </div>
                    )
                } else {
                    return (
                        <Redirect to='/profile'/>
                        // <h2>Redirect</h2>
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

export default ProductAdd