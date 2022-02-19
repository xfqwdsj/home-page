import { NextApiRequest, NextApiResponse } from 'next';
import YAML from 'yaml';
import * as bcrypt from 'bcrypt';

interface User {
  passwd: string;
  groups: Array<string>;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const users = YAML.parse(process.env.CLASH_USERS as string);
    const name = req.query['n'] as string | null | undefined;
    const password = req.query['p'] as string | null | undefined;
    if (name && password) {
      const user = users[name] as User;
      bcrypt.compare(password, user.passwd, function (err, result) {
        if (result) {
          res.status(200).send('OK')
        } else {
          res.status(404).json(err)
        }
      });
    } else {
      res.status(400).send(null)
    }
  } else {
    res
      .writeHead(405, {
        Allow: 'GET',
      })
      .end();
  }
};
