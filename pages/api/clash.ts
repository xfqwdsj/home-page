import { NextApiRequest, NextApiResponse } from 'next';
import YAML from 'yaml';
import * as bcrypt from 'bcrypt';
import {
  defaultClashProfile,
  ruleGroups,
  ruleProviders,
  rules,
} from '../../components/clash_profile/default';
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

const ClashApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const users = YAML.parse(process.env.CLASH_USERS as string);
    const name = req.query['n'] as string | null | undefined;
    const password = req.query['p'] as string | null | undefined;
    if (name && password) {
      const user = users[name] as User;
      if (user) {
        bcrypt.compare(password, user.passwd, function (err, result) {
          if (result) {
            const profile = YAML.parse(defaultClashProfile);
            user.groups.forEach((group) => {
              switch (group) {
                case 'mine':
                  const proxy = YAML.parse(
                    process.env.MY_PROXY_SERVER as string
                  ) as MyServer;
                  profile.proxies.push(proxy);
                  profile['proxy-groups'][0].proxies.push(proxy.name);
                  break;
                case 'free':
                  profile['proxy-providers'] = Object.assign(
                    profile['proxy-providers'],
                    freeProxies
                  );
                  profile['proxy-groups'].push(
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
                  profile['proxy-groups'][0].proxies.push(
                    '互联网上的免费代理',
                    '自动选择的的免费代理'
                  );
                  break;
              }
            });
            profile['proxy-groups'][0].proxies.push('DIRECT');
            if (!(req.query['nr'] as string | null | undefined)) {
              profile['proxy-groups'].push(...YAML.parse(ruleGroups));
              profile['rule-providers'] = Object.assign(
                profile['rule-providers'],
                YAML.parse(ruleProviders)
              );
              profile.rules.push(...YAML.parse(rules));
            }
            profile.rules.push('MATCH,PROXY');
            res
              .setHeader('Content-Type', 'text/yaml; charset=utf-8')
              .status(200)
              .send(YAML.stringify(profile));
          } else {
            res.status(404).json(err);
          }
        });
      } else {
        res.status(404).send(null);
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

export default ClashApi;
