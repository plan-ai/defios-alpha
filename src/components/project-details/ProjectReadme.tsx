import React, { useState, useEffect } from 'react';
import axios from '@/lib/axiosClient';
import { useSession } from 'next-auth/react';
import MarkdownRenderer from '@/components/ui/markdown';
import Spinner from '@/components/custom/spinner';

interface ProjectReadmeProps {
  project_url: string;
}

export const ProjectReadme: React.FC<ProjectReadmeProps> = ({
  project_url,
}) => {
  const { data: session } = useSession();

  const [readmeData, setReadmeData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getReadme = () => {
    setIsLoading(true);
    axios
      .get(
        `${project_url.replace(
          'github.com',
          'api.github.com/repos'
        )}/contents/README.md`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        const decodedReadme = atob(res.data.content);
        console.log(decodedReadme);
        setReadmeData(decodedReadme);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      (session as any)?.accessToken !== null &&
      (session as any)?.accessToken !== undefined &&
      project_url !== '' &&
      project_url !== undefined
    ) {
      getReadme();
    }
  }, [project_url, session]);

  return (
    <div className="overflow-x-0 w-full p-5">
      {!isLoading && (
        <MarkdownRenderer className="w-full">{readmeData}</MarkdownRenderer>
      )}
      {isLoading && (
        <div className="my-5 w-full items-center justify-center">
          <Spinner label="loading readme..." />
        </div>
      )}
    </div>
  );
};

export default ProjectReadme;
