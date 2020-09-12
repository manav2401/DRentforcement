import React, { Component } from 'react';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBTooltip, MDBCardFooter, MDBBtn, MDBIcon } from "mdbreact";
// import Web3 from 'web3';
// import { address, abi } from '../contractArtifacts';
import './Error.css';

export default function Error(props) {
    return (
        <div>
            <p>Error 404! Sorry, page not found!</p>
        </div>
    )
}
/*
componentDidMount() {
    var dt = new Date(2020, 8, 12, 0, 0, 0);
    var timestamp = dt.getTime();
    console.log('10 sept -> timestamp: ' + timestamp);

    // block.timestamp = 1599746264
    // start time of today : 1599696000
    var dt2 = new Date(timestamp);
    console.log('Date for same timestamp: ' + dt2.getDate() + '/' + (dt2.getMonth()+1) + '/' + dt2.getFullYear());
    console.log(dt2.getHours() + ':' + dt2.getMinutes() + ':' + dt2.getSeconds());

}*/