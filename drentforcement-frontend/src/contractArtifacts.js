module.exports = {
  address: "0x7C988C91BD768885ee792904A871927e6BaB329D",
  abi: [
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
          "internalType": "string",
          "name": "_userName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_userEmail",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_userPhone",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_userAddress",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_userCity",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_userState",
          "type": "string"
        }
      ],
      "name": "createNewUser",
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
    },
    {
      "inputs": [],
      "name": "checkIfUserExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
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
      "name": "fetchAllUsers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "userName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "userEmail",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "userPhone",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "userAddress",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "userCity",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "userState",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isValid",
              "type": "bool"
            }
          ],
          "internalType": "struct Rentforcement.User[]",
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
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "userId",
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
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "userEmail",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "userPhone",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "userAddress",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "userCity",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "userState",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isValid",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}