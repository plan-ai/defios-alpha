import axios from 'axios';

export const apiInstance = axios.create({
    baseURL: 'https://namespaces.defi-os.com'
});

export const createUserMappingAPI = async (userPublicKey: string, accessToken: string, githubID: string) => {
    const response = await apiInstance.post('/createUserMapping', { pub_key: userPublicKey, github_access_token: accessToken, github_uid: githubID });
    return response.data;
}
