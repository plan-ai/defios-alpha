import { Defios } from "../defios";

export const DefiOsIDL: Defios ={
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
          "name": "firstCommitAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "secondCommitAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "thirdCommitAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fourthCommitAccount",
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
    }
  ]
}