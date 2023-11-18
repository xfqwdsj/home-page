export interface Group {
  name: string;
  type: "select" | "url-test";
  url?: "http://www.gstatic.com/generate_204" | undefined;
  interval?: 300 | undefined;
  tolerance?: 50 | undefined;
  proxies: string[];
}

export const defaultClashConfig = {
  port: 7890,
  "socks-port": 7891,
  "redir-port": 7892,
  "allow-lan": false,
  mode: "Rule",
  "log-level": "info",
  proxies: [],
  "proxy-groups": [{ name: "PROXY", type: "select", proxies: [] }],
  "rule-providers": {},
  rules: [],
};
