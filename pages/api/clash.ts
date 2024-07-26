import { NextApiRequest, NextApiResponse } from "next";
import { getRoles } from "../../components/user";
import { compareProxies, Config, defaultConfig, Group, Proxy } from "../../components/clash_profile/type";
import YAML from "yaml";
import AV from "leancloud-storage/core";
import * as http from "http";
import * as https from "https";
import { compareObjects } from "../../components/object";

const AC = require("leancloud-storage") as typeof AV;

AC.init({
  appId: "oGcy9vKWCexf8bMi2jBtyziu-MdYXbMMI", appKey: "SFcECqIUlHq4iPpMy2DpjxbY",
});

interface GroupData {
  name: string;
  type: string;
  template: string;
}

const send = (config: Config, res: NextApiResponse) => {
  config["proxy-groups"][0].proxies.push("DIRECT");
  config.rules.push("MATCH,PROXY");
  res
    .setHeader("Content-Type", "text/yaml; charset=utf-8")
    .status(200)
    .send(YAML.stringify(config));
};

const ClashApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.writeHead(405, { Allow: "GET" }).end();
    return;
  }

  (async () => {
    const name = req.query["n"] as string | undefined;
    const password = req.query["p"] as string | undefined;

    if (!name || !password) {
      res.status(400).send(null);
      return;
    }

    const config = structuredClone(defaultConfig);
    const roles = await getRoles(AC.User.logIn(name, password));
    const ruleName = req.query["r"] as string | undefined;

    for (const role of roles) {
      const proxy = await new AC.Query("Proxies").get(role.get("proxy").id);
      const proxies = proxy.get("proxies") as Proxy[] | undefined;
      const providers = proxy.get("providers") as string[] | undefined;
      const groupPromises = (proxy.get("groups") as GroupData[]).map(async (groupData) => {
        const { name, type } = groupData;
        if (type !== "select" && type !== "url-test") {
          throw new Error("Unsupported group type.");
        }

        let group: Group = { name, type, proxies: [] };
        if (type === "url-test") {
          group = {
            url: "http://www.gstatic.com/generate_204", interval: 300, tolerance: 50, ...group,
          };
        }

        const pushProxies = (proxies: Proxy[], bypassLoopbackCheck?: boolean) => {
          if (!bypassLoopbackCheck) {
            proxies = proxies.filter((proxy, index, self) => {
              return proxy.server !== "127.0.0.1" && proxy.server !== "::1" && proxy.server !== "localhost" && self.findIndex((it) => compareObjects(proxy, it)) === index;
            });
          }

          const allowedShadowSocksCipher = ["aes-128-gcm", "aes-192-gcm", "aes-256-gcm", "aes-128-cfb", "aes-192-cfb", "aes-256-cfb", "aes-128-ctr", "aes-192-ctr", "aes-256-ctr", "rc4-md5", "chacha20-ietf", "xchacha20", "chacha20-ietf-poly1305", "xchacha20-ietf-poly1305"];

          for (const proxy of config.proxies) {
            const filtered: Proxy[] = [];

            for (const it of proxies) {
              if (it.type === "ss" && it.cipher && !allowedShadowSocksCipher.includes(it.cipher)) continue;
              if (it.type === "vless") continue;

              if (proxy.name === it.name) {
                if (compareProxies(proxy, it)) {
                  filtered.push(it);
                } else {
                  let name = it.name;
                  const pattern = /(.*)\s(\d+)$/;

                  if (pattern.test(name)) {
                    const match = name.match(pattern);
                    if (match) {
                      name = `${match[1]} ${parseInt(match[2]) + 1}`;
                    }
                  } else {
                    name = `${name} 1`;
                  }

                  filtered.push({ ...it, name });
                }
              } else {
                if (!compareProxies(proxy, it)) {
                  filtered.push(it);
                } else {
                  filtered.push(proxy);
                }
              }
            }

            proxies = filtered;
          }

          for (const proxy of proxies) {
            if (!group.proxies.includes(proxy.name)) {
              group.proxies.push(proxy.name);
            }
          }

          for (const proxy of config.proxies) {
            proxies = proxies.filter((it) => it.name !== proxy.name);
          }

          config.proxies.push(...proxies);
        };

        if (proxies) {
          pushProxies(proxies, true);
        }

        if (providers) {
          const promises = providers.map((providerUrl) => {
            const url = new URL(providerUrl);

            if (url.protocol !== "http:" && url.protocol !== "https:") {
              return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
              const callback = (res: http.IncomingMessage) => {
                let data = "";
                res.setEncoding("utf8");
                res.on("data", (chunk) => {
                  data += chunk;
                });
                res.on("end", () => {
                  const { proxies } = YAML.parse(data);
                  pushProxies(proxies);
                  resolve();
                });
              };

              if (url.protocol === "http:") {
                http.get(url, callback);
              } else if (url.protocol === "https:") {
                https.get(url, callback);
              }
            });
          });

          await Promise.all(promises);
        }

        return group;
      });

      const groups = await Promise.all(groupPromises);
      config["proxy-groups"].push(...groups);
      config["proxy-groups"][0].proxies.push(...groups.map((group) => group.name));
    }

    if (!ruleName) {
      send(config, res);
      await AC.User.logOut();
      return;
    }

    const rule = await new AC.Query("Rules")
      .equalTo("name", ruleName)
      .first();

    if (!rule) {
      res.status(404).send("Rule not found.");
      await AC.User.logOut();
      return;
    }

    const groups = rule.get("groups") as Group[] | undefined;
    if (groups) {
      config["proxy-groups"].push(...groups);
    }

    const providers = rule.get("providers") as any | undefined;
    if (providers) {
      config["rule-providers"] = Object.assign(config["rule-providers"], providers);
    }

    const rules = rule.get("rules") as string[] | undefined;
    if (rules) {
      config.rules.push(...rules);
    }

    send(config, res);
    await AC.User.logOut();
  })();
};

export default ClashApi;
