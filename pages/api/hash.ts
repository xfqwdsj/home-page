import { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcrypt';

const HashApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const password = req.query['p'] as string | null | undefined;
    if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        err ? res.status(500).json(err) : res.status(200).send(hash);
      });
    } else {
      res.status(400).send(null);
    }
  } else {
    res
      .writeHead(405, {
        Allow: 'GET',
      })
      .end();
  }
};

export default HashApi;
