export interface Group {
  name: string;
  type: string;
  url?: string;
  interval?: number;
  tolerance?: number;
  proxies?: Array<string>;
  use?: Array<string>;
}

export const defaultClashConfig = {
  port: 7890,
  'socks-port': 7891,
  'redir-port': 7892,
  'allow-lan': false,
  mode: 'Rule',
  'log-level': 'info',
  'proxy-providers': {},
  proxies: [],
  'proxy-groups': [{ name: 'PROXY', type: 'select', proxies: [] }],
  'rule-providers': {},
  rules: [],
} as any;
