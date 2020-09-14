// SPDX-License-Identifier: MIT

// DRentforcement
// A Decentralized C2C Renting Platform
// Contract for basic renting functions

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

// importing the library
import './BokkyPooBahsDateTimeLibrary.sol';

contract Rentforcement {

    // using the library for uint256/uint
    using BokkyPooBahsDateTimeLibrary for uint256;
    
    // NOTE FOR USING TIMESTAMPS
    // THE LIBRARY FOLLOWS ANOTHER TIMEZONE
    // HENCE, +5.30 HRS NEEDS TO BE DONE, BEFORE PASSING TIMESTAMP
    // ALSO, -5.30 HRS NEEDS TO BE DONE, AFTER RETREIVING TIMESTAMP
    
    uint256 constant TIME_PERIOD = 19800;

    // dummy variable
    uint256 dummy = 0;

    // user structure
    struct User {
        address userAccountAddress;
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
        uint256 productId;          // id of product
        string productName;         // name of product
        string productDesc;         // product description
        uint256 productPrice;       // price of product per day in wei (1 ether = 10^18 wei)
        string productImage;        // image of product
        address productOwner;       // Owner of the product
        uint256 productPeriod;      // number of days product is on rent
        uint256 lastDateAvailable;  // storing the last date until which the product is available
        bool isAvailableNow;        // Is product available now i.e. is product active
        bool[] isNotAvailable;      // Array containing per day availability of product
    }

    // order structure
    struct Order {
        uint256 productId;
        uint256 startDate;
        uint256 endDate;
        uint256 valuePaid;
        uint256 valueInDeposit;
        address user;
    }

    // ID's for product and user
    uint256 public productId;   // global id
    uint256 public userId;      // global id
    uint256 public orderId;     // global id

    // mapping of userid with useraddress
    mapping(uint256 => address) public userAddress;

    // mapping of address with user object
    mapping(address => User) public users;

    // mapping of productid with product object
    mapping(uint256 => Product) public products;

    // mapping of user address with product count
    mapping(address => uint32) public userProductCount;

    // mapping of order id to order object
    mapping(uint256 => Order) public orders;

    // Add emit events here

    // Function to add new users
    // INPUT PARAMS
    // string userName;
    // string userEmail;
    // string userPhone;
    // string userAddress;
    // string userCity;
    // string userState;

    function createNewUser(
        string memory _userName,
        string memory _userEmail,
        string memory _userPhone,
        string memory _userAddress,
        string memory _userCity,
        string memory _userState
    ) public returns (bool) {

        // creating an object
        User memory _user = User(
            msg.sender,
            _userName,
            _userEmail,
            _userPhone,
            _userAddress,
            _userCity,
            _userState,
            true
        );

        // saving to mapping
        userAddress[userId] = msg.sender;
        users[msg.sender] = _user;

        // emit event here

        // increment the user count
        userId += 1;
        return true;

    }

    // modifier for checking user validity
    modifier isUserValid(address userAdd) {
        require(users[userAdd].isValid);
        _;
    }

    // Function for updating user
    // INPUT Params: updated user fields
    function updateUser(
        string memory _userName,
        string memory _userEmail,
        string memory _userPhone,
        string memory _userAddress,
        string memory _userCity,
        string memory _userState
    ) external isUserValid(msg.sender) returns (bool) {

        address sender = msg.sender;
        require(
            users[sender].userAccountAddress == sender,
            "you don't have edit access!"
        );

        users[msg.sender].userName = _userName;
        users[msg.sender].userEmail = _userEmail;
        users[msg.sender].userPhone = _userPhone;
        users[msg.sender].userAddress = _userAddress;
        users[msg.sender].userCity = _userCity;
        users[msg.sender].userState = _userState;

        return true;
    }

    // Function for adding product on rent
    // INPUT PARAMS
    // _productName: Name of product
    // _productDesc: Description of product
    // _numberOfDays: Number of days, product is available on rent
    // _perDayPrice: Per day price of product
    function addProductOnRent(
        string memory _productName,
        string memory _productDesc,
        uint256 _numberOfDays,
        uint256 _perDayPrice,
        string memory _productImage
    ) public returns (bool) {

        // setting the startdate
        (uint256 year, uint256 month, uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(block.timestamp + TIME_PERIOD);
        uint256 startDate = BokkyPooBahsDateTimeLibrary.timestampFromDate(year, month, day);
        startDate = startDate - TIME_PERIOD;

        // calculating the enddate
        uint256 endDate = uint256(startDate + _numberOfDays * 1 days) - 1;

        // creating a object of product in memory
        Product memory product = Product(
            productId,
            _productName,
            _productDesc,
            _perDayPrice,
            _productImage,
            msg.sender,
            _numberOfDays,
            endDate,
            true,
            new bool[](_numberOfDays)
        );

        // add object to permanant storage
        products[productId] = product;

        // increment count to product count mapping
        userProductCount[msg.sender] += 1;

        // emit event here

        // Incrementing the product ID
        productId += 1;
        return true;

    }

    // Modifier to check whether product on rent is active or not
    modifier isProductActive(bool _isAvailableNow) {
        require(_isAvailableNow);
        _;
    }

    // Another Modifier to check whether product has expired or not

    // Function to edit product on rent
    // Can only be done by Owner
    // Uses modifier isProductActive
    // INPUT PARAMS
    // _id: The ID of product
    // _updatedName: Updated name of product
    // _updatedDesc: Updated description of product
    // _updatedNumberOfDays: Updated number of days, product is available on rent
    // _updatedPerDayPrice: Updated Per day price of product

/*
    function editProductOnRent(
        uint256 _id,
        string memory _updatedName,
        string memory _updatedDesc,
        uint256 _updatedNumberOfDays,
        uint256 _updatedPerDayPrice,
        string memory _updatedProductImage
    ) external isProductActive(products[_id].isAvailableNow) returns (bool) {

        // Assert that property is only edited by owner and not by any external contract
        require(
            products[_id].productOwner == msg.sender,
            "you don't have edit access"
        );

        // setting the startdate
        (uint256 year, uint256 month, uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(block.timestamp);
        uint256 startDate = BokkyPooBahsDateTimeLibrary.timestampFromDate(year, month, day);

        // calculating the enddate
        uint256 endDate = uint256(startDate + _updatedNumberOfDays * 1 days);

        // Assert that number of days are not reduced
        require(
            endDate < products[_id].lastDateAvailable,
            "sorry, you can't decrease the available days on rent"
        );

        // Make new memory array for storing
        bool[] memory newIsAvailable = new bool[](_updatedNumberOfDays);
        for (uint256 i = 0; i < products[_id].isAvailable.length; i++) {
            newIsAvailable[i] = products[_id].isAvailable[i];
        }

        // update product instance
        products[_id].productName = _updatedName;
        products[_id].productDesc = _updatedDesc;
        products[_id].productPrice = _updatedPerDayPrice;
        products[_id].productImage = _updatedProductImage;
        products[_id].productPeriod = _updatedNumberOfDays;
        products[_id].lastDateAvailable = endDate;
        products[_id].isAvailable = newIsAvailable;
        return true;
    }*/

    // Function to borrow product here
    // checks availability of product for given dates
    function checkAvailability(uint256 _id, uint256 startDate, uint256 numberOfDays) public view returns(bool) {

        // check whether current time is greater than last date available
        require(
            block.timestamp <= products[_id].lastDateAvailable,
            'Sorry, product no longer on rent!'
        );

        // calculate the enddate
        // start date in form of timestamp for beginning of day!
        uint256 endDate = uint256(startDate + numberOfDays * 1 days);

        // check whether enddate is greater than the last product available date
        require(
            endDate <= products[_id].lastDateAvailable,
            'Sorry, the product is not available in the given time range!'
        );

        // get start index for array!
        uint256 startIndex = getRentIndex(_id, startDate);

        // checking the boolean array
        for (uint256 i = startIndex; i < (startIndex + numberOfDays); i++) {
            
            // check if value is true or not
            if (products[_id].isNotAvailable[i] == true) {
                revert('Sorry, the product is not available for selected dates!');
            }

        }

        // if reached here, product is available
        return true;

    }

    function getRentIndex(uint256 _id, uint256 startDate) public view returns(uint256) {
        uint256 productStartDate = products[_id].lastDateAvailable + 1 - products[_id].productPeriod * 1 days;
        uint256 startIndex = BokkyPooBahsDateTimeLibrary.diffDays(productStartDate, startDate);
        return startIndex;
    }
    
    /*
    function dummyFunction() public pure returns(uint) {
        // uint256 productStartDate = products[_id].lastDateAvailable + 1 - products[_id].productPeriod * 1 days;
        uint256 productStartDate = BokkyPooBahsDateTimeLibrary.timestampFromDate(2020, 9, 11);
        // (uint year, uint month, uint day, uint hour, uint minute, uint second) = BokkyPooBahsDateTimeLibrary.timestampToDateTime(productStartDate);
        // return (year, month, day, hour, minute, second);
        return productStartDate;
    }*/
    // 1599683400
    /*
    function dummyFunction1() public pure returns(uint, uint, uint, uint, uint, uint) {
        (uint year, uint month, uint day, uint h, uint m, uint s) = BokkyPooBahsDateTimeLibrary.timestampToDateTime(1599683400 + 19800);
        return (year, month, day, h, m, s);
    }*/
    
    function makePayment(address beneficiary, uint256 value) internal {
        // make payment
        // address dummybeneficiary = beneficiary;
        // dummybeneficiary = 0xED0E32B5E67F2785F90b70c42296Ee89d5f39160;
        address(uint160(beneficiary)).transfer(value);
    }

    function placeOrder(uint256 _productId, uint256 startDate, uint256 numberOfDays) public payable returns(bool) {

        uint256 price = products[_productId].productPrice * numberOfDays;

        // add deposit amt here!
        uint256 depositAmount = 0;

        require(
            msg.value == price,
            'Sent insufficient funds'
        );

        // transfer funds
        makePayment(products[_productId].productOwner, price);

        // all conditions fulfilled and funds transferred!
        // create new order

        createOrder(_productId, msg.sender, price, depositAmount, startDate, numberOfDays);
        return true;

    }

    function createOrder(uint256 _productId, address user, uint256 price, uint256 deposit, uint256 startDate, uint256 numberOfDays) internal {

        // get the product instance
        Product storage product = products[_productId];

        // change the boolean array for the booking!
        uint256 startIndex = getRentIndex(_productId, startDate);
        for (uint256 i = startIndex; i < (startIndex + numberOfDays); i++) {
            product.isNotAvailable[i] = true;
        }

        // calculate the timestamp for endDate (for Order instance)
        uint256 endDate = startDate + (numberOfDays * 1 days) - 1;

        // creating the order object
        Order memory currentOrder = Order(
            _productId,
            startDate,
            endDate,
            price,
            deposit,
            user
        );

        // storing to permanant storage
        orders[orderId] = currentOrder;

        // emit event here

        // increment the count
        orderId += 1;

    }

    // Function to fetch all products here
    // Used in dashboard
    // Checks whether product is active or not
    function fetchAllProducts() external view returns (Product[] memory) {

        // Declaring a new array in memory (nothing is stored in storage)
        // No gas used for external view function
        Product[] memory allProducts = new Product[](productId);
        uint256 counter = 0;

        // iterating over the product mapping
        for (uint256 i = 0; i < productId; i++) {
            // Only add those products which are available
            if (products[i].isAvailableNow == true) {
                // adding the specific product to array
                allProducts[counter] = products[i];
                counter += 1;
            }
        }

        return allProducts;
    }

    // Function to fetch owned products
    // Used in dashboard
    // Returns products which are owned by user calling the function
    function fetchMyProducts() external view returns (Product[] memory) {
        require(userProductCount[msg.sender] > 0, "you don't have any product");

        // Declaring a new array in memory (nothing is stored in storage)
        // No gas used for external view function
        Product[] memory myProducts = new Product[](
            userProductCount[msg.sender]
        );
        uint256 counter = 0;

        // iterating over the product mapping
        for (uint256 i = 0; i < productId; i++) {
            // checking owner
            if (products[i].productOwner == msg.sender) {
                // adding the specific product to array
                myProducts[counter] = products[i];
                counter += 1;
            }
        }

        return myProducts;
    }

    // function to fetch complementary products (all others except users')
    function fetchRemainingProducts() external view returns (Product[] memory) {

        // declare an array for remaining products
        // size = all products - user's products
        uint256 ownProductsCount = userProductCount[msg.sender];
        Product[] memory remainingProducts = new Product[](productId - ownProductsCount);

        uint256 counter = 0;

        // iterating over the product mapping
        for (uint256 i = 0; i < productId; i++) {
            // Only add those products which are not owned by user
            if (products[i].productOwner != msg.sender) {
                remainingProducts[counter] = products[i];
                counter += 1;
            }
        }

        return remainingProducts;

    }

    function fetchProductFromId(uint256 _id) public view returns(Product memory) {
        return products[_id];
    }

    // function to check whether user exists or not
    function checkIfUserExists() external view returns (bool) {
        return users[msg.sender].isValid;
        // if (keccak256(abi.encodePacked(users[msg.sender].userName)) == keccak256(abi.encodePacked("")))
    }

    // fetch all users
    function fetchAllUsers() external view returns (User[] memory) {
        User[] memory allUsers = new User[](userId);
        uint256 counter = 0;

        for (uint256 i = 0; i < userId; i++) {
            allUsers[counter] = users[userAddress[i]];
            counter += 1;
        }
        return allUsers;
    }

    // fetch a particular user profile
    function fetchUserProfle() external view returns (User memory) {
        return users[msg.sender];
    }

    // fetch a particular user profile
    function fetchOwnerOfProduct(uint256 _productId) external view returns(User memory) {
        return users[products[_productId].productOwner];
    }

    // dummy functions for testing!
    function getDummy() external view returns (uint256) {
        return dummy;
    }

    function setDummy(uint256 x) external {
        dummy = x;
    }
}
