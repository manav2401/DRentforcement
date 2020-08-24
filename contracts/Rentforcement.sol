// SPDX-License-Identifier: MIT

/**
 * DRentforcement
 * A Decentralized C2C Renting Platform
 * Contract for basic renting functions
 */

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract Rentforcement {

    // dummy variable
    uint dummy = 0;

    // user structure
    struct User {

        string userName;
        string userEmail;
        string userPhone;
        string userAddress;
        string userCity;
        string userState;
        bool isValid;
        
    }

    // Product structure
    struct Product {
        string productName;         // name of product
        string productDesc;         // product description
        uint256 productPrice;       // price of product per day in wei (1 ether = 10^18 wei)
        address productOwner;       // Owner of the product
        uint32 lastDateAvailable;   // storing the last date until which the product is available
        bool isAvailableNow;        // Is product available now i.e. is product active
        bool[] isAvailable;         // Array containing per day availability of product
    }

    uint256 public productId;
    uint256 public userId;

    // mapping of userid with useraddress
    mapping(uint256 => address) public userAddress;

    // mapping of address with user object
    mapping(address => User) public users;

    // mapping of productid with product object
    mapping(uint256 => Product) public products;

    // mapping of user address with product count
    mapping(address => uint32) public userProductCount;

    // Add emit events here

    /**
     * Function to add new users
     * INPUT PARAMS
     * string userName;
     * string userEmail;
     * string userPhone;
     * string userAddress;
     * string userCity;
     * string userState;
     */
     function createNewUser(
         string memory _userName,
         string memory _userEmail,
         string memory _userPhone,
         string memory _userAddress,
         string memory _userCity,
         string memory _userState
     ) public returns(bool) {

        // creating an object
        User memory _user = User(
            _userName, _userEmail, _userPhone, _userAddress, _userCity, _userState, true
        );

         // saving to mapping
        userAddress[userId] = msg.sender;
        users[msg.sender] = _user;
        

        // emit event here

        // increment the user count
        userId += 1;

     }


    /**
     * Function for adding product on rent
     * INPUT PARAMS
     * _productName: Name of product
     * _productDesc: Description of product
     * _numberOfDays: Number of days, product is available on rent
     * _perDayPrice: Per day price of product
     */
    function addProductOnRent(string memory _productName, string memory _productDesc, uint32 _numberOfDays, uint256 _perDayPrice) public returns(bool) {

        // calculating the enddate
        uint32 endDate = uint32(block.timestamp + _numberOfDays);

        // creating a object of product in memory
        Product memory product = Product(_productName, _productDesc, _perDayPrice, msg.sender, endDate, true, new bool[](_numberOfDays));

        // add object to permanant storage
        products[productId] = product;

        // increment count to product count mapping
        userProductCount[msg.sender] += 1;

        // emit event here

        // Incrementing the product ID
        productId += 1;

    }

    // Modifier to check whether product on rent is active or not
    modifier isProductActive(bool _isAvailableNow) {
        require(_isAvailableNow);
        _;
    }

    // Another Modifier to check whether product has expired or not

    /**
     * Function to edit product on rent
     * Can only be done by Owner
     * Uses modifier isProductActive
     * INPUT PARAMS
     * _id: The ID of product
     * _updatedName: Updated name of product
     * _updatedDesc: Updated description of product
     * _updatedNumberOfDays: Updated number of days, product is available on rent
     * _updatedPerDayPrice: Updated Per day price of product
     */
    function editProductOnRent(uint256 _id, string memory _updatedName, string memory _updatedDesc, uint32 _updatedNumberOfDays, uint256 _updatedPerDayPrice) external isProductActive(products[_id].isAvailableNow) {

        // Assert that property is only edited by owner and not by any external contract
        require(
            products[_id].productOwner == msg.sender,
            "you don't have edit access"
        );

        // Calculate the new enddate
        uint32 endDate = uint32(block.timestamp + _updatedNumberOfDays);

        // Assert that number of days are not reduced
        require(
            endDate < products[_id].lastDateAvailable,
            "sorry, you can't decrease the available days on rent"
        );

        // Make new memory array for storing 
        bool[] memory newIsAvailable = new bool[](_updatedNumberOfDays);
        for (uint32 i=0; i<products[_id].isAvailable.length; i++) {
            newIsAvailable[i] = products[_id].isAvailable[i];
        }

        // update product instance
        products[_id].productName = _updatedName;
        products[_id].productDesc = _updatedDesc;
        products[_id].productPrice = _updatedPerDayPrice;
        products[_id].lastDateAvailable = endDate;
        products[_id].isAvailable = newIsAvailable;

    }

    // Function to borrow product here

    /**
     * Function to fetch all products here
     * Used in dashboard
     * Checks whether product is active or not
     */
    function fetchAllProducts() external view returns(Product[] memory) {

        // Declaring a new array in memory (nothing is stored in storage)
        // No gas used for external view function
        Product[] memory allProducts = new Product[](productId);
        uint256 counter = 0;

        // iterating over the product mapping
        for (uint256 i=0; i<productId; i++) {
            
            // Only add those products which are available
            if (products[i].isAvailableNow == true) {
                
                // adding the specific product to array
                allProducts[counter] = products[i];
                counter += 1;
            }
        }

        return allProducts;

    }

    /**
     * Function to fetch owned products
     * Used in dashboard
     * Returns products which are owned by user calling the function
     */
    function fetchMyProducts() external view returns(Product[] memory) {

        require(
            userProductCount[msg.sender] > 0,
            "you don't have any product"
        );

        // Declaring a new array in memory (nothing is stored in storage)
        // No gas used for external view function
        Product[] memory myProducts = new Product[](userProductCount[msg.sender]);
        uint256 counter = 0;

        // iterating over the product mapping
        for (uint256 i=0; i<productId; i++) {
            
            // checking owner
            if (products[i].productOwner == msg.sender) {
                
                // adding the specific product to array
                myProducts[counter] = products[i];
                counter += 1;
            }
        }

        return myProducts;

    }

    // function to check whether user exists or not
    function checkIfUserExists() external view returns(bool) {
        if (keccak256(abi.encodePacked(users[msg.sender].userName)) == keccak256(abi.encodePacked(""))) {
            return false;
        } else {
            return true;
        }
    }

    // fetch all users
    function fetchAllUsers() external view returns(User[] memory) {
        User[] memory allUsers = new User[](userId);
        uint256 counter = 0;

        for (uint256 i=0; i<userId; i++) {
            allUsers[counter] = users[userAddress[i]];
            counter += 1;
        }
        return allUsers;
    }

    

    /**
     * Dummy function for testing
     */
     function getDummy() external view returns(uint) {
         return dummy;
     }

     function setDummy(uint x) external {
         dummy = x;
     }
}