import axios from "axios"
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNTE2OWRhNC1kMzM2LTQ4ZTctOWMzYy1lOGVlM2M2M2JkZTkiLCJlbWFpbCI6Im1taXR0YWwxMjM0NTZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ5N2NhYTliODdiNTEwODY1ZjEzIiwic2NvcGVkS2V5U2VjcmV0IjoiYWQ1MTM3ZWU4ODdjN2ZiNzI4MTdkY2NiZGU5MDdhYmY4MGU1ODFmNmMyY2Y2ZDQ5Y2Y4NWFlZjdmZDNiNzc1ZSIsImlhdCI6MTY3Nzk0MjgyOH0.KJANyMcaKCBgnKeRO8X4Z0_jMPsxq0nLAMq8s6Vo3rI'


export const uploadFileToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
            'Authorization': `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data"
        },
    });
    return resFile.data.IpfsHash
}

export const uploadMetadataToIPFS = async (metadata: any) => {
    const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
            'Authorization': `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        data: metadata
    });
    return res.data.IpfsHash
}