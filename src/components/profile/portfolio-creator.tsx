import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button/button';
import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import { useCopyToClipboard } from 'react-use';
import { Refresh } from '@/components/icons/refresh';
import axios from 'axios';
import { useAppSelector } from '@/store/store';

interface PortfolioCreatorProps {
  isGenerated: boolean;
  portfolioType: string;
}

const PortfolioCreator: React.FC<PortfolioCreatorProps> = ({
  isGenerated,
  portfolioType,
}) => {
  const [generatedLink, setGeneratedLink] = useState('');
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(generatedLink);
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }
  const [status, setStatus] = useState(isGenerated);
  const [generateTrigger, setGenerateTrigger] = useState(0);

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === '' || generateTrigger === 0)
      return;
    axios
      .post(
        `https://api-v1.defi-os.com/profile/portfolio?website_type=${portfolioType.toLowerCase()}`,
        {
          headers: {
            Authorization: firebase_jwt,
          },
        }
      )
      .then((res) => {
        setGeneratedLink(res.data.link);
        setStatus(true);
      })
      .catch((err) => console.log(err));
  }, [generateTrigger, firebase_jwt, portfolioType]);

  return (
    <>
      {!status && (
        <Button
          onClick={() => setGenerateTrigger((state) => state + 1)}
          shape="rounded"
          size="small"
          className="mt-5 w-full"
        >
          Generate
        </Button>
      )}
      {status && (
        <div className="mt-5 flex flex-row items-center justify-center">
          <div className="flex h-9 w-[90%] items-center rounded-full bg-light-dark shadow-card">
            <div className="text truncate text-ellipsis bg-center pl-4 text-xs text-gray-300 sm:text-sm">
              {generatedLink}
            </div>
            <div
              title="Copy Address"
              className="ml-auto flex cursor-pointer items-center px-4 text-gray-300 transition hover:text-white"
              onClick={() => handleCopyToClipboard()}
            >
              {copyButtonStatus ? (
                <Check className="h-auto w-3.5 text-green-500" />
              ) : (
                <Copy className="h-auto w-3.5" />
              )}
            </div>
          </div>
          <Refresh
            onClick={() => setGenerateTrigger((state) => state + 1)}
            className="ml-2 h-5 w-5"
          />
        </div>
      )}
    </>
  );
};

export default PortfolioCreator;
