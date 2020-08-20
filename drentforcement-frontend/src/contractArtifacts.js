module.exports = {
    address: `0x1A3e1e2c558DAA3805aC3F375AAc6651f70eE9F8`,
    abi: [
        {
          "inputs": [],
          "name": "productId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "products",
          "outputs": [
            {
              "internalType": "string",
              "name": "productName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "productDesc",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "productPrice",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "productOwner",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "lastDateAvailable",
              "type": "uint32"
            },
            {
              "internalType": "bool",
              "name": "isAvailableNow",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "userProductCount",
          "outputs": [
            {
              "internalType": "uint32",
              "name": "",
              "type": "uint32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_productName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_productDesc",
              "type": "string"
            },
            {
              "internalType": "uint32",
              "name": "_numberOfDays",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "_perDayPrice",
              "type": "uint256"
            }
          ],
          "name": "addProductOnRent",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_updatedName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_updatedDesc",
              "type": "string"
            },
            {
              "internalType": "uint32",
              "name": "_updatedNumberOfDays",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "_updatedPerDayPrice",
              "type": "uint256"
            }
          ],
          "name": "editProductOnRent",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fetchAllProducts",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "productName",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "productDesc",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "productPrice",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "productOwner",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "lastDateAvailable",
                  "type": "uint32"
                },
                {
                  "internalType": "bool",
                  "name": "isAvailableNow",
                  "type": "bool"
                },
                {
                  "internalType": "bool[]",
                  "name": "isAvailable",
                  "type": "bool[]"
                }
              ],
              "internalType": "struct Rentforcement.Product[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "fetchMyProducts",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "productName",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "productDesc",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "productPrice",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "productOwner",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "lastDateAvailable",
                  "type": "uint32"
                },
                {
                  "internalType": "bool",
                  "name": "isAvailableNow",
                  "type": "bool"
                },
                {
                  "internalType": "bool[]",
                  "name": "isAvailable",
                  "type": "bool[]"
                }
              ],
              "internalType": "struct Rentforcement.Product[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getDummy",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "x",
              "type": "uint256"
            }
          ],
          "name": "setDummy",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
}