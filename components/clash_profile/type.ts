import { compareObjects } from "../object";

export interface Config {
  "mixed-port": number;
  "allow-lan": boolean;
  mode: "rule";
  "log-level": "info" | "warning" | "error" | "debug" | "silent";
  proxies: Proxy[];
  "proxy-groups": Group[];
  "rule-providers": any;
  rules: string[];
}

export interface Proxy {
  name: string;
  type: string;
  server: string;
  port: string;
}

export const compareProxies = (a: Proxy, b: Proxy) => {
  return compareObjects({...a, name: undefined}, {...b, name: undefined});
};

export interface Group {
  name: string;
  type: "select" | "url-test";
  url?: "http://www.gstatic.com/generate_204" | undefined;
  interval?: 300 | undefined;
  tolerance?: 50 | undefined;
  proxies: string[];
}

export const defaultConfig: Config = {
  "mixed-port": 7890,
  "allow-lan": false,
  mode: "rule",
  "log-level": "info",
  proxies: [],
  "proxy-groups": [{ name: "PROXY", type: "select", proxies: [] }],
  "rule-providers": {},
  rules: [],
};
