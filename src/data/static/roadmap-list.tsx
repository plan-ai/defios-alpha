import { StaticImageData } from 'next/dist/client/image';
import CreatorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';
import NFT2 from '@/assets/images/nft/nft-2.jpg';
import NFT3 from '@/assets/images/nft/nft-3.jpg';
import NFT4 from '@/assets/images/nft/nft-4.jpg';

export type roadmapListType = {
  creator: string;
  creatorImage: StaticImageData;
  image: StaticImageData;
  name: string;
  creationDate: string;
  totalStake: string;
  details: detailsType | undefined;
};
export type detailsType = {
  details: detailsTabType;
  preRequisites: preRequisitesType[];
};
export type detailsTabType = {
  description: string;
  topContributor: string;
  tags: string[];
  timeframe: string;
  stakerIncentive: string;
  raisedAmount: number;
  toBeRaised: number;
};
export type preRequisitesType = {
  title: string;
  name: string;
  dueDate: string;
  amountDone: string;
  amountOutOf: string;
  coin: string;
  status: string;
};

export const RoadmapList = [
  {
    creator: 'AbhisekBasu1',
    creatorImage: CreatorImage,
    image: NFT1,
    name: 'DefiOS',
    creationDate: '09-02-2023',
    totalStake: '250$',
    details: {
      details: {
        description: 'Roadmap states the working tree of DefiOS',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'AbhisekBasu1',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'DOS',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'AbhisekBasu1',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'DOS',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'AbhisekBasu1',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'DOS',
          status: 'not started',
        },
      ],
    },
  },
  {
    creator: 'never2average',
    creatorImage: CreatorImage,
    image: NFT2,
    name: 'OnFinance',
    creationDate: '09-02-2023',
    totalStake: '400$',
    details: {
      details: {
        description: 'Roadmap states the working tree of OnFinance',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'never2average',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'OFC',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'never2average',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'OFC',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'never2average',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'OFC',
          status: 'not started',
        },
      ],
    },
  },
  {
    creator: 'Rohitkk432',
    creatorImage: CreatorImage,
    image: NFT3,
    name: 'MusicProX',
    creationDate: '09-02-2023',
    totalStake: '200$',
    details: {
      details: {
        description: 'Roadmap states the working tree of MusicProX',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'Rohitkk432',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'MPX',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'Rohitkk432',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'MPX',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'Rohitkk432',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'MPX',
          status: 'not started',
        },
      ],
    },
  },
  {
    creator: 'never2average',
    creatorImage: CreatorImage,
    image: NFT4,
    name: 'DefiOS Core',
    creationDate: '09-02-2023',
    totalStake: '200$',
    details: {
      details: {
        description: 'Roadmap states the working tree of DefiOS Core',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'never2average',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'DOS',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'never2average',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'DOS',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'never2average',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'DOS',
          status: 'not started',
        },
      ],
    },
  },
  {
    creator: 'never2average',
    creatorImage: CreatorImage,
    image: NFT2,
    name: 'DefiOS Rust',
    creationDate: '09-02-2023',
    totalStake: '100$',
    details: {
      details: {
        description: 'Roadmap states the working tree of DefiOS Rust',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'never2average',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'DOS',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'never2average',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'DOS',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'never2average',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'DOS',
          status: 'not started',
        },
      ],
    },
  },
  {
    creator: 'Rohitkk432',
    creatorImage: CreatorImage,
    image: NFT4,
    name: 'FitBro',
    creationDate: '09-02-2023',
    totalStake: '100$',
    details: {
      details: {
        description: 'Roadmap states the working tree of FitBro',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'Rohitkk432',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'FTB',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'Rohitkk432',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'FTB',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'Rohitkk432',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'FTB',
          status: 'not started',
        },
      ],
    },
  },
  {
    creator: 'Rohitkk432',
    creatorImage: CreatorImage,
    image: NFT3,
    name: 'Anime NFTs',
    creationDate: '09-02-2023',
    totalStake: '100$',
    details: {
      details: {
        description: 'Roadmap states the working tree of Anime NFTs',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'Rohitkk432',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'ANFT',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'Rohitkk432',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'ANFT',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'Rohitkk432',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'ANFT',
          status: 'not started',
        },
      ],
    },
  },
  {
    creator: 'Rohitkk432',
    creatorImage: CreatorImage,
    image: NFT1,
    name: 'Buildoor',
    creationDate: '09-02-2023',
    totalStake: '100$',
    details: {
      details: {
        description: 'Roadmap states the working tree of Buildoor',
        topContributor: 'Rohitkk432',
        tags: ['urgent', 'help wanted'],
        timeframe: '2 Feb 2023 - 14 March 2023',
        stakerIncentive: '50',
        raisedAmount: 20,
        toBeRaised: 100,
      },
      preRequisites: [
        {
          title: 'prereq1',
          name: 'Rohitkk432',
          dueDate: '12/3/2023',
          amountDone: '12',
          amountOutOf: '24',
          coin: 'BLDR',
          status: 'in progress',
        },
        {
          title: 'prereq2',
          name: 'Rohitkk432',
          dueDate: '12/2/2023',
          amountDone: '10',
          amountOutOf: '32',
          coin: 'BLDR',
          status: 'completed',
        },
        {
          title: 'prereq3',
          name: 'Rohitkk432',
          dueDate: '12/5/2023',
          amountDone: '8',
          amountOutOf: '42',
          coin: 'BLDR',
          status: 'not started',
        },
      ],
    },
  },
];
