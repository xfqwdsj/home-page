import { NextApiRequest, NextApiResponse } from 'next';
import AV from 'leancloud-storage';
import { getRoles } from '../../components/user';
import {
  defaultClashConfig,
  Group,
} from '../../components/clash_profile/default';

const AC = require('leancloud-storage') as typeof AV;

AC.init({
  appId: 'oGcy9vKWCexf8bMi2jBtyziu-MdYXbMMI',
  appKey: 'SFcECqIUlHq4iPpMy2DpjxbY',
});

interface ServerSideGroup {
  name: string;
  type: string;
  template: string;
}

const urlTestGroupConfig = {
  url: 'http://www.gstatic.com/generate_204',
  interval: 300,
  tolerance: 50,
};

const ClashApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const name = req.query['n'] as string | null | undefined;
    const password = req.query['p'] as string | null | undefined;
    if (name && password) {
      const config = { ...defaultClashConfig };
      AC.User.logIn(name, password).then((user) => {
        const query = AC.Relation.reverseQuery('_Role', 'users', user);
        query.include('Proxies');
        query.find().then((roles) => {
          roles.forEach((role) => {
            const proxy = role.get('proxy');
            const proxies = proxy.get('proxies') as Array<any>;
            const providers = proxy.get('providers');
            const groups = (proxy.get('group') as Array<ServerSideGroup>).map(
              (group) => {
                const { name, type } = group;
                let result = { name, type } as Group;
                switch (group.template) {
                  case 'proxies':
                    (config['proxies'] as Array<any>).push(...proxies);
                    result = {
                      ...result,
                      proxies: proxies.map((it) => it['name']),
                    };
                    break;
                  case 'providers':
                    config['proxy-providers'] = Object.assign(
                      config['proxy-providers'],
                      providers
                    );
                    result = {
                      ...result,
                      ...urlTestGroupConfig,
                      use: Object.keys(providers),
                    };
                    break;
                }
                return result;
              }
            );
            (config['proxy-groups'] as Array<any>).push(groups);
            (
              (config['proxy-groups'] as Array<any>)[0][
                'proxies'
              ] as Array<string>
            ).push(...groups.map((group) => group.name));
          });
          res.status(200).json(config);
        }).catch((e: AV.Error) => {
          res.status(e.code).send(e.message)
        });
      }).catch((e: AV.Error) => {
        res.status(e.code).send(e.message)
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

export default ClashApi;
