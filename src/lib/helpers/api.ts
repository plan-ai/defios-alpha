import axios from '@/lib/axiosClient';

export const createUserMappingAPI = async (
  userPublicKey: string,
  accessToken: string,
  githubID: string
) => {
  const response = await axios.post(
    'https://namespaces.defi-os.com/createUserMapping',
    {
      pub_key: userPublicKey,
      github_access_token: accessToken,
      github_uid: githubID,
    }
  );
  return response.data;
};
