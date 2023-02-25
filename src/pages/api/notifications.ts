import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  }

  const { firebase_jwt } = req.headers;

  await axios
    .get('https://api-v1.defi-os.com/notifications', {
      headers: {
        Authorization: firebase_jwt,
      },
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
}
