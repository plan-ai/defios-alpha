import { NextApiRequest, NextApiResponse } from 'next';
import axios from '@/lib/axiosClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  const { token_address } = req.body;
  await axios
    .get('https://public-api.solscan.io/token/holders', {
      params: {
        tokenAddress: token_address,
        limit: 4,
        offest: 0,
      },
      headers: {
        token: process.env.SOLSCAN_TOKEN,
      },
    })
    .then((resp) => {
      const data = resp.data.data;
      const newData = data.map((item: any) => {
        let volume = '';
        let amt = item.amount / 10 ** item.decimals;
        if (amt > 10 ** 12) {
          volume = (Math.floor(amt / 10 ** 10) / 100).toString() + ' Tn';
        } else if (amt > 10 ** 9) {
          volume = (Math.floor(amt / 10 ** 7) / 100).toString() + ' Bn';
        } else if (amt > 10 ** 6) {
          volume = (Math.floor(amt / 10 ** 5) / 100).toString() + ' Mn';
        } else {
          volume = (Math.floor(amt / 10 ** 1) / 100).toString() + ' K';
        }
        return {
          address: item.address,
          owner: item.owner,
          value: item.amount,
          decimals: item.decimals,
          rank: item.rank,
          volume: volume,
        };
      });
      res.status(200).send(newData);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
}
