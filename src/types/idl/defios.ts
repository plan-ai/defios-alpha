export type Defios = {
  version: '0.1.0';
  name: 'defios';
  constants: [
    {
      name: 'AUTHORIZED_PUBLIC_KEY';
      type: 'publicKey';
      value: 'pubkey ! ("55kBY9yxqSC42boV8PywT2gqGzgLi5MPAtifNRgPNezF")';
    },
    {
      name: 'MAX_INT';
      type: 'u128';
      value: 'u128 :: pow (2 , 64) - 1';
    },
    {
      name: 'VOTING_END';
      type: 'i64';
      value: '72 * 60 * 60';
    }
  ];
  instructions: [
    {
      name: 'createNameRouter';
      accounts: [
        {
          name: 'routerCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nameRouterAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'arg';
                type: 'string';
                path: 'signing_domain';
              },
              {
                kind: 'arg';
                type: 'u8';
                path: 'signature_version';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'router_creator';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'signingDomain';
          type: 'string';
        },
        {
          name: 'signatureVersion';
          type: 'u8';
        }
      ];
    },
    {
      name: 'addVerifiedUser';
      accounts: [
        {
          name: 'routerCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nameRouterAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'account';
                type: 'string';
                account: 'NameRouter';
                path: 'name_router_account.signing_domain';
              },
              {
                kind: 'account';
                type: 'u8';
                account: 'NameRouter';
                path: 'name_router_account.signature_version';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'router_creator';
              }
            ];
          };
        },
        {
          name: 'verifiedUserAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'arg';
                type: 'string';
                path: 'user_name';
              },
              {
                kind: 'arg';
                type: 'publicKey';
                path: 'user_pubkey';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'NameRouter';
                path: 'name_router_account';
              }
            ];
          };
        },
        {
          name: 'sysvarInstructions';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'userName';
          type: 'string';
        },
        {
          name: 'userPubkey';
          type: 'publicKey';
        },
        {
          name: 'msg';
          type: 'bytes';
        },
        {
          name: 'sig';
          type: {
            array: ['u8', 64];
          };
        }
      ];
    },
    {
      name: 'createRepository';
      accounts: [
        {
          name: 'repositoryCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'repositoryVerifiedUser';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'account';
                type: 'string';
                account: 'VerifiedUser';
                path: 'repository_verified_user.user_name';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'repository_creator';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'VerifiedUser';
                path: 'repository_verified_user.name_router';
              }
            ];
          };
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'arg';
                type: 'string';
                path: 'id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'repository_creator';
              }
            ];
          };
        },
        {
          name: 'vestingAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'vesting';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              }
            ];
          };
        },
        {
          name: 'vestingTokenAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'repositoryCreatorTokenAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'defaultSchedule';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'isGodReal?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'DoULoveMe?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'SweetChick';
              }
            ];
          };
        },
        {
          name: 'metadata';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'rewardsMint';
          isMut: true;
          isSigner: false;
          isOptional: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'Miners';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'MinerC';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              }
            ];
          };
        },
        {
          name: 'importedMint';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenMetadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'id';
          type: 'string';
        },
        {
          name: 'description';
          type: 'string';
        },
        {
          name: 'uri';
          type: 'string';
        },
        {
          name: 'tokenName';
          type: {
            option: 'string';
          };
        },
        {
          name: 'tokenImage';
          type: {
            option: 'string';
          };
        },
        {
          name: 'tokenMetadataUri';
          type: {
            option: 'string';
          };
        }
      ];
    },
    {
      name: 'addIssue';
      accounts: [
        {
          name: 'issueCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'issueVerifiedUser';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'account';
                type: 'string';
                account: 'VerifiedUser';
                path: 'issue_verified_user.user_name';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'issue_creator';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'VerifiedUser';
                path: 'issue_verified_user.name_router';
              }
            ];
          };
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account.repository_creator';
              }
            ];
          };
        },
        {
          name: 'issueAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issue';
              },
              {
                kind: 'account';
                type: 'u64';
                account: 'Repository';
                path: 'repository_account.issue_index';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'issue_creator';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'uri';
          type: 'string';
        }
      ];
    },
    {
      name: 'stakeIssue';
      accounts: [
        {
          name: 'issueStaker';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'issueStakerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account.repository_creator';
              }
            ];
          };
        },
        {
          name: 'issueAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issue';
              },
              {
                kind: 'account';
                type: 'u64';
                account: 'Issue';
                path: 'issue_account.index';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account.issue_creator';
              }
            ];
          };
        },
        {
          name: 'issueTokenPoolAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'issueStakerAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issuestaker';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'issue_staker';
              }
            ];
          };
        },
        {
          name: 'rewardsMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pullRequestMetadataAccount';
          isMut: false;
          isSigner: false;
          isOptional: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'pullrequestadded';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'PullRequest';
                path: 'pull_request_metadata_account.sent_by';
              }
            ];
          };
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'transferAmount';
          type: 'u64';
        }
      ];
    },
    {
      name: 'unstakeIssue';
      accounts: [
        {
          name: 'issueStaker';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'issueStakerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account.repository_creator';
              }
            ];
          };
        },
        {
          name: 'issueAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issue';
              },
              {
                kind: 'account';
                type: 'u64';
                account: 'Issue';
                path: 'issue_account.index';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account.issue_creator';
              }
            ];
          };
        },
        {
          name: 'issueTokenPoolAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'issueStakerAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issuestaker';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'issue_staker';
              }
            ];
          };
        },
        {
          name: 'rewardsMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'addCommit';
      accounts: [
        {
          name: 'repositoryAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account.repository_creator';
              }
            ];
          };
        },
        {
          name: 'issueAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issue';
              },
              {
                kind: 'account';
                type: 'u64';
                account: 'Issue';
                path: 'issue_account.index';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account.issue_creator';
              }
            ];
          };
        },
        {
          name: 'commitCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'commitVerifiedUser';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'account';
                type: 'string';
                account: 'VerifiedUser';
                path: 'commit_verified_user.user_name';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'commit_creator';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'VerifiedUser';
                path: 'commit_verified_user.name_router';
              }
            ];
          };
        },
        {
          name: 'commitAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'commit';
              },
              {
                kind: 'arg';
                type: 'string';
                path: 'commit_hash';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'commit_creator';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'commitHash';
          type: 'string';
        },
        {
          name: 'treeHash';
          type: 'string';
        },
        {
          name: 'metadataUri';
          type: 'string';
        }
      ];
    },
    {
      name: 'claimReward';
      accounts: [
        {
          name: 'pullRequest';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'pullrequestadded';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'pull_request_creator';
              }
            ];
          };
        },
        {
          name: 'pullRequestCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pullRequestCreatorRewardAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rewardsMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'repositoryCreator';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'issueCreator';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'repository_creator';
              }
            ];
          };
        },
        {
          name: 'issueAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issue';
              },
              {
                kind: 'account';
                type: 'u64';
                account: 'Issue';
                path: 'issue_account.index';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'issue_creator';
              }
            ];
          };
        },
        {
          name: 'issueTokenPoolAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'addRoadmapData';
      accounts: [
        {
          name: 'roadmapDataAdder';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'metadataAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'roadmapmetadataadd';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'roadmap_data_adder';
              }
            ];
          };
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account.repository_creator';
              }
            ];
          };
        },
        {
          name: 'roadmapVerifiedUser';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'account';
                type: 'string';
                account: 'VerifiedUser';
                path: 'roadmap_verified_user.user_name';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'roadmap_data_adder';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'VerifiedUser';
                path: 'roadmap_verified_user.name_router';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'roadmapTitle';
          type: 'string';
        },
        {
          name: 'roadmapDescriptionLink';
          type: 'string';
        },
        {
          name: 'roadmapImageUrl';
          type: 'string';
        },
        {
          name: 'roadmapOutlook';
          type: {
            defined: 'RoadmapOutlook';
          };
        }
      ];
    },
    {
      name: 'addObjectiveData';
      accounts: [
        {
          name: 'objectiveDataAddr';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'metadataAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'objectivedataadd';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'objective_issue';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'objective_data_addr';
              },
              {
                kind: 'arg';
                type: 'string';
                path: 'objective_id';
              }
            ];
          };
        },
        {
          name: 'objectiveIssue';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account.repository_creator';
              }
            ];
          };
        },
        {
          name: 'objectiveVerifiedUser';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'account';
                type: 'string';
                account: 'VerifiedUser';
                path: 'objective_verified_user.user_name';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'objective_data_addr';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'VerifiedUser';
                path: 'objective_verified_user.name_router';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'objectiveId';
          type: 'string';
        },
        {
          name: 'objectiveTitle';
          type: 'string';
        },
        {
          name: 'objectiveStartUnix';
          type: 'i64';
        },
        {
          name: 'objectiveEndUnix';
          type: {
            option: 'i64';
          };
        },
        {
          name: 'objectiveDescriptionLink';
          type: 'string';
        },
        {
          name: 'objectiveDeliverable';
          type: {
            defined: 'ObjectiveDeliverable';
          };
        }
      ];
    },
    {
      name: 'addChildObjective';
      accounts: [
        {
          name: 'childObjectiveAdder';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'roadmapMetadataAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'parentObjectiveAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'addPr';
      accounts: [
        {
          name: 'pullRequestAddr';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'issue';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pullRequestMetadataAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'pullrequestadded';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'pull_request_addr';
              }
            ];
          };
        },
        {
          name: 'pullRequestVerifiedUser';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'account';
                type: 'string';
                account: 'VerifiedUser';
                path: 'pull_request_verified_user.user_name';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'pull_request_addr';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'VerifiedUser';
                path: 'pull_request_verified_user.name_router';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'metadataUri';
          type: 'string';
        }
      ];
    },
    {
      name: 'addCommitToPr';
      accounts: [
        {
          name: 'commitAddr';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pullRequestMetadataAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'unlockTokens';
      accounts: [
        {
          name: 'repositoryCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'repositoryCreatorTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'account';
                type: 'string';
                account: 'Repository';
                path: 'repository_account.id';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'repository_creator';
              }
            ];
          };
        },
        {
          name: 'vestingAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'vesting';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              }
            ];
          };
        },
        {
          name: 'vestingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'acceptPr';
      accounts: [
        {
          name: 'repositoryCreator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'pullRequestAddr';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'repository';
              },
              {
                kind: 'arg';
                type: 'string';
                path: 'repo_name';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'repository_creator';
              }
            ];
          };
        },
        {
          name: 'issue';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pullRequestMetadataAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'pullrequestadded';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'pull_request_addr';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'repoName';
          type: 'string';
        }
      ];
    },
    {
      name: 'changeVestingSchedule';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vestingSchedule';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'vesting';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'newVestingSchedule';
          type: {
            vec: {
              defined: 'Schedule';
            };
          };
        }
      ];
    },
    {
      name: 'createCommunalAccount';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communalDeposit';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'are_we_conscious';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'is love life ?  ';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'arewemadorinlove';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Mint';
                path: 'rewards_mint';
              }
            ];
          };
        },
        {
          name: 'communalTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communalUsdcAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rewardsMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'usdcMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'buyTokens';
      accounts: [
        {
          name: 'buyer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communalDeposit';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'are_we_conscious';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'is love life ?  ';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'arewemadorinlove';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Mint';
                path: 'rewards_mint';
              }
            ];
          };
        },
        {
          name: 'communalTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communalUsdcAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'buyerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'buyerUsdcAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rewardsMint';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'Miners';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'MinerC';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              }
            ];
          };
        },
        {
          name: 'usdcMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'defaultSchedule';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'isGodReal?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'DoULoveMe?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'SweetChick';
              }
            ];
          };
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'usdcAmount';
          type: 'u64';
        },
        {
          name: 'numberOfTokens';
          type: 'u64';
        }
      ];
    },
    {
      name: 'sellTokens';
      accounts: [
        {
          name: 'seller';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communalDeposit';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'are_we_conscious';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'is love life ?  ';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'arewemadorinlove';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Mint';
                path: 'rewards_mint';
              }
            ];
          };
        },
        {
          name: 'communalTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communalUsdcAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'sellerTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'repositoryAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'sellerUsdcAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rewardsMint';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'Miners';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'MinerC';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository_account';
              }
            ];
          };
        },
        {
          name: 'usdcMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'defaultSchedule';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'isGodReal?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'DoULoveMe?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'SweetChick';
              }
            ];
          };
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'usdcAmount';
          type: 'u64';
        },
        {
          name: 'numberOfTokens';
          type: 'u64';
        }
      ];
    },
    {
      name: 'setDefaultSchedule';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'defaultSchedule';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'isGodReal?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'DoULoveMe?';
              },
              {
                kind: 'const';
                type: 'string';
                value: 'SweetChick';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'numberOfSchedules';
          type: 'u32';
        },
        {
          name: 'perVestingAmount';
          type: 'u64';
        },
        {
          name: 'unixChange';
          type: 'u64';
        }
      ];
    },
    {
      name: 'votePr';
      accounts: [
        {
          name: 'issueStaker';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'repository';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pullRequestMetadataAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'pullrequestadded';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'PullRequest';
                path: 'pull_request_metadata_account.sent_by';
              }
            ];
          };
        },
        {
          name: 'issueAccount';
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issue';
              },
              {
                kind: 'account';
                type: 'u64';
                account: 'Issue';
                path: 'issue_account.index';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Repository';
                path: 'repository';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account.issue_creator';
              }
            ];
          };
        },
        {
          name: 'issueStakerAccount';
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: 'const';
                type: 'string';
                value: 'issuestaker';
              },
              {
                kind: 'account';
                type: 'publicKey';
                account: 'Issue';
                path: 'issue_account';
              },
              {
                kind: 'account';
                type: 'publicKey';
                path: 'issue_staker';
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: 'nameRouter';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'signatureVersion';
            type: 'u8';
          },
          {
            name: 'totalVerifiedUsers';
            type: 'u64';
          },
          {
            name: 'routerCreator';
            type: 'publicKey';
          },
          {
            name: 'signingDomain';
            type: 'string';
          }
        ];
      };
    },
    {
      name: 'verifiedUser';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'nameRouter';
            type: 'publicKey';
          },
          {
            name: 'userName';
            type: 'string';
          },
          {
            name: 'userPubkey';
            type: 'publicKey';
          }
        ];
      };
    },
    {
      name: 'repository';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'issueIndex';
            type: 'u64';
          },
          {
            name: 'nameRouter';
            type: 'publicKey';
          },
          {
            name: 'repositoryCreator';
            type: 'publicKey';
          },
          {
            name: 'rewardsMint';
            type: 'publicKey';
          },
          {
            name: 'id';
            type: 'string';
          },
          {
            name: 'description';
            type: 'string';
          },
          {
            name: 'uri';
            type: 'string';
          },
          {
            name: 'vestingSchedule';
            type: {
              option: 'publicKey';
            };
          }
        ];
      };
    },
    {
      name: 'defaultVestingSchedule';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'numberOfSchedules';
            type: 'u32';
          },
          {
            name: 'perVestingAmount';
            type: 'u64';
          },
          {
            name: 'unixChange';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'issue';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'index';
            type: 'u64';
          },
          {
            name: 'issueCreator';
            type: 'publicKey';
          },
          {
            name: 'repository';
            type: 'publicKey';
          },
          {
            name: 'commitIndex';
            type: 'u64';
          },
          {
            name: 'createdAt';
            type: 'u64';
          },
          {
            name: 'closedAt';
            type: {
              option: 'u64';
            };
          },
          {
            name: 'uri';
            type: 'string';
          },
          {
            name: 'firstPrTime';
            type: {
              option: 'i64';
            };
          }
        ];
      };
    },
    {
      name: 'vestingSchedule';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'destinationAddress';
            type: 'publicKey';
          },
          {
            name: 'mintAddress';
            type: 'publicKey';
          },
          {
            name: 'schedules';
            type: {
              vec: {
                defined: 'Schedule';
              };
            };
          }
        ];
      };
    },
    {
      name: 'commit';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'index';
            type: 'u64';
          },
          {
            name: 'commitCreator';
            type: 'publicKey';
          },
          {
            name: 'issue';
            type: 'publicKey';
          },
          {
            name: 'commitHash';
            type: 'string';
          },
          {
            name: 'treeHash';
            type: 'string';
          },
          {
            name: 'createdAt';
            type: 'u64';
          },
          {
            name: 'metadataUri';
            type: 'string';
          }
        ];
      };
    },
    {
      name: 'issueStaker';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'stakedAmount';
            type: {
              vec: 'u64';
            };
          },
          {
            name: 'issueStaker';
            type: 'publicKey';
          },
          {
            name: 'issue';
            type: 'publicKey';
          },
          {
            name: 'issueStakerTokenAccount';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'prVotingPower';
            type: 'u64';
          },
          {
            name: 'votedOn';
            type: {
              option: 'publicKey';
            };
          },
          {
            name: 'issueUnstakable';
            type: 'bool';
          },
          {
            name: 'hasVoted';
            type: 'bool';
          }
        ];
      };
    },
    {
      name: 'pullRequest';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'sentBy';
            type: 'publicKey';
          },
          {
            name: 'commits';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'metadataUri';
            type: 'string';
          },
          {
            name: 'accepted';
            type: 'bool';
          },
          {
            name: 'totalVotedAmount';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'roadMapMetaDataStore';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'roadmapTitle';
            type: 'string';
          },
          {
            name: 'roadmapCreationUnix';
            type: 'i64';
          },
          {
            name: 'roadmapCreatorId';
            type: 'publicKey';
          },
          {
            name: 'roadmapDescriptionLink';
            type: 'string';
          },
          {
            name: 'rootObjectiveIds';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'roadmapCreator';
            type: 'publicKey';
          },
          {
            name: 'roadmapOutlook';
            type: {
              defined: 'RoadmapOutlook';
            };
          },
          {
            name: 'roadmapImageUrl';
            type: 'string';
          },
          {
            name: 'roadmapRepository';
            type: 'publicKey';
          }
        ];
      };
    },
    {
      name: 'objective';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'objectiveTitle';
            type: 'string';
          },
          {
            name: 'objectiveCreationUnix';
            type: 'i64';
          },
          {
            name: 'objectiveCreatorId';
            type: 'publicKey';
          },
          {
            name: 'objectiveStartUnix';
            type: 'i64';
          },
          {
            name: 'objectiveEndUnix';
            type: {
              option: 'i64';
            };
          },
          {
            name: 'objectiveDescriptionLink';
            type: 'string';
          },
          {
            name: 'objectiveState';
            type: {
              defined: 'ObjectiveState';
            };
          },
          {
            name: 'childrenObjectiveKeys';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'objectiveDeliverable';
            type: {
              defined: 'ObjectiveDeliverable';
            };
          },
          {
            name: 'objectiveIssue';
            type: 'publicKey';
          },
          {
            name: 'objectiveId';
            type: 'string';
          },
          {
            name: 'objectiveRepository';
            type: 'publicKey';
          }
        ];
      };
    },
    {
      name: 'communalAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'Schedule';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'releaseTime';
            type: 'u64';
          },
          {
            name: 'amount';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'ObjectiveState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Locked';
          },
          {
            name: 'InProgress';
          },
          {
            name: 'Closed';
          },
          {
            name: 'Deprecated';
          }
        ];
      };
    },
    {
      name: 'ObjectiveDeliverable';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Infrastructure';
          },
          {
            name: 'Tooling';
          },
          {
            name: 'Publication';
          },
          {
            name: 'Product';
          },
          {
            name: 'Other';
          }
        ];
      };
    },
    {
      name: 'RoadmapOutlook';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Next2';
          },
          {
            name: 'Next5';
          },
          {
            name: 'Plus5';
          },
          {
            name: 'LongTerm';
          }
        ];
      };
    }
  ];
  events: [
    {
      name: 'PullRequestSent';
      fields: [
        {
          name: 'sentBy';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'commits';
          type: {
            vec: 'publicKey';
          };
          index: false;
        },
        {
          name: 'metadataUri';
          type: 'string';
          index: false;
        },
        {
          name: 'issue';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'pullRequest';
          type: 'publicKey';
          index: false;
        }
      ];
    },
    {
      name: 'AddCommitToPR';
      fields: [
        {
          name: 'commit';
          type: {
            vec: 'publicKey';
          };
          index: false;
        },
        {
          name: 'by';
          type: 'publicKey';
          index: false;
        }
      ];
    },
    {
      name: 'AddChildObjectiveEvent';
      fields: [
        {
          name: 'parentObjectiveAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'addedBy';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'objectives';
          type: {
            vec: 'publicKey';
          };
          index: false;
        }
      ];
    },
    {
      name: 'AddObjectiveDataEvent';
      fields: [
        {
          name: 'objectiveTitle';
          type: 'string';
          index: false;
        },
        {
          name: 'objectiveMetadataUri';
          type: 'string';
          index: false;
        },
        {
          name: 'objectiveStartUnix';
          type: 'i64';
          index: false;
        },
        {
          name: 'objectiveCreationUnix';
          type: 'i64';
          index: false;
        },
        {
          name: 'objectiveEndUnix';
          type: {
            option: 'i64';
          };
          index: false;
        },
        {
          name: 'objectiveDeliverable';
          type: {
            defined: 'ObjectiveDeliverable';
          };
          index: false;
        },
        {
          name: 'objectivePublicKey';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'objectiveIssue';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'objectiveAddr';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'childObjectives';
          type: {
            vec: 'publicKey';
          };
          index: false;
        }
      ];
    },
    {
      name: 'AddRoadmapDataEvent';
      fields: [
        {
          name: 'roadmapTitle';
          type: 'string';
          index: false;
        },
        {
          name: 'roadmapDescriptionLink';
          type: 'string';
          index: false;
        },
        {
          name: 'roadmapCreationUnix';
          type: 'u64';
          index: false;
        },
        {
          name: 'roadmapCreator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'rootObjectiveIds';
          type: {
            vec: 'publicKey';
          };
          index: false;
        },
        {
          name: 'roadmapOutlook';
          type: {
            defined: 'RoadmapOutlook';
          };
          index: false;
        },
        {
          name: 'roadmapImageUrl';
          type: 'string';
          index: false;
        },
        {
          name: 'roadmap';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'roadmapRepository';
          type: 'publicKey';
          index: false;
        }
      ];
    },
    {
      name: 'NameRouterCreated';
      fields: [
        {
          name: 'routerCreator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nameRouterAccount';
          type: 'publicKey';
          index: false;
        }
      ];
    },
    {
      name: 'VerifiedUserAdded';
      fields: [
        {
          name: 'routerCreator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nameRouterAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'verifiedUserAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'userName';
          type: 'string';
          index: false;
        },
        {
          name: 'userPubkey';
          type: 'publicKey';
          index: false;
        }
      ];
    },
    {
      name: 'CommitAdded';
      fields: [
        {
          name: 'commitCreator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'commitAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'metadataUri';
          type: 'string';
          index: false;
        }
      ];
    },
    {
      name: 'IssueCreated';
      fields: [
        {
          name: 'issueCreator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'repositoryAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'uri';
          type: 'string';
          index: false;
        }
      ];
    },
    {
      name: 'RepositoryCreated';
      fields: [
        {
          name: 'repositoryCreator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'repositoryAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'rewardsMint';
          type: {
            option: 'publicKey';
          };
          index: false;
        },
        {
          name: 'uri';
          type: 'string';
          index: false;
        },
        {
          name: 'id';
          type: 'string';
          index: false;
        },
        {
          name: 'description';
          type: 'string';
          index: false;
        },
        {
          name: 'tokenName';
          type: {
            option: 'string';
          };
          index: false;
        },
        {
          name: 'tokenSymbol';
          type: {
            option: 'string';
          };
          index: false;
        },
        {
          name: 'tokenMetadataUri';
          type: {
            option: 'string';
          };
          index: false;
        },
        {
          name: 'vestingAccount';
          type: {
            option: 'publicKey';
          };
          index: false;
        },
        {
          name: 'tokenImported';
          type: 'bool';
          index: false;
        }
      ];
    },
    {
      name: 'IssueStaked';
      fields: [
        {
          name: 'issueStaker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueStakerTokenAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'stakedAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'rewardsMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueContributionLink';
          type: 'string';
          index: false;
        },
        {
          name: 'stakedAt';
          type: 'i64';
          index: false;
        },
        {
          name: 'prVotingPower';
          type: 'u64';
          index: false;
        }
      ];
    },
    {
      name: 'IssueUnstaked';
      fields: [
        {
          name: 'issueStaker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueStakerTokenAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'unstakedAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'rewardsMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'issueContributionLink';
          type: 'string';
          index: false;
        }
      ];
    },
    {
      name: 'PullRequestAccepted';
      fields: [
        {
          name: 'pullRequestAddr';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'repository';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'repositoryName';
          type: 'string';
          index: false;
        },
        {
          name: 'issue';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'repositoryCreator';
          type: 'publicKey';
          index: false;
        }
      ];
    },
    {
      name: 'VestingScheduleChanged';
      fields: [
        {
          name: 'repositoryAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'repositoryCreator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'oldVestingSchedule';
          type: {
            vec: {
              defined: 'Schedule';
            };
          };
          index: false;
        },
        {
          name: 'newVestingSchedule';
          type: {
            vec: {
              defined: 'Schedule';
            };
          };
          index: false;
        }
      ];
    },
    {
      name: 'DefaultVestingScheduleChanged';
      fields: [
        {
          name: 'numberOfSchedules';
          type: 'u32';
          index: false;
        },
        {
          name: 'perVestingAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'unixChange';
          type: 'u64';
          index: false;
        }
      ];
    },
    {
      name: 'PRVoted';
      fields: [
        {
          name: 'pullRequest';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'voteAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'voter';
          type: 'publicKey';
          index: false;
        }
      ];
    },
    {
      name: 'RewardClaimed';
      fields: [
        {
          name: 'rewardClaimmee';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'rewardAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'pullRequest';
          type: 'publicKey';
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'SignatureVerificationFailed';
      msg: 'Invalid Signature';
    },
    {
      code: 6001;
      name: 'UnauthorizedUser';
      msg: 'User not verified';
    },
    {
      code: 6002;
      name: 'InvalidNameRouter';
      msg: 'Invalid Name Router';
    },
    {
      code: 6003;
      name: 'TokenAccountMismatch';
      msg: 'Token account mismatch';
    },
    {
      code: 6004;
      name: 'InsufficientStakingFunds';
      msg: 'Insufficient funds for staking';
    },
    {
      code: 6005;
      name: 'IssueClosedAlready';
      msg: 'Cannot stake/unstake for a closed issue';
    },
    {
      code: 6006;
      name: 'HashesMismatch';
      msg: 'Commit hashes do not match for reward eligibility';
    },
    {
      code: 6007;
      name: 'AlreadyClaimed';
      msg: 'Tokens Already Claimed';
    },
    {
      code: 6008;
      name: 'ObjectiveClosedAlready';
      msg: 'Cannot stake/unstake on a closed objective';
    },
    {
      code: 6009;
      name: 'NoParentEntered';
      msg: 'Parent was not mentioned to which objective is to be added';
    },
    {
      code: 6010;
      name: 'RoadmapInvalidEndTime';
      msg: 'Roadmap end time before roadmap creation time';
    },
    {
      code: 6011;
      name: 'UnauthorizedPR';
      msg: "Can not add PR of somebody else's commits";
    },
    {
      code: 6012;
      name: 'MathOverflow';
      msg: 'Math overflow';
    },
    {
      code: 6013;
      name: 'MintMismatch';
      msg: 'Token Mint mismatch';
    },
    {
      code: 6014;
      name: 'VestingNotReachedRelease';
      msg: 'Vesting contract has not reached release time';
    },
    {
      code: 6015;
      name: 'PullRequestNotYetAccepted';
      msg: 'Pull request not yet accepted';
    },
    {
      code: 6016;
      name: 'CanNotMergePullRequest';
      msg: 'You are not authorized to merge this pull request';
    },
    {
      code: 6017;
      name: 'UnauthorizedActionAttempted';
      msg: 'Unauthorized smart contract Action';
    },
    {
      code: 6018;
      name: 'NoMoneyStakedOnIssue';
      msg: 'No money was staked on this issue, Still thanks for the support to the community';
    },
    {
      code: 6019;
      name: 'InsufficientFunds';
      msg: 'Insufficient funds';
    },
    {
      code: 6020;
      name: 'IncorrectMaths';
      msg: 'Incorrect Inputs for buy/sell given';
    },
    {
      code: 6021;
      name: 'IncorrectMetadataAccount';
      msg: 'Incorrect Metadata account provided';
    },
    {
      code: 6022;
      name: 'PullRequestVotingClosedAlready';
      msg: 'Cannot vote on a closed issue';
    },
    {
      code: 6023;
      name: 'CantAddObjectiveToSomebodiesRoadmap';
      msg: 'Unauthorized objective addition';
    },
    {
      code: 6024;
      name: 'CantEnterTimeBelowZero';
      msg: 'Cant enter time below 0';
    },
    {
      code: 6025;
      name: 'NoPRFound';
      msg: 'No PR on this issue to vote on';
    },
    {
      code: 6026;
      name: 'VotingPeriodEnded';
      msg: 'Voting period has ended';
    },
    {
      code: 6027;
      name: 'CantUnstakeAfterVoting';
      msg: "Can't unstake after voting";
    },
    {
      code: 6028;
      name: 'NoRepoTokenSpecified';
      msg: 'Either need to import to create a token';
    },
    {
      code: 6029;
      name: 'PullRequestAutoUpdate';
      msg: 'Pull request account not sent to auto charge votes';
    }
  ];
};

export const IDL: Defios = {
  version: '0.1.0',
  name: 'defios',
  constants: [
    {
      name: 'AUTHORIZED_PUBLIC_KEY',
      type: 'publicKey',
      value: 'pubkey ! ("55kBY9yxqSC42boV8PywT2gqGzgLi5MPAtifNRgPNezF")',
    },
    {
      name: 'MAX_INT',
      type: 'u128',
      value: 'u128 :: pow (2 , 64) - 1',
    },
    {
      name: 'VOTING_END',
      type: 'i64',
      value: '72 * 60 * 60',
    },
  ],
  instructions: [
    {
      name: 'createNameRouter',
      accounts: [
        {
          name: 'routerCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nameRouterAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'arg',
                type: 'string',
                path: 'signing_domain',
              },
              {
                kind: 'arg',
                type: 'u8',
                path: 'signature_version',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'router_creator',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'signingDomain',
          type: 'string',
        },
        {
          name: 'signatureVersion',
          type: 'u8',
        },
      ],
    },
    {
      name: 'addVerifiedUser',
      accounts: [
        {
          name: 'routerCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nameRouterAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'account',
                type: 'string',
                account: 'NameRouter',
                path: 'name_router_account.signing_domain',
              },
              {
                kind: 'account',
                type: 'u8',
                account: 'NameRouter',
                path: 'name_router_account.signature_version',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'router_creator',
              },
            ],
          },
        },
        {
          name: 'verifiedUserAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'arg',
                type: 'string',
                path: 'user_name',
              },
              {
                kind: 'arg',
                type: 'publicKey',
                path: 'user_pubkey',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'NameRouter',
                path: 'name_router_account',
              },
            ],
          },
        },
        {
          name: 'sysvarInstructions',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'userName',
          type: 'string',
        },
        {
          name: 'userPubkey',
          type: 'publicKey',
        },
        {
          name: 'msg',
          type: 'bytes',
        },
        {
          name: 'sig',
          type: {
            array: ['u8', 64],
          },
        },
      ],
    },
    {
      name: 'createRepository',
      accounts: [
        {
          name: 'repositoryCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'repositoryVerifiedUser',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'account',
                type: 'string',
                account: 'VerifiedUser',
                path: 'repository_verified_user.user_name',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'repository_creator',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'VerifiedUser',
                path: 'repository_verified_user.name_router',
              },
            ],
          },
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'arg',
                type: 'string',
                path: 'id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'repository_creator',
              },
            ],
          },
        },
        {
          name: 'vestingAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vesting',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
            ],
          },
        },
        {
          name: 'vestingTokenAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'repositoryCreatorTokenAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'defaultSchedule',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'isGodReal?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'DoULoveMe?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'SweetChick',
              },
            ],
          },
        },
        {
          name: 'metadata',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'rewardsMint',
          isMut: true,
          isSigner: false,
          isOptional: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Miners',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'MinerC',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
            ],
          },
        },
        {
          name: 'importedMint',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenMetadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'id',
          type: 'string',
        },
        {
          name: 'description',
          type: 'string',
        },
        {
          name: 'uri',
          type: 'string',
        },
        {
          name: 'tokenName',
          type: {
            option: 'string',
          },
        },
        {
          name: 'tokenImage',
          type: {
            option: 'string',
          },
        },
        {
          name: 'tokenMetadataUri',
          type: {
            option: 'string',
          },
        },
      ],
    },
    {
      name: 'addIssue',
      accounts: [
        {
          name: 'issueCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'issueVerifiedUser',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'account',
                type: 'string',
                account: 'VerifiedUser',
                path: 'issue_verified_user.user_name',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'issue_creator',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'VerifiedUser',
                path: 'issue_verified_user.name_router',
              },
            ],
          },
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account.repository_creator',
              },
            ],
          },
        },
        {
          name: 'issueAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issue',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Repository',
                path: 'repository_account.issue_index',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'issue_creator',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'uri',
          type: 'string',
        },
      ],
    },
    {
      name: 'stakeIssue',
      accounts: [
        {
          name: 'issueStaker',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'issueStakerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account.repository_creator',
              },
            ],
          },
        },
        {
          name: 'issueAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issue',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Issue',
                path: 'issue_account.index',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account.issue_creator',
              },
            ],
          },
        },
        {
          name: 'issueTokenPoolAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'issueStakerAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issuestaker',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'issue_staker',
              },
            ],
          },
        },
        {
          name: 'rewardsMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pullRequestMetadataAccount',
          isMut: false,
          isSigner: false,
          isOptional: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'pullrequestadded',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'PullRequest',
                path: 'pull_request_metadata_account.sent_by',
              },
            ],
          },
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'transferAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'unstakeIssue',
      accounts: [
        {
          name: 'issueStaker',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'issueStakerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account.repository_creator',
              },
            ],
          },
        },
        {
          name: 'issueAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issue',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Issue',
                path: 'issue_account.index',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account.issue_creator',
              },
            ],
          },
        },
        {
          name: 'issueTokenPoolAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'issueStakerAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issuestaker',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'issue_staker',
              },
            ],
          },
        },
        {
          name: 'rewardsMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'addCommit',
      accounts: [
        {
          name: 'repositoryAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account.repository_creator',
              },
            ],
          },
        },
        {
          name: 'issueAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issue',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Issue',
                path: 'issue_account.index',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account.issue_creator',
              },
            ],
          },
        },
        {
          name: 'commitCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'commitVerifiedUser',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'account',
                type: 'string',
                account: 'VerifiedUser',
                path: 'commit_verified_user.user_name',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'commit_creator',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'VerifiedUser',
                path: 'commit_verified_user.name_router',
              },
            ],
          },
        },
        {
          name: 'commitAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'commit',
              },
              {
                kind: 'arg',
                type: 'string',
                path: 'commit_hash',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'commit_creator',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'commitHash',
          type: 'string',
        },
        {
          name: 'treeHash',
          type: 'string',
        },
        {
          name: 'metadataUri',
          type: 'string',
        },
      ],
    },
    {
      name: 'claimReward',
      accounts: [
        {
          name: 'pullRequest',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'pullrequestadded',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'pull_request_creator',
              },
            ],
          },
        },
        {
          name: 'pullRequestCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pullRequestCreatorRewardAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rewardsMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'repositoryCreator',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'issueCreator',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'repository_creator',
              },
            ],
          },
        },
        {
          name: 'issueAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issue',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Issue',
                path: 'issue_account.index',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'issue_creator',
              },
            ],
          },
        },
        {
          name: 'issueTokenPoolAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'addRoadmapData',
      accounts: [
        {
          name: 'roadmapDataAdder',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'metadataAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'roadmapmetadataadd',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'roadmap_data_adder',
              },
            ],
          },
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account.repository_creator',
              },
            ],
          },
        },
        {
          name: 'roadmapVerifiedUser',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'account',
                type: 'string',
                account: 'VerifiedUser',
                path: 'roadmap_verified_user.user_name',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'roadmap_data_adder',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'VerifiedUser',
                path: 'roadmap_verified_user.name_router',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'roadmapTitle',
          type: 'string',
        },
        {
          name: 'roadmapDescriptionLink',
          type: 'string',
        },
        {
          name: 'roadmapImageUrl',
          type: 'string',
        },
        {
          name: 'roadmapOutlook',
          type: {
            defined: 'RoadmapOutlook',
          },
        },
      ],
    },
    {
      name: 'addObjectiveData',
      accounts: [
        {
          name: 'objectiveDataAddr',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'metadataAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'objectivedataadd',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'objective_issue',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'objective_data_addr',
              },
              {
                kind: 'arg',
                type: 'string',
                path: 'objective_id',
              },
            ],
          },
        },
        {
          name: 'objectiveIssue',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account.repository_creator',
              },
            ],
          },
        },
        {
          name: 'objectiveVerifiedUser',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'account',
                type: 'string',
                account: 'VerifiedUser',
                path: 'objective_verified_user.user_name',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'objective_data_addr',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'VerifiedUser',
                path: 'objective_verified_user.name_router',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'objectiveId',
          type: 'string',
        },
        {
          name: 'objectiveTitle',
          type: 'string',
        },
        {
          name: 'objectiveStartUnix',
          type: 'i64',
        },
        {
          name: 'objectiveEndUnix',
          type: {
            option: 'i64',
          },
        },
        {
          name: 'objectiveDescriptionLink',
          type: 'string',
        },
        {
          name: 'objectiveDeliverable',
          type: {
            defined: 'ObjectiveDeliverable',
          },
        },
      ],
    },
    {
      name: 'addChildObjective',
      accounts: [
        {
          name: 'childObjectiveAdder',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'roadmapMetadataAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'parentObjectiveAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'addPr',
      accounts: [
        {
          name: 'pullRequestAddr',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'issue',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pullRequestMetadataAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'pullrequestadded',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'pull_request_addr',
              },
            ],
          },
        },
        {
          name: 'pullRequestVerifiedUser',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'account',
                type: 'string',
                account: 'VerifiedUser',
                path: 'pull_request_verified_user.user_name',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'pull_request_addr',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'VerifiedUser',
                path: 'pull_request_verified_user.name_router',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'metadataUri',
          type: 'string',
        },
      ],
    },
    {
      name: 'addCommitToPr',
      accounts: [
        {
          name: 'commitAddr',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pullRequestMetadataAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'unlockTokens',
      accounts: [
        {
          name: 'repositoryCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'repositoryCreatorTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'account',
                type: 'string',
                account: 'Repository',
                path: 'repository_account.id',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'repository_creator',
              },
            ],
          },
        },
        {
          name: 'vestingAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vesting',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
            ],
          },
        },
        {
          name: 'vestingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'acceptPr',
      accounts: [
        {
          name: 'repositoryCreator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'pullRequestAddr',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'repository',
              },
              {
                kind: 'arg',
                type: 'string',
                path: 'repo_name',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'repository_creator',
              },
            ],
          },
        },
        {
          name: 'issue',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pullRequestMetadataAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'pullrequestadded',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'pull_request_addr',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'repoName',
          type: 'string',
        },
      ],
    },
    {
      name: 'changeVestingSchedule',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vestingSchedule',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'vesting',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'newVestingSchedule',
          type: {
            vec: {
              defined: 'Schedule',
            },
          },
        },
      ],
    },
    {
      name: 'createCommunalAccount',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communalDeposit',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'are_we_conscious',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'is love life ?  ',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'arewemadorinlove',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'rewards_mint',
              },
            ],
          },
        },
        {
          name: 'communalTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communalUsdcAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rewardsMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'usdcMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'buyTokens',
      accounts: [
        {
          name: 'buyer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communalDeposit',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'are_we_conscious',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'is love life ?  ',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'arewemadorinlove',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'rewards_mint',
              },
            ],
          },
        },
        {
          name: 'communalTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communalUsdcAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'buyerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'buyerUsdcAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rewardsMint',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Miners',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'MinerC',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
            ],
          },
        },
        {
          name: 'usdcMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'defaultSchedule',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'isGodReal?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'DoULoveMe?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'SweetChick',
              },
            ],
          },
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'usdcAmount',
          type: 'u64',
        },
        {
          name: 'numberOfTokens',
          type: 'u64',
        },
      ],
    },
    {
      name: 'sellTokens',
      accounts: [
        {
          name: 'seller',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communalDeposit',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'are_we_conscious',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'is love life ?  ',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'arewemadorinlove',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Mint',
                path: 'rewards_mint',
              },
            ],
          },
        },
        {
          name: 'communalTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communalUsdcAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'sellerTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'repositoryAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'sellerUsdcAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rewardsMint',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'Miners',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'MinerC',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository_account',
              },
            ],
          },
        },
        {
          name: 'usdcMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'defaultSchedule',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'isGodReal?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'DoULoveMe?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'SweetChick',
              },
            ],
          },
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'usdcAmount',
          type: 'u64',
        },
        {
          name: 'numberOfTokens',
          type: 'u64',
        },
      ],
    },
    {
      name: 'setDefaultSchedule',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'defaultSchedule',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'isGodReal?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'DoULoveMe?',
              },
              {
                kind: 'const',
                type: 'string',
                value: 'SweetChick',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'numberOfSchedules',
          type: 'u32',
        },
        {
          name: 'perVestingAmount',
          type: 'u64',
        },
        {
          name: 'unixChange',
          type: 'u64',
        },
      ],
    },
    {
      name: 'votePr',
      accounts: [
        {
          name: 'issueStaker',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'repository',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pullRequestMetadataAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'pullrequestadded',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'PullRequest',
                path: 'pull_request_metadata_account.sent_by',
              },
            ],
          },
        },
        {
          name: 'issueAccount',
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issue',
              },
              {
                kind: 'account',
                type: 'u64',
                account: 'Issue',
                path: 'issue_account.index',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Repository',
                path: 'repository',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account.issue_creator',
              },
            ],
          },
        },
        {
          name: 'issueStakerAccount',
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: 'const',
                type: 'string',
                value: 'issuestaker',
              },
              {
                kind: 'account',
                type: 'publicKey',
                account: 'Issue',
                path: 'issue_account',
              },
              {
                kind: 'account',
                type: 'publicKey',
                path: 'issue_staker',
              },
            ],
          },
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'nameRouter',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'signatureVersion',
            type: 'u8',
          },
          {
            name: 'totalVerifiedUsers',
            type: 'u64',
          },
          {
            name: 'routerCreator',
            type: 'publicKey',
          },
          {
            name: 'signingDomain',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'verifiedUser',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'nameRouter',
            type: 'publicKey',
          },
          {
            name: 'userName',
            type: 'string',
          },
          {
            name: 'userPubkey',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'repository',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'issueIndex',
            type: 'u64',
          },
          {
            name: 'nameRouter',
            type: 'publicKey',
          },
          {
            name: 'repositoryCreator',
            type: 'publicKey',
          },
          {
            name: 'rewardsMint',
            type: 'publicKey',
          },
          {
            name: 'id',
            type: 'string',
          },
          {
            name: 'description',
            type: 'string',
          },
          {
            name: 'uri',
            type: 'string',
          },
          {
            name: 'vestingSchedule',
            type: {
              option: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'defaultVestingSchedule',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'numberOfSchedules',
            type: 'u32',
          },
          {
            name: 'perVestingAmount',
            type: 'u64',
          },
          {
            name: 'unixChange',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'issue',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'index',
            type: 'u64',
          },
          {
            name: 'issueCreator',
            type: 'publicKey',
          },
          {
            name: 'repository',
            type: 'publicKey',
          },
          {
            name: 'commitIndex',
            type: 'u64',
          },
          {
            name: 'createdAt',
            type: 'u64',
          },
          {
            name: 'closedAt',
            type: {
              option: 'u64',
            },
          },
          {
            name: 'uri',
            type: 'string',
          },
          {
            name: 'firstPrTime',
            type: {
              option: 'i64',
            },
          },
        ],
      },
    },
    {
      name: 'vestingSchedule',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'destinationAddress',
            type: 'publicKey',
          },
          {
            name: 'mintAddress',
            type: 'publicKey',
          },
          {
            name: 'schedules',
            type: {
              vec: {
                defined: 'Schedule',
              },
            },
          },
        ],
      },
    },
    {
      name: 'commit',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'index',
            type: 'u64',
          },
          {
            name: 'commitCreator',
            type: 'publicKey',
          },
          {
            name: 'issue',
            type: 'publicKey',
          },
          {
            name: 'commitHash',
            type: 'string',
          },
          {
            name: 'treeHash',
            type: 'string',
          },
          {
            name: 'createdAt',
            type: 'u64',
          },
          {
            name: 'metadataUri',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'issueStaker',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'stakedAmount',
            type: {
              vec: 'u64',
            },
          },
          {
            name: 'issueStaker',
            type: 'publicKey',
          },
          {
            name: 'issue',
            type: 'publicKey',
          },
          {
            name: 'issueStakerTokenAccount',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'prVotingPower',
            type: 'u64',
          },
          {
            name: 'votedOn',
            type: {
              option: 'publicKey',
            },
          },
          {
            name: 'issueUnstakable',
            type: 'bool',
          },
          {
            name: 'hasVoted',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'pullRequest',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'sentBy',
            type: 'publicKey',
          },
          {
            name: 'commits',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'metadataUri',
            type: 'string',
          },
          {
            name: 'accepted',
            type: 'bool',
          },
          {
            name: 'totalVotedAmount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'roadMapMetaDataStore',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'roadmapTitle',
            type: 'string',
          },
          {
            name: 'roadmapCreationUnix',
            type: 'i64',
          },
          {
            name: 'roadmapCreatorId',
            type: 'publicKey',
          },
          {
            name: 'roadmapDescriptionLink',
            type: 'string',
          },
          {
            name: 'rootObjectiveIds',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'roadmapCreator',
            type: 'publicKey',
          },
          {
            name: 'roadmapOutlook',
            type: {
              defined: 'RoadmapOutlook',
            },
          },
          {
            name: 'roadmapImageUrl',
            type: 'string',
          },
          {
            name: 'roadmapRepository',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'objective',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'objectiveTitle',
            type: 'string',
          },
          {
            name: 'objectiveCreationUnix',
            type: 'i64',
          },
          {
            name: 'objectiveCreatorId',
            type: 'publicKey',
          },
          {
            name: 'objectiveStartUnix',
            type: 'i64',
          },
          {
            name: 'objectiveEndUnix',
            type: {
              option: 'i64',
            },
          },
          {
            name: 'objectiveDescriptionLink',
            type: 'string',
          },
          {
            name: 'objectiveState',
            type: {
              defined: 'ObjectiveState',
            },
          },
          {
            name: 'childrenObjectiveKeys',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'objectiveDeliverable',
            type: {
              defined: 'ObjectiveDeliverable',
            },
          },
          {
            name: 'objectiveIssue',
            type: 'publicKey',
          },
          {
            name: 'objectiveId',
            type: 'string',
          },
          {
            name: 'objectiveRepository',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'communalAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'Schedule',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'releaseTime',
            type: 'u64',
          },
          {
            name: 'amount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'ObjectiveState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Locked',
          },
          {
            name: 'InProgress',
          },
          {
            name: 'Closed',
          },
          {
            name: 'Deprecated',
          },
        ],
      },
    },
    {
      name: 'ObjectiveDeliverable',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Infrastructure',
          },
          {
            name: 'Tooling',
          },
          {
            name: 'Publication',
          },
          {
            name: 'Product',
          },
          {
            name: 'Other',
          },
        ],
      },
    },
    {
      name: 'RoadmapOutlook',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Next2',
          },
          {
            name: 'Next5',
          },
          {
            name: 'Plus5',
          },
          {
            name: 'LongTerm',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'PullRequestSent',
      fields: [
        {
          name: 'sentBy',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'commits',
          type: {
            vec: 'publicKey',
          },
          index: false,
        },
        {
          name: 'metadataUri',
          type: 'string',
          index: false,
        },
        {
          name: 'issue',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'pullRequest',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'AddCommitToPR',
      fields: [
        {
          name: 'commit',
          type: {
            vec: 'publicKey',
          },
          index: false,
        },
        {
          name: 'by',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'AddChildObjectiveEvent',
      fields: [
        {
          name: 'parentObjectiveAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'addedBy',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'objectives',
          type: {
            vec: 'publicKey',
          },
          index: false,
        },
      ],
    },
    {
      name: 'AddObjectiveDataEvent',
      fields: [
        {
          name: 'objectiveTitle',
          type: 'string',
          index: false,
        },
        {
          name: 'objectiveMetadataUri',
          type: 'string',
          index: false,
        },
        {
          name: 'objectiveStartUnix',
          type: 'i64',
          index: false,
        },
        {
          name: 'objectiveCreationUnix',
          type: 'i64',
          index: false,
        },
        {
          name: 'objectiveEndUnix',
          type: {
            option: 'i64',
          },
          index: false,
        },
        {
          name: 'objectiveDeliverable',
          type: {
            defined: 'ObjectiveDeliverable',
          },
          index: false,
        },
        {
          name: 'objectivePublicKey',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'objectiveIssue',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'objectiveAddr',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'childObjectives',
          type: {
            vec: 'publicKey',
          },
          index: false,
        },
      ],
    },
    {
      name: 'AddRoadmapDataEvent',
      fields: [
        {
          name: 'roadmapTitle',
          type: 'string',
          index: false,
        },
        {
          name: 'roadmapDescriptionLink',
          type: 'string',
          index: false,
        },
        {
          name: 'roadmapCreationUnix',
          type: 'u64',
          index: false,
        },
        {
          name: 'roadmapCreator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'rootObjectiveIds',
          type: {
            vec: 'publicKey',
          },
          index: false,
        },
        {
          name: 'roadmapOutlook',
          type: {
            defined: 'RoadmapOutlook',
          },
          index: false,
        },
        {
          name: 'roadmapImageUrl',
          type: 'string',
          index: false,
        },
        {
          name: 'roadmap',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'roadmapRepository',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'NameRouterCreated',
      fields: [
        {
          name: 'routerCreator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nameRouterAccount',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'VerifiedUserAdded',
      fields: [
        {
          name: 'routerCreator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nameRouterAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'verifiedUserAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'userName',
          type: 'string',
          index: false,
        },
        {
          name: 'userPubkey',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'CommitAdded',
      fields: [
        {
          name: 'commitCreator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'commitAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'metadataUri',
          type: 'string',
          index: false,
        },
      ],
    },
    {
      name: 'IssueCreated',
      fields: [
        {
          name: 'issueCreator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'repositoryAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'uri',
          type: 'string',
          index: false,
        },
      ],
    },
    {
      name: 'RepositoryCreated',
      fields: [
        {
          name: 'repositoryCreator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'repositoryAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'rewardsMint',
          type: {
            option: 'publicKey',
          },
          index: false,
        },
        {
          name: 'uri',
          type: 'string',
          index: false,
        },
        {
          name: 'id',
          type: 'string',
          index: false,
        },
        {
          name: 'description',
          type: 'string',
          index: false,
        },
        {
          name: 'tokenName',
          type: {
            option: 'string',
          },
          index: false,
        },
        {
          name: 'tokenSymbol',
          type: {
            option: 'string',
          },
          index: false,
        },
        {
          name: 'tokenMetadataUri',
          type: {
            option: 'string',
          },
          index: false,
        },
        {
          name: 'vestingAccount',
          type: {
            option: 'publicKey',
          },
          index: false,
        },
        {
          name: 'tokenImported',
          type: 'bool',
          index: false,
        },
      ],
    },
    {
      name: 'IssueStaked',
      fields: [
        {
          name: 'issueStaker',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueStakerTokenAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'stakedAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'rewardsMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueContributionLink',
          type: 'string',
          index: false,
        },
        {
          name: 'stakedAt',
          type: 'i64',
          index: false,
        },
        {
          name: 'prVotingPower',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'IssueUnstaked',
      fields: [
        {
          name: 'issueStaker',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueStakerTokenAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'unstakedAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'rewardsMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'issueContributionLink',
          type: 'string',
          index: false,
        },
      ],
    },
    {
      name: 'PullRequestAccepted',
      fields: [
        {
          name: 'pullRequestAddr',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'repository',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'repositoryName',
          type: 'string',
          index: false,
        },
        {
          name: 'issue',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'repositoryCreator',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'VestingScheduleChanged',
      fields: [
        {
          name: 'repositoryAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'repositoryCreator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'oldVestingSchedule',
          type: {
            vec: {
              defined: 'Schedule',
            },
          },
          index: false,
        },
        {
          name: 'newVestingSchedule',
          type: {
            vec: {
              defined: 'Schedule',
            },
          },
          index: false,
        },
      ],
    },
    {
      name: 'DefaultVestingScheduleChanged',
      fields: [
        {
          name: 'numberOfSchedules',
          type: 'u32',
          index: false,
        },
        {
          name: 'perVestingAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'unixChange',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'PRVoted',
      fields: [
        {
          name: 'pullRequest',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'voteAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'voter',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'RewardClaimed',
      fields: [
        {
          name: 'rewardClaimmee',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'rewardAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'pullRequest',
          type: 'publicKey',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'SignatureVerificationFailed',
      msg: 'Invalid Signature',
    },
    {
      code: 6001,
      name: 'UnauthorizedUser',
      msg: 'User not verified',
    },
    {
      code: 6002,
      name: 'InvalidNameRouter',
      msg: 'Invalid Name Router',
    },
    {
      code: 6003,
      name: 'TokenAccountMismatch',
      msg: 'Token account mismatch',
    },
    {
      code: 6004,
      name: 'InsufficientStakingFunds',
      msg: 'Insufficient funds for staking',
    },
    {
      code: 6005,
      name: 'IssueClosedAlready',
      msg: 'Cannot stake/unstake for a closed issue',
    },
    {
      code: 6006,
      name: 'HashesMismatch',
      msg: 'Commit hashes do not match for reward eligibility',
    },
    {
      code: 6007,
      name: 'AlreadyClaimed',
      msg: 'Tokens Already Claimed',
    },
    {
      code: 6008,
      name: 'ObjectiveClosedAlready',
      msg: 'Cannot stake/unstake on a closed objective',
    },
    {
      code: 6009,
      name: 'NoParentEntered',
      msg: 'Parent was not mentioned to which objective is to be added',
    },
    {
      code: 6010,
      name: 'RoadmapInvalidEndTime',
      msg: 'Roadmap end time before roadmap creation time',
    },
    {
      code: 6011,
      name: 'UnauthorizedPR',
      msg: "Can not add PR of somebody else's commits",
    },
    {
      code: 6012,
      name: 'MathOverflow',
      msg: 'Math overflow',
    },
    {
      code: 6013,
      name: 'MintMismatch',
      msg: 'Token Mint mismatch',
    },
    {
      code: 6014,
      name: 'VestingNotReachedRelease',
      msg: 'Vesting contract has not reached release time',
    },
    {
      code: 6015,
      name: 'PullRequestNotYetAccepted',
      msg: 'Pull request not yet accepted',
    },
    {
      code: 6016,
      name: 'CanNotMergePullRequest',
      msg: 'You are not authorized to merge this pull request',
    },
    {
      code: 6017,
      name: 'UnauthorizedActionAttempted',
      msg: 'Unauthorized smart contract Action',
    },
    {
      code: 6018,
      name: 'NoMoneyStakedOnIssue',
      msg: 'No money was staked on this issue, Still thanks for the support to the community',
    },
    {
      code: 6019,
      name: 'InsufficientFunds',
      msg: 'Insufficient funds',
    },
    {
      code: 6020,
      name: 'IncorrectMaths',
      msg: 'Incorrect Inputs for buy/sell given',
    },
    {
      code: 6021,
      name: 'IncorrectMetadataAccount',
      msg: 'Incorrect Metadata account provided',
    },
    {
      code: 6022,
      name: 'PullRequestVotingClosedAlready',
      msg: 'Cannot vote on a closed issue',
    },
    {
      code: 6023,
      name: 'CantAddObjectiveToSomebodiesRoadmap',
      msg: 'Unauthorized objective addition',
    },
    {
      code: 6024,
      name: 'CantEnterTimeBelowZero',
      msg: 'Cant enter time below 0',
    },
    {
      code: 6025,
      name: 'NoPRFound',
      msg: 'No PR on this issue to vote on',
    },
    {
      code: 6026,
      name: 'VotingPeriodEnded',
      msg: 'Voting period has ended',
    },
    {
      code: 6027,
      name: 'CantUnstakeAfterVoting',
      msg: "Can't unstake after voting",
    },
    {
      code: 6028,
      name: 'NoRepoTokenSpecified',
      msg: 'Either need to import to create a token',
    },
    {
      code: 6029,
      name: 'PullRequestAutoUpdate',
      msg: 'Pull request account not sent to auto charge votes',
    },
  ],
};
