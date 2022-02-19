import { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcrypt';

export default (req: NextApiRequest, res: NextApiResponse) => {
  bcrypt.hash(req.body, 32, (err, hash) => {
    err ? res.status(500).json(err) : res.status(200).send(hash);
  });
};
