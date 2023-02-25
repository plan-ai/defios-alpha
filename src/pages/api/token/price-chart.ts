import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  const { price_url } = req.body;

  await axios
    .get(price_url)
    .then((resp) => {
      const data = resp.data;
      const dataKeys = Object.keys(data);
      const newData = dataKeys.map((item) => {
        return {
          name: item,
          value: data[item],
        };
      });
      res.status(200).send(newData);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
    });
}
