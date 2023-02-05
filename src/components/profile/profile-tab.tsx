import cn from 'classnames';
import ListCard from '@/components/ui/list-card';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import TransactionSearchForm from '@/components/author/transaction-search-form';
import TransactionHistory from '@/components/author/transaction-history';
import CollectionCard from '@/components/ui/collection-card';
// static data
import { collections } from '@/data/static/collections';
import {
  authorWallets,
  authorNetworks,
  authorProtocols,
} from '@/data/static/author-profile';

const tabMenu = [
  {
    title: 'Projects',
    path: 'projects',
  },
  {
    title: 'Contributions',
    path: 'contributions',
  },
  {
    title: 'Skills [Coming Soon]',
    path: 'skills',
  },
];

export default function ProfileTab() {
  return (
    <ParamTab tabMenu={tabMenu}>
      <TabPanel className="focus:outline-none">
        
      </TabPanel>
      <TabPanel className="focus:outline-none">
        
      </TabPanel>
      <TabPanel className="focus:outline-none">
        
      </TabPanel>
    </ParamTab>
  );
}
