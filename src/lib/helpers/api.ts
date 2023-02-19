import axios from 'axios';

export const apiInstance = axios.create({
    baseURL: 'https://defios.msqu4re.me'
});

export const createUserMappingAPI = async (userPublicKey: string, accessToken: string, githubID: string) => {
    const response = await apiInstance.post('/createUserMapping', { pub_key: userPublicKey, github_access_token: accessToken, github_uid: githubID });
    return response.data;
}
