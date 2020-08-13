# D-Rentforcement

> Date: 10 August - 2020 (Monday) Meeting Reports (5.30 PM)

## Things to discuss

a. Tech

1. Decide the frontend stack and some suggestions for UI: Finalize designs

2. Get familiar with smart contracts and solidity

b. General

1. Authentication
    - Authentication in Smart Contracts :How to do that? JWT or not?
    - Suggestions: Use mapping in contract for userid and user object. What for token handling?
2. Basic Functions
    - Basic renting functions.
    - Discuss about user hierchy: Both at same level
    - Renting terms and details needed.
    - Dashboard details and other things.

3. Decisions taken
    - Common Login for every type of user
    - Identity proof for user? Aadhar Validation? Phone validation? Search and ask to mentors.
    - Look about image storage in solidity and blockchain.
    - Common dashboard for both users if not logged in.
    - Products of user is not to be shown to user iteself.
    - Seperate form for product addition.

4. Tasks Distributed
    - Meet, Param, Arpan: Webpage design
    - Meet: Aadhar/OTP API in JavaScript
    - Param, Arpan: Go through Web3 in JS and linking with Metamask and contracts.
    - Shyam, Manav: Start developing contracts for User Model (Login and other details)

5. Important Links

    - [Connecting Web3 with Metamask](https://medium.com/@awantoch/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a)

    - [UI/UX Guide for DAPPS and best practices](https://rimble.consensys.design/guides/ux)

## Updates in next meeting

1. Design updates
2. Web3 interaction
3. Contracts
4. What about price? In ether or INR?
5. Will user set price or platform will?
6. Product addition details required?

> Date: 13 August - 2020 (Thursday) (Things to keep in mind in dapp)

1. Confirm the date/day object in solidity.
2. Search about the reducing the storage size of array (in case of non active product).
3. How to deactivate a product after enddate is reached?
4. Decide which functions will be ownable and what kind of modifiers would be required?
