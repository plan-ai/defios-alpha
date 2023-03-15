import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button/button';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import TagsDropDown from '@/components/ui/tags/tags-dropdown';
import GithubTags from '@/components/ui/tags/github-tags';
import RepoChooseModal from '@/components/issues/repo-choose-modal';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import axios from 'axios';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { onLoading, onSuccess, onFailure } from '@/store/callLoaderSlice';
import { useSession } from 'next-auth/react';
import { useDrawer } from '@/components/drawer-views/context';
import { createIssue } from '@/lib/helpers/contractInteract';
import { selectUserMapping } from '@/store/userMappingSlice';
import { PublicKey } from '@solana/web3.js';

export default function RightSideIssues({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { closeDrawer } = useDrawer();
  const userMappingState = useAppSelector(selectUserMapping);

  const [tags, setTags] = useState<string[]>([]);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const wallet = useWallet();

  const handleTagSet = (tag: string) => {
    const newTags = [...tags, tag];
    setTags(newTags);
  };
  const handleTagRemove = (tag: string) => {
    const newTags = tags.filter((_tag) => {
      return _tag !== tag;
    });
    setTags(newTags);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [repo, setRepo] = useState<any>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(modalContainerRef, () => {
    setModalOpen(false);
  });
  useLockBodyScroll(modalOpen);

  const handleCreateIssue = async () => {
    if (repo === null || issueTitle === '' || repo?.project_url === '') return;
    if ((session as any).accessToken) {
      console.log(repo)
      const ownerRepo = repo?.project_name
      dispatch(onLoading('Creating the Issue on Github...'));

      const data = JSON.stringify({
        title: issueTitle,
        body: issueDescription,
        labels: tags,
      });

      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.github.com/repos/${ownerRepo}/issues`,
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          createIssue(
            wallet.publicKey as PublicKey,
            res.data?.html_url,
            new PublicKey(repo.account),
            new PublicKey(userMappingState.userMapping?.verifiedUserAccount as string)
          )
            .then((res) => {
              dispatch(
                onSuccess({
                  label: 'Issue Creation Successful',
                  description: 'Check out the Issue you created',
                  buttonText: 'Browse Issues',
                  redirect: null,
                  link: `https://solscan.io/account/${res.toString()}?cluster=devnet`,
                })
              );
              closeDrawer();
            })
            .catch((err) => {
              dispatch(
                onFailure({
                  label: 'Issue Creation Failed',
                  description: err.message,
                  redirect: null,
                  buttonText: 'Continue',
                  link: '',
                })
              );
              closeDrawer();
            });
        })
        .catch((err) => {
          dispatch(
            onFailure({
              label: 'Issue Creation Failed',
              description: err.message,
              redirect: null,
              buttonText: 'Continue',
              link: '',
            })
          );
          closeDrawer();
        });
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 z-20 h-full w-96 border-l border-dashed border-gray-700 bg-dark pt-5 shadow-xl">
        <Scrollbar style={{ height: 'calc(100%)' }}>
          <div className="relative z-20 h-screen pb-5">
            <div className="flex h-full flex-col overflow-x-hidden px-5 pb-32">
              <Button
                onClick={() => setModalOpen(true)}
                className="my-2 w-full"
                shape="rounded"
                color={repo !== null ? 'success' : 'primary'}
              >
                {repo !== null && (
                  <div className="flex items-center">
                    <Image
                      src={repo?.token_url || ''}
                      alt="token"
                      width={24}
                      height={24}
                    />
                    <div className="ml-2 text-sm">{repo?.project_name}</div>
                  </div>
                )}
                {repo === null && <div>Choose your Project</div>}
              </Button>
              <Input
                placeholder="Issue Title"
                type="text"
                className="my-2 w-full"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
              />
              <Textarea
                className="my-2 w-full"
                placeholder="Issue Description"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
              />
              <div className="my-2 flex w-full">
                <div className="mr-2">Tags: </div>
                <TagsDropDown handleTagSet={handleTagSet} tags={tags} />
              </div>
              {tags.length !== 0 && (
                <div className="my-2 flex w-full flex-wrap">
                  {tags.map((tag, idx) => (
                    <GithubTags
                      tag={tag}
                      assign={true}
                      handleRemove={handleTagRemove}
                      key={idx}
                    />
                  ))}
                </div>
              )}
              <Button
                onClick={handleCreateIssue}
                className="my-2 mb-5 w-full"
                shape="rounded"
                color="info"
              >
                Create Issue
              </Button>
              <div className="flex w-full flex-row items-center ">
                <Input
                  placeholder="Amount"
                  type="number"
                  className="my-2 w-full"
                  inputClassName="!h-10"
                />
                <div className="ml-2 flex h-full items-center gap-1">
                  <Button size="mini" shape="rounded">
                    50%
                  </Button>
                  <Button size="mini" shape="rounded">
                    100%
                  </Button>
                </div>
              </div>
              <Button className="my-2 w-full" shape="rounded">
                Approve DIC Spend
              </Button>
              <Button className="my-2 w-full" shape="rounded" color="success">
                Stake DIC
              </Button>
            </div>
          </div>
        </Scrollbar>
        {wallet.publicKey === null && (
          <div className="absolute top-0 left-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center gap-5 rounded-lg border-2 border-white bg-dark p-5 text-lg shadow-2xl">
              <Image src={ErrorDarkImage} className="w-52" alt="404 Error" />
              <div>Connect Wallet to Continue</div>
              <WalletMultiButton className="rounded-full bg-blue-500" />
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative inset-0 z-50 h-screen w-screen overflow-y-auto overflow-x-hidden bg-gray-700 bg-opacity-60 p-4 text-center backdrop-blur xs:p-5"
          >
            <span
              className="inline-block h-full align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              ref={modalContainerRef}
              className="inline-block text-left align-middle"
            >
              <RepoChooseModal
                modalOpen={modalOpen}
                repo={repo}
                setModalOpen={setModalOpen}
                setRepo={setRepo}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
