import React, { useState, useEffect, useMemo } from 'react';
import Input from '@/components/ui/forms/input';
import IssueItem from '@/components/roadmapCreation/issue-item';
import Button from '@/components/ui/button/button';
import EmptyList from '@/components/icons/EmptyList';
interface IssueModalProps {
  issueData: any;
  issue: any;
  setIssue: React.Dispatch<React.SetStateAction<any>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const IssueModal: React.FC<IssueModalProps> = ({
  issueData,
  issue,
  setIssue,
  setModalOpen,
}) => {
  const [search, setSearch] = useState('');

  const issueSearch = useMemo(() => {
    if (search === '') return issueData;
    const filteredIssues = issueData.filter((_issue: any) => {
      return (
        _issue.issue_title.toLowerCase().includes(search.toLowerCase()) ||
        _issue.issue_project_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        _issue.issue_gh_url
          .split('/')
          [_issue.issue_gh_url.split('/').length - 1].toLowerCase()
          .includes(search.toLowerCase())
      );
    });
    return filteredIssues;
  }, [search, issueData]);

  return (
    <div className="flex h-full w-full flex-col p-3 xl:p-4 3xl:p-5">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="search issues"
        className="w-full"
        search={true}
      />
      <div className="mb-4 h-full w-full overflow-y-auto pr-4">
        {issueSearch.length !== 0 &&
          issueSearch.map((item: any, idx: number) => (
            <IssueItem
              key={idx}
              issue={issue}
              setIssue={setIssue}
              data={item}
            />
          ))}
        {issueSearch.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <EmptyList />
            <div className="text-lg text-gray-500">
              No Issues Available on this Repository
            </div>
          </div>
        )}
      </div>
      <div
        className="bg-newDark flex w-full cursor-pointer items-center justify-center whitespace-pre rounded-full border-2 border-primary py-1 px-8 text-sm font-semibold text-primary xl:text-base 3xl:text-lg"
        onClick={() => setModalOpen(false)}
      >
        Confirm Issue Selection
      </div>
    </div>
  );
};

export default IssueModal;
