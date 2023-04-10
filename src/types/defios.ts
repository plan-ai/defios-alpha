export type Defios = {
  "version": "0.1.0",
  "name": "defios",
  "instructions": [
    {
      "name": "createNameRouter",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nameRouterAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signingDomain",
          "type": "string"
        },
        {
          "name": "signatureVersion",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addVerifiedUser",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nameRouterAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "verifiedUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userName",
          "type": "string"
        },
        {
          "name": "userPubkey",
          "type": "publicKey"
        },
        {
          "name": "msg",
          "type": "bytes"
        },
        {
          "name": "sig",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "createRepository",
      "accounts": [
        {
          "name": "repositoryCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "repositoryVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryTokenPoolAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "ghUsernames",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "claimAmounts",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "tokenName",
          "type": "string"
        },
        {
          "name": "tokenSymbol",
          "type": "string"
        },
        {
          "name": "tokenUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "addUserClaim",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userClaimAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userName",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimUserTokens",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "verifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userClaimAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryTokenPoolAccount",
          "isMut": true,
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
          "name": "associatedTokenProgram",
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
          "name": "userName",
          "type": "string"
        }
      ]
    },
    {
      "name": "addIssue",
      "accounts": [
        {
          "name": "issueCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "stakeIssue",
      "accounts": [
        {
          "name": "issueStaker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "issueStakerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueStakerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
          "name": "transferAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstakeIssue",
      "accounts": [
        {
          "name": "issueStaker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "issueStakerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueStakerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
      "name": "addCommit",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "commitCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "commitVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "commitAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "commitHash",
          "type": "string"
        },
        {
          "name": "treeHash",
          "type": "string"
        },
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "commitCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "commitCreatorRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "commitVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "nameRouter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "signatureVersion",
            "type": "u8"
          },
          {
            "name": "totalVerifiedUsers",
            "type": "u64"
          },
          {
            "name": "routerCreator",
            "type": "publicKey"
          },
          {
            "name": "signingDomain",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "verifiedUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "nameRouter",
            "type": "publicKey"
          },
          {
            "name": "userName",
            "type": "string"
          },
          {
            "name": "userPubkey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "repository",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "issueIndex",
            "type": "u64"
          },
          {
            "name": "nameRouter",
            "type": "publicKey"
          },
          {
            "name": "repositoryCreator",
            "type": "publicKey"
          },
          {
            "name": "rewardsMint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "repositoryTokenPoolAccount",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "issue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u64"
          },
          {
            "name": "issueCreator",
            "type": "publicKey"
          },
          {
            "name": "issueTokenPoolAccount",
            "type": "publicKey"
          },
          {
            "name": "repository",
            "type": "publicKey"
          },
          {
            "name": "commitIndex",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "closedAt",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "commit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u64"
          },
          {
            "name": "commitCreator",
            "type": "publicKey"
          },
          {
            "name": "issue",
            "type": "publicKey"
          },
          {
            "name": "commitHash",
            "type": "string"
          },
          {
            "name": "treeHash",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "issueStaker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "stakedAmount",
            "type": "u64"
          },
          {
            "name": "stakedAt",
            "type": "u64"
          },
          {
            "name": "issueStaker",
            "type": "publicKey"
          },
          {
            "name": "issue",
            "type": "publicKey"
          },
          {
            "name": "issueStakerTokenAccount",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "repositoryAccount",
            "type": "publicKey"
          },
          {
            "name": "nameRouterAccount",
            "type": "publicKey"
          },
          {
            "name": "ghUser",
            "type": "string"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NameRouterCreated",
      "fields": [
        {
          "name": "routerCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nameRouterAccount",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "VerifiedUserAdded",
      "fields": [
        {
          "name": "routerCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nameRouterAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "verifiedUserAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "userName",
          "type": "string",
          "index": false
        },
        {
          "name": "userPubkey",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CommitAdded",
      "fields": [
        {
          "name": "commitCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "commitAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "metadataUri",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "IssueCreated",
      "fields": [
        {
          "name": "issueCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "repositoryAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueTokenPoolAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "uri",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "RepositoryCreated",
      "fields": [
        {
          "name": "repositoryCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "repositoryAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "uri",
          "type": "string",
          "index": false
        },
        {
          "name": "name",
          "type": "string",
          "index": false
        },
        {
          "name": "description",
          "type": "string",
          "index": false
        },
        {
          "name": "ghUsernames",
          "type": {
            "vec": "string"
          },
          "index": false
        },
        {
          "name": "claimAmounts",
          "type": {
            "vec": "u64"
          },
          "index": false
        },
        {
          "name": "tokenName",
          "type": "string",
          "index": false
        },
        {
          "name": "tokenSymbol",
          "type": "string",
          "index": false
        },
        {
          "name": "tokenUri",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "IssueStaked",
      "fields": [
        {
          "name": "issueStaker",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueStakerTokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakedAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "IssueUnstaked",
      "fields": [
        {
          "name": "issueStaker",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueStakerTokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "unstakedAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SignatureVerificationFailed",
      "msg": "Invalid Signature"
    },
    {
      "code": 6001,
      "name": "UnauthorizedUser",
      "msg": "User not verified"
    },
    {
      "code": 6002,
      "name": "InvalidNameRouter",
      "msg": "Invalid Name Router"
    },
    {
      "code": 6003,
      "name": "TokenAccountMismatch",
      "msg": "Token account mismatch"
    },
    {
      "code": 6004,
      "name": "InsufficientStakingFunds",
      "msg": "Insufficient funds for staking"
    },
    {
      "code": 6005,
      "name": "IssueClosedAlready",
      "msg": "Cannot stake/unstake for a closed issue"
    },
    {
      "code": 6006,
      "name": "HashesMismatch",
      "msg": "Commit hashes do not match for reward eligibility"
    },
    {
      "code": 6007,
      "name": "AlreadyClaimed",
      "msg": "Tokens Already Claimed"
    }
  ]
};

export const IDL: Defios = {
  "version": "0.1.0",
  "name": "defios",
  "instructions": [
    {
      "name": "createNameRouter",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nameRouterAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signingDomain",
          "type": "string"
        },
        {
          "name": "signatureVersion",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addVerifiedUser",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nameRouterAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "verifiedUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userName",
          "type": "string"
        },
        {
          "name": "userPubkey",
          "type": "publicKey"
        },
        {
          "name": "msg",
          "type": "bytes"
        },
        {
          "name": "sig",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "createRepository",
      "accounts": [
        {
          "name": "repositoryCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "repositoryVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryTokenPoolAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "ghUsernames",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "claimAmounts",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "tokenName",
          "type": "string"
        },
        {
          "name": "tokenSymbol",
          "type": "string"
        },
        {
          "name": "tokenUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "addUserClaim",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userClaimAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userName",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimUserTokens",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "verifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userClaimAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryTokenPoolAccount",
          "isMut": true,
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
          "name": "associatedTokenProgram",
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
          "name": "userName",
          "type": "string"
        }
      ]
    },
    {
      "name": "addIssue",
      "accounts": [
        {
          "name": "issueCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "stakeIssue",
      "accounts": [
        {
          "name": "issueStaker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "issueStakerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueStakerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
          "name": "transferAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstakeIssue",
      "accounts": [
        {
          "name": "issueStaker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "issueStakerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueStakerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
      "name": "addCommit",
      "accounts": [
        {
          "name": "routerCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "commitCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "commitVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "commitAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "commitHash",
          "type": "string"
        },
        {
          "name": "treeHash",
          "type": "string"
        },
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "commitCreator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "commitCreatorRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "routerCreator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nameRouterAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "commitVerifiedUser",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "repositoryAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "issueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "issueTokenPoolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "nameRouter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "signatureVersion",
            "type": "u8"
          },
          {
            "name": "totalVerifiedUsers",
            "type": "u64"
          },
          {
            "name": "routerCreator",
            "type": "publicKey"
          },
          {
            "name": "signingDomain",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "verifiedUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "nameRouter",
            "type": "publicKey"
          },
          {
            "name": "userName",
            "type": "string"
          },
          {
            "name": "userPubkey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "repository",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "issueIndex",
            "type": "u64"
          },
          {
            "name": "nameRouter",
            "type": "publicKey"
          },
          {
            "name": "repositoryCreator",
            "type": "publicKey"
          },
          {
            "name": "rewardsMint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "repositoryTokenPoolAccount",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "issue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u64"
          },
          {
            "name": "issueCreator",
            "type": "publicKey"
          },
          {
            "name": "issueTokenPoolAccount",
            "type": "publicKey"
          },
          {
            "name": "repository",
            "type": "publicKey"
          },
          {
            "name": "commitIndex",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "closedAt",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "commit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u64"
          },
          {
            "name": "commitCreator",
            "type": "publicKey"
          },
          {
            "name": "issue",
            "type": "publicKey"
          },
          {
            "name": "commitHash",
            "type": "string"
          },
          {
            "name": "treeHash",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "issueStaker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "stakedAmount",
            "type": "u64"
          },
          {
            "name": "stakedAt",
            "type": "u64"
          },
          {
            "name": "issueStaker",
            "type": "publicKey"
          },
          {
            "name": "issue",
            "type": "publicKey"
          },
          {
            "name": "issueStakerTokenAccount",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "repositoryAccount",
            "type": "publicKey"
          },
          {
            "name": "nameRouterAccount",
            "type": "publicKey"
          },
          {
            "name": "ghUser",
            "type": "string"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NameRouterCreated",
      "fields": [
        {
          "name": "routerCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nameRouterAccount",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "VerifiedUserAdded",
      "fields": [
        {
          "name": "routerCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nameRouterAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "verifiedUserAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "userName",
          "type": "string",
          "index": false
        },
        {
          "name": "userPubkey",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CommitAdded",
      "fields": [
        {
          "name": "commitCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "commitAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "metadataUri",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "IssueCreated",
      "fields": [
        {
          "name": "issueCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "repositoryAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueTokenPoolAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "uri",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "RepositoryCreated",
      "fields": [
        {
          "name": "repositoryCreator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "repositoryAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "uri",
          "type": "string",
          "index": false
        },
        {
          "name": "name",
          "type": "string",
          "index": false
        },
        {
          "name": "description",
          "type": "string",
          "index": false
        },
        {
          "name": "ghUsernames",
          "type": {
            "vec": "string"
          },
          "index": false
        },
        {
          "name": "claimAmounts",
          "type": {
            "vec": "u64"
          },
          "index": false
        },
        {
          "name": "tokenName",
          "type": "string",
          "index": false
        },
        {
          "name": "tokenSymbol",
          "type": "string",
          "index": false
        },
        {
          "name": "tokenUri",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "IssueStaked",
      "fields": [
        {
          "name": "issueStaker",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueStakerTokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakedAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "IssueUnstaked",
      "fields": [
        {
          "name": "issueStaker",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueStakerTokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "issueAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "unstakedAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardsMint",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SignatureVerificationFailed",
      "msg": "Invalid Signature"
    },
    {
      "code": 6001,
      "name": "UnauthorizedUser",
      "msg": "User not verified"
    },
    {
      "code": 6002,
      "name": "InvalidNameRouter",
      "msg": "Invalid Name Router"
    },
    {
      "code": 6003,
      "name": "TokenAccountMismatch",
      "msg": "Token account mismatch"
    },
    {
      "code": 6004,
      "name": "InsufficientStakingFunds",
      "msg": "Insufficient funds for staking"
    },
    {
      "code": 6005,
      "name": "IssueClosedAlready",
      "msg": "Cannot stake/unstake for a closed issue"
    },
    {
      "code": 6006,
      "name": "HashesMismatch",
      "msg": "Commit hashes do not match for reward eligibility"
    },
    {
      "code": 6007,
      "name": "AlreadyClaimed",
      "msg": "Tokens Already Claimed"
    }
  ]
};
