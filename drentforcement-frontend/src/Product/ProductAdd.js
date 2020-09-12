import React, { useState, useEffect } from 'react';
import {Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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

function ProductAdd(props) {

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
        const base64 = await this.convertBase64(file);
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

    }, []);

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
                this.setState({ isProfileUpdated: true });
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

    if (isMetamaskInstalled) {
        if (isValid) {
            if (isAuth && isUserProfileComplete) {
                    return (
                        <div className="product-add">
                            <h2>Rent @ Rentforcement</h2>
                            <h3>Just fill in some basic info and you're good to go!</h3>

                            <div className="product-add-form" autoComplete="off">
                                <TextField id="standard-basic" label="Product Name" value={productName} onChange={handleProductNameChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Product Description" multiline rowsMax={4} value={productDesc} onChange={handleProductDescChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Per Day Price (in ETH)" value={productPrice} onChange={handleProductPriceChange} />
                                <br></br><br></br>
                                <TextField id="standard-basic" label="Number of days available" value={productNumberOfDays} onChange={handleProductNumberOfDaysChange} />
                                <br></br><br></br>
                                <h3>Upload an image of product</h3>
                                <input type="file" onChange={(e) => {uploadImage(e);}}/>
                                <br></br><br></br>
                                {/* <img src={`${productImage}`} /> */}
                                <br></br>
                                <Button variant="contained" color="primary" onClick={onProductAdd}>
                                    Save
                                </Button>
                            </div>

                        </div>
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