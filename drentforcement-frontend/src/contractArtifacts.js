module.exports = {
  address: "0xfFBd3eDBB89Ae9705A22C2984848088922D55D79",
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
          "internalType": "uint256",
          "name": "_numberOfDays",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_perDayPrice",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_productImage",
          "type": "string"
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
          "internalType": "uint256",
          "name": "startDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numberOfDays",
          "type": "uint256"
        }
      ],
      "name": "checkAvailability",
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
      "inputs": [],
      "name": "fetchAllProducts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
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
              "internalType": "string",
              "name": "productImage",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "productOwner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "productPeriod",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastDateAvailable",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isAvailableNow",
              "type": "bool"
            },
            {
              "internalType": "bool[]",
              "name": "isNotAvailable",
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
              "internalType": "address",
              "name": "userAccountAddress",
              "type": "address"
            },
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
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
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
              "internalType": "string",
              "name": "productImage",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "productOwner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "productPeriod",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastDateAvailable",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isAvailableNow",
              "type": "bool"
            },
            {
              "internalType": "bool[]",
              "name": "isNotAvailable",
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
      "name": "fetchRemainingProducts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
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
              "internalType": "string",
              "name": "productImage",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "productOwner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "productPeriod",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastDateAvailable",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isAvailableNow",
              "type": "bool"
            },
            {
              "internalType": "bool[]",
              "name": "isNotAvailable",
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
      "name": "fetchUserProfle",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "userAccountAddress",
              "type": "address"
            },
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
          "internalType": "struct Rentforcement.User",
          "name": "",
          "type": "tuple"
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
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startDate",
          "type": "uint256"
        }
      ],
      "name": "getRentIndex",
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
      "name": "orderId",
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
      "name": "orders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "valuePaid",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "valueInDeposit",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numberOfDays",
          "type": "uint256"
        }
      ],
      "name": "placeOrder",
      "outputs": [],
      "stateMutability": "payable",
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
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
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
          "internalType": "string",
          "name": "productImage",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "productOwner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "productPeriod",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastDateAvailable",
          "type": "uint256"
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
      "name": "updateUser",
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
          "internalType": "address",
          "name": "userAccountAddress",
          "type": "address"
        },
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