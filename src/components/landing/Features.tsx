import React from 'react';
import {
  CurrencyDollarIcon,
  LightBulbIcon,
  GlobeAsiaAustraliaIcon,
  PlusCircleIcon,
  FaceSmileIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface FeatureCardProps {
  body: string;
  title: string;
  element: any;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ body, title, element }) => {
  return (
    <div className="flex w-[21rem] flex-col items-start justify-center gap-4 rounded-2xl bg-gray-900 p-6 shadow-xl xl:w-[23rem] xl:p-7 3xl:w-[25rem] 3xl:p-8">
      <div className="flex h-10 w-10 items-center justify-start pr-2">
        {element}
      </div>
      <div className="text-base text-white xl:text-lg 3xl:text-xl">{title}</div>
      <div className="whitespace-pre text-base text-gray-400 xl:text-lg 3xl:text-xl">
        {body}
      </div>
    </div>
  );
};

interface FeaturesProps {}

export const Features: React.FC<FeaturesProps> = ({}) => {
  return (
    <div className="z-[20] flex w-screen flex-col items-center justify-center gap-5 bg-[#0E1320] py-32">
      <div className="text-center text-4xl font-black tracking-tight text-white 2xl:text-5xl">
        open source software suffers
        <br /> from a lack of funding
      </div>
      <div className="text-lg text-gray-400 xl:text-xl 3xl:text-2xl">
        defiOS makes it easy to fund them all
      </div>
      <div className="mb-2 flex w-full flex-wrap items-center justify-center gap-5 xl:gap-6 3xl:gap-8">
        <FeatureCard
          element={<CurrencyDollarIcon className="h-10 w-10 text-indigo-300" />}
          title={'earn for your contributions'}
          body={'solve issues, get paid in \nUSDC and/or tokens \ndirectly.'}
        />
        <FeatureCard
          element={<LightBulbIcon className="h-10 w-10 text-indigo-300" />}
          title={'prioritize any feature request'}
          body={
            'want a new feature or a \nnagging bug fixed? Simply \nstake tokens or USDC on it'
          }
        />
        <FeatureCard
          element={
            <GlobeAsiaAustraliaIcon className="h-10 w-10 text-indigo-300" />
          }
          title={'built for the future of work'}
          body={
            'work on your favourite \nsoftware from anywhere in \nthe world and get paid for it'
          }
        />
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-5 xl:gap-6 3xl:gap-8">
        <FeatureCard
          element={<PlusCircleIcon className="h-10 w-10 text-indigo-300" />}
          title={'tokenize your repositories '}
          body={
            'transform early contributors \nto high-conviction holders by \nrewarding them with tokens.'
          }
        />
        <FeatureCard
          element={<FaceSmileIcon className="h-10 w-10 text-indigo-300" />}
          title={'build what the people want'}
          body={
            'know the priority of issues \nand features by the amount \nstaked on them'
          }
        />
        <FeatureCard
          element={<DocumentTextIcon className="h-10 w-10 text-indigo-300" />}
          title={'learn by building in public'}
          body={
            'defiOS Learn’s AI suggests \nissues based on exactly what \nyou’re learning'
          }
        />
      </div>
    </div>
  );
};

export default Features;
