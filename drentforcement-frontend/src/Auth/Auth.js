import React, { Component } from 'react';
// import Web3 from 'web3';
// import Button from '@material-ui/core/Button';
// import { address, abi } from '../contractArtifacts';
import './Auth.css';

class Auth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dummyVar: true,
        }
    }

    render() {

        const { dummyVar } = this.state;

        var script;
        if (dummyVar) {
            script = <h2>Hello</h2>
        } else {
            script = <h2>Bye</h2>
        }

        return (
            <div>
                <p>Hello auth!</p>
                {script}
            </div>
        )
    }

}

export default Auth