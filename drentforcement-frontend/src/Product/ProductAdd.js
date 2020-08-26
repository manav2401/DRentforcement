import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import Web3 from 'web3';
// import Button from '@material-ui/core/Button';
// import { address, abi } from '../contractArtifacts';
import './ProductAdd.css';

class ProductAdd extends Component {

    render() {
        return (
            <div className="product-add">
                <h2>Rent @ Rentforcement</h2>
                <h3>Just fill in some basic info and you're good to go!</h3>

                <div className="product-add-form" autoComplete="off">
                    <TextField id="standard-basic" label="Product Name"/>
                    <br></br><br></br>
                    <TextField id="standard-basic" label="Product Description" multiline rowsMax={4}/>
                    <br></br><br></br>
                    <TextField id="standard-basic" label="Per Day Price of Product in Ethers" />
                    <br></br><br></br>
                    <TextField id="standard-basic" label="Number of days available" />
                    <br></br><br></br>
                    <TextField id="standard-basic" label="Product Name" />
                </div>

                <div className="add-note">
                    <h3>Kindly note that your product will be available on rent, from this time onwards!</h3>
                </div>

            </div>
        )
    }

}

export default ProductAdd