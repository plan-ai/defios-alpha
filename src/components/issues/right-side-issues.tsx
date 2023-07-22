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

import axios from '@/lib/axiosClient';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { setRefetch } from '@/store/refetchSlice';
import { onLoading, onSuccess, onFailure } from '@/store/callLoaderSlice';
import { useSession } from 'next-auth/react';
import { useDrawer } from '@/components/drawer-views/context';
import { createIssue } from '@/lib/helpers/contractInteract';
import { selectUserMapping } from '@/store/userMappingSlice';
import { PublicKey } from '@solana/web3.js';

import mixpanel from 'mixpanel-browser';

export default function RightSideIssues({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { closeDrawer } = useDrawer();
  const userMappingState = useAppSelector(selectUserMapping);
  let userMappingIsLoading = useAppSelector(
    (state) => state.userMapping.isLoading
  );
  let userMappingIsError = useAppSelector((state) => state.userMapping.isError);

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
  const callPopupState = useAppSelector((state) => state.callLoader.callState);
  useClickAway(modalContainerRef, () => {
    if (callPopupState === 'none') {
      setModalOpen(false);
    }
  });
  useLockBodyScroll(modalOpen);

  const handleCreateIssue = async () => {
    if (repo === null || issueTitle === '' || repo?.project_url === '') return;
    if ((session as any).accessToken) {
      const repo_id = repo?.project_github_id;
      dispatch(onLoading('Creating the Issue on Github...'));

      const data = JSON.stringify({
        title: issueTitle,
        body: issueDescription,
        labels: tags,
      });

      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.github.com/repositories/${repo_id}/issues`,
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config)
        .then((resp) => {
          let resCalled = false;
          createIssue(
            wallet.publicKey as PublicKey,
            resp.data?.html_url,
            new PublicKey(repo.account),
            new PublicKey(
              userMappingState.userMapping?.verifiedUserAccount as string
            ),
            new PublicKey(repo.token_address)
          )
            .then((res) => {
              resCalled = true;
              dispatch(
                onSuccess({
                  label: 'Issue Creation Successful',
                  description: 'Check out the Issue you created',
                  redirect: null,
                  link: `https://solscan.io/account/${res.toString()}?cluster=devnet`,
                })
              );
              mixpanel.track('Issue Creation Success', {
                github_id: userMappingState.userMapping?.userName,
                user_pubkey: userMappingState.userMapping?.userPubkey,
                tx_link: `https://solscan.io/account/${res.toString()}?cluster=devnet`,
                issue_github_url: resp.data?.html_url,
                token_address: repo.token_address,
                repo_account: repo.account,
                repo_github_id: repo.project_github_id,
                repo_github_link: repo.project_url,
              });
              dispatch(setRefetch('issue'));
              closeDrawer();
            })
            .catch((err) => {
              resCalled = true;
              dispatch(
                onFailure({
                  label: 'Issue Creation Failed',
                  description: err.message,
                  redirect: null,
                  link: '',
                })
              );
              mixpanel.track('Issue Creation Failed', {
                github_id: userMappingState.userMapping?.userName,
                user_pubkey: userMappingState.userMapping?.userPubkey,
                error: err.message,
              });
              closeDrawer();
            })
            .finally(() => {
              if (!resCalled) {
                dispatch(
                  onSuccess({
                    label: 'Issue Creation Successful',
                    description: '',
                    redirect: null,
                    link: '',
                  })
                );
                mixpanel.track('Issue Creation Success', {
                  github_id: userMappingState.userMapping?.userName,
                  user_pubkey: userMappingState.userMapping?.userPubkey,
                });
                dispatch(setRefetch('issue'));
                closeDrawer();
              }
            });
        })
        .catch((err) => {
          dispatch(
            onFailure({
              label: 'Issue Creation Failed',
              description: err.message,
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('Issue Creation GH Failed', {
            github_id: userMappingState.userMapping?.userName,
            user_pubkey: userMappingState.userMapping?.userPubkey,
            error: err.messagem,
          });
          closeDrawer();
        });
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 z-20 h-full w-[18.25rem] border-l border-dashed border-gray-700 bg-dark pt-5 shadow-xl xl:w-[20.25rem] 2xl:w-[22.75rem] 3xl:w-[24rem]">
        <Scrollbar style={{ height: 'calc(100%)' }}>
          <div className="relative z-20 h-screen pb-5">
            <div className="flex h-full flex-col overflow-x-hidden px-5 pb-32">
              <Button
                onClick={() => setModalOpen(true)}
                className="my-2 w-full !text-2xs lg:!text-xs 2xl:!text-sm"
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
                      className="rounded-full"
                    />
                    <div className="ml-2">{repo?.project_name}</div>
                  </div>
                )}
                {repo === null && <div>Choose your Project</div>}
              </Button>
              <Input
                placeholder="Issue Title"
                type="text"
                className="my-2 w-full text-2xs lg:text-xs 2xl:text-sm"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
              />
              <Textarea
                className="my-2 w-full"
                placeholder="Issue Description"
                inputClassName="text-2xs lg:text-xs 2xl:text-sm"
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
                className="my-2 mb-5 w-full !text-2xs lg:!text-xs 2xl:!text-sm"
                shape="rounded"
                color="info"
              >
                Create Issue
              </Button>
            </div>
          </div>
        </Scrollbar>
        {(userMappingIsLoading ||
          userMappingIsError ||
          wallet.publicKey === null) && (
          <div className="absolute top-0 left-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-white bg-dark p-3 text-center text-lg text-xs shadow-2xl xl:p-4 xl:text-sm 3xl:p-5 3xl:text-base ">
              <Image src={ErrorDarkImage} className="w-52" alt="404 Error" />
              <div>
                {wallet.publicKey === null
                  ? 'Connect Wallet to Continue'
                  : userMappingIsLoading
                  ? 'Loading...'
                  : 'Connected to Authorized Wallet which is mapped to your Github on DefiOS'}
              </div>
              <WalletMultiButton className="rounded-full bg-new-blue" />
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
