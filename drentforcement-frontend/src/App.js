import React, { Component } from 'react';
import Web3 from 'web3';
import { address, abi } from './contractArtifacts';
import './App.css';

// this function detects most providers injected at window.ethereum
import detectEthereumProvider from '@metamask/detect-provider';

var userAccount = undefined;
var web3 = undefined;

class App extends Component {

  state = {
    loading: false  // loading button state
  };

  handleClick = async () => { 
    const provider = await detectEthereumProvider();

    if (provider) {
      this.fetchWalletDetails(provider);
    } else {
      window.alert('Please install MetaMask!');
      return;
    }
  }

  async fetchWalletDetails(provider) {

    if (provider !== window.ethereum) {
      alert('Multiple wallets are installed!');
    } else {
      console.log('Single account!');
      try {
        // allowing user to connect and fetch accounts
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        this.setState({ loading: true });

      } catch (error) {
        // the case if user denies account access
        alert('Please create / select a wallet account to proceed further!');
      }
    }
  }

  fetchNumber = async () => {

    try {
      const provider = await detectEthereumProvider();
      web3 = new Web3(provider);
      
      var rentforcementContract = new web3.eth.Contract(abi, address);
      try {
        const result = await rentforcementContract.methods.getDummy().call();  
        console.log('Number Fetched: ' + result);
      } catch (error) {
        console.log('error: ' + error)
        window.alert('Error in calling contract function!')
        return;
      }

    } catch (error) {
      console.log('error: ' + error);
      window.alert('Error in fetching provider!')
      return;
    }
    
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="App">
        <p>For performing this operation, you need to Connect your Metamask Wallet!</p>
        <button className="metamask-login-button" onClick={this.handleClick}>
          {loading ? `Connected ${userAccount}` : 'Login with metamask'}
        </button>

        <button className="fetch-number-button" onClick={this.fetchNumber}>
          {loading ? `Fetch Number` : `Disabled`}
        </button>

      </div>
    )
  }

}

export default App;