import { NextApiRequest, NextApiResponse } from 'next';
import YAML from 'yaml';
import * as bcrypt from 'bcrypt';
import { defaultClashProfile } from '../../components/clash_profile/default';
import { freeProxies } from '../../components/clash_profile/free';

interface User {
  passwd: string;
  groups: Array<string>;
}

interface MyServer {
  name: string;
  type: string;
  server: string;
  port: number;
  password: string;
  udp: boolean;
  alpn: Array<string>;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const users = YAML.parse(process.env.CLASH_USERS as string);
    const name = req.query['n'] as string | null | undefined;
    const password = req.query['p'] as string | null | undefined;
    if (name && password) {
      const user = users[name] as User;
      if (user) {
        bcrypt.compare(password, user.passwd, function (err, result) {
          if (result) {
            const profile = defaultClashProfile;
            user.groups.forEach((group) => {
              switch (group) {
                case 'mine':
                  const proxy = YAML.parse(
                    process.env.MY_PROXY_SERVER as string
                  ) as MyServer;
                  profile.proxies.push(proxy);
                  profile['proxy-groups'][0].proxies.splice(-1, 0, proxy.name);
                  break;
                case 'free':
                  profile['proxy-providers'] = Object.assign(
                    profile['proxy-providers'],
                    freeProxies
                  );
                  profile['proxy-groups'].splice(
                    -10,
                    0,
                    {
                      name: '互联网上的免费代理',
                      type: 'select',
                      use: Object.keys(freeProxies),
                    },
                    {
                      name: '自动选择的的免费代理',
                      type: 'url-test',
                      url: 'http://www.gstatic.com/generate_204',
                      interval: 300,
                      tolerance: 50,
                      use: Object.keys(freeProxies),
                    }
                  );
                  profile['proxy-groups'][0].proxies.splice(
                    -1,
                    0,
                    '互联网上的免费代理',
                    '自动选择的的免费代理'
                  );
              }
            });
            res.status(200).send('OK');
          } else {
            res.status(404).json(err);
          }
        });
      } else {
        res.status(404).json(null);
      }
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
