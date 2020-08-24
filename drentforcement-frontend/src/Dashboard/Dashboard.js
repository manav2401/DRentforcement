// imports
import React, { Component } from 'react';
import Web3 from 'web3';
import Button from '@material-ui/core/Button';
import detectEthereumProvider from '@metamask/detect-provider';
import { Redirect } from 'react-router-dom';

// local imports
// import { address, abi } from '../contractArtifacts';
import './Dashboard.css';

// local variables
var web3 = undefined;
var userAccount = undefined;

class Dashboard extends React.Component {

    state = {
        isAuth: false,
        isValid: false,
        isMetamaskInstalled: false,
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
                console.log('Single account!');
                this.state({ isValid: true });
                var connected = provider.isConnected();
                if (connected) {
                    this.state({ isAuth: true });
                    // fetch accounts and perform actions
                } else {
                    this.state({ isAuth: false });
                    // redirect to another page
                }
            }
        
        } else {
            this.state({ isMetamaskInstalled: false });
            window.alert('Please install MetaMask!');
            return;
        }


    }

    render() {
        this.componentDidMount();
        const { isValid } = this.state;
        const { isAuth } = this.state;
        const { isMetamaskInstalled } = this.state;

        if (isMetamaskInstalled) {
            if (isValid) {
                if (!isAuth) {
                    return (
                        <div className="Dashboard">
                            {/* <Redirect to="/auth" /> */}
                            <h3>Redirect</h3>
                        </div>
                    )
                } else {
                    return (
                        <div className="Dashboard">
                            <h3>Welcome to D-rentforcement</h3>
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

}

export default Dashboard