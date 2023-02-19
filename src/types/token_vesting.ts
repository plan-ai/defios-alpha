export type TokenVesting = {
  "version": "0.1.0",
  "name": "token_vesting",
  "instructions": [
    {
      "name": "register",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "numberOfSchedules",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addSchedules",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "schedules",
          "type": {
            "vec": {
              "defined": "Schedule"
            }
          }
        }
      ]
    },
    {
      "name": "unlockTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "destinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeDestination",
      "accounts": [
        {
          "name": "destinationTokenOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "destinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDestinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vestingSchedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "maxSchedules",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "destinationAddress",
            "type": "publicKey"
          },
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "schedules",
            "type": {
              "vec": {
                "defined": "Schedule"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Schedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "releaseTime",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6001,
      "name": "MintMismatch",
      "msg": "Token Mint mismatch"
    },
    {
      "code": 6002,
      "name": "VestingAccountAlreadyInitialized",
      "msg": "Vesting account already initialized with schedules"
    },
    {
      "code": 6003,
      "name": "VestingAccountInvalidClose",
      "msg": "Vesting account cannot have a close authority"
    },
    {
      "code": 6004,
      "name": "VestingAccountInvalidDelegate",
      "msg": "Vesting account cannot have a delegate"
    },
    {
      "code": 6005,
      "name": "InsufficientFunds",
      "msg": "Insufficient tokens to transfer"
    },
    {
      "code": 6006,
      "name": "SchedulesLimitReached",
      "msg": "Schedules addition limit reached"
    },
    {
      "code": 6007,
      "name": "VestingNotReachedRelease",
      "msg": "Vesting contract has not reached release time"
    }
  ]
};

export const IDL: TokenVesting = {
  "version": "0.1.0",
  "name": "token_vesting",
  "instructions": [
    {
      "name": "register",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "numberOfSchedules",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addSchedules",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "schedules",
          "type": {
            "vec": {
              "defined": "Schedule"
            }
          }
        }
      ]
    },
    {
      "name": "unlockTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "destinationTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeDestination",
      "accounts": [
        {
          "name": "destinationTokenOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "destinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDestinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vestingSchedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "maxSchedules",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "destinationAddress",
            "type": "publicKey"
          },
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "schedules",
            "type": {
              "vec": {
                "defined": "Schedule"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Schedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "releaseTime",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6001,
      "name": "MintMismatch",
      "msg": "Token Mint mismatch"
    },
    {
      "code": 6002,
      "name": "VestingAccountAlreadyInitialized",
      "msg": "Vesting account already initialized with schedules"
    },
    {
      "code": 6003,
      "name": "VestingAccountInvalidClose",
      "msg": "Vesting account cannot have a close authority"
    },
    {
      "code": 6004,
      "name": "VestingAccountInvalidDelegate",
      "msg": "Vesting account cannot have a delegate"
    },
    {
      "code": 6005,
      "name": "InsufficientFunds",
      "msg": "Insufficient tokens to transfer"
    },
    {
      "code": 6006,
      "name": "SchedulesLimitReached",
      "msg": "Schedules addition limit reached"
    },
    {
      "code": 6007,
      "name": "VestingNotReachedRelease",
      "msg": "Vesting contract has not reached release time"
    }
  ]
};
