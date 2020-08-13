// SPDX-License-Identifier: MIT

/**
 * DRentforcement
 * A Decentralized C2C Renting Platform
 * Contract for basic renting functions
 */

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract Rentforcement {

    // Product structure
    struct Product {
        string productName;         // name of product
        string productDesc;         // product description
        uint256 productPrice;       // price of product per day in wei (1 ether = 10^18 wei)
        address productOwner;       // Owner of the product
        uint32 lastDateAvailable;  // storing the last date until which the product is available
        bool isAvailableNow;        // Is product available now i.e. is product active
        bool[] isAvailable;         // Array containing per day availability of product
    }

    uint256 public productId;

    // mapping of productid with product object
    mapping(uint256 => Product) public products;

    // Add emit events here

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

        // emit event here

        // Incrementing the product ID
        productId += 1;

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
     // add function here
}