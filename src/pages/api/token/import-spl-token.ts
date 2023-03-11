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

  const { address } = req.query;
  await axios
    .get(`https://public-api.solscan.io/account/${address}`, {
      headers: {
        token: process.env.SOLSCAN_TOKEN,
      },
    })
    .then((resp) => res.status(200).send(resp.data))
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
}
