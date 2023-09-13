import React, { useState, useEffect } from 'react';
import ContributionsHistoryCard from '@/components/profile/contributions-history-card';
// static data
import { useAppSelector } from '@/store/store';
import axios from '@/lib/axiosClient';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import Image from 'next/image';
import Spinner from '@/components/custom/spinner';

interface ContributionsHistoryProps {}

const ContributionsHistory: React.FC<ContributionsHistoryProps> = ({}) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const firebase_jwt = useAppSelector(
    (state) => state.firebaseTokens.firebaseTokens.auth_creds
  );

  useEffect(() => {
    if (firebase_jwt === null || firebase_jwt === '') return;
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/profile/contributions`, {
        headers: {
          Authorization: firebase_jwt,
        },
      })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  }, [firebase_jwt]);

  return (
    <div className="block">
      <div className="space-y-4 md:space-y-5 xl:space-y-6">
        {!isLoading &&
          data.length !== 0 &&
          data?.map((item: any, idx: number) => (
            <ContributionsHistoryCard item={item} key={idx} />
          ))}
        {!isLoading && data.length === 0 && (
          <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
            <Image src={ErrorDarkImage} className="w-80" alt="404 Error" />
            <div className="text-lg text-gray-500">
              No Data available on your Contributions.
            </div>
          </div>
        )}
        {isLoading && (
          <div className="mt-10 flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionsHistory;
