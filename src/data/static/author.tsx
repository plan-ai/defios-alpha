import CoverImage from '@/assets/images/profile-cover.jpg';
import AuthorImage from '@/assets/images/author.jpg';
import { Instagram } from '@/components/icons/brands/instagram';
import { Twitter } from '@/components/icons/brands/twitter';
import { Facebook } from '@/components/icons/brands/facebook';
import { Bitcoin } from '@/components/icons/bitcoin';
import { Ethereum } from '@/components/icons/ethereum';
import { Tether } from '@/components/icons/tether';
import { Bnb } from '@/components/icons/bnb';
import { Usdc } from '@/components/icons/usdc';
import { Cardano } from '@/components/icons/cardano';
import { Doge } from '@/components/icons/doge';

export const authorData = {
  id: 157896,
  name: 'Spy Thirtythree',
  user_name: 'Cameronwilliamson',
  wallet_key:
    '0x9Af568442868356c7aE834A47614600002545476555555555772d9F5B87e9b',
  created_at: 'November 2021',
  cover_image: {
    id: 1,
    thumbnail: CoverImage,
    original: CoverImage,
  },
  avatar: {
    id: 1,
    thumbnail: AuthorImage,
    original: AuthorImage,
  },
  bio: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.',
  issuesSolved: '92',
  issuesCreated: '20',
  coins: [
    {
      id: 1,
      element: <Bitcoin />,
    },
    {
      id: 2,
      element: <Ethereum />,
    },
    {
      id: 3,
      element: <Tether />,
    },
    {
      id: 4,
      element: <Bnb />,
    },
    {
      id: 5,
      element: <Usdc />,
    },
    {
      id: 6,
      element: <Cardano />,
    },
    {
      id: 7,
      element: <Doge />,
    },
  ],
  totalAmount:'250',
  syncDate:'05-02-2023',
  socials: [
    {
      id: 1,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
      icon: <Twitter className="w-4" />,
    },
    {
      id: 2,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
      icon: <Facebook className="w-4" />,
    },
    {
      id: 2,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
      icon: <Instagram className="w-4" />,
    },
  ],
  links: [
    {
      id: 1,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
    },
    {
      id: 2,
      title: '@dontbesovasya',
      link: 'https://dontbesovasya.io',
    },
  ],
};
