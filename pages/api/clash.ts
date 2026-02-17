import { NextApiRequest, NextApiResponse } from "next";
import { getRoles } from "../../components/user";
import { compareProxies, Config, defaultConfig, Group, Proxy } from "../../components/clash_profile/type";
import YAML from "yaml";
import AV from "leancloud-storage/core";
import * as http from "http";
import * as https from "https";
import * as uuid from "uuid";
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

        // Helper function to generate content key for deduplication
        const getContentKey = (proxy: Proxy): string => {
          const { name, uuid, ...rest } = proxy;
          return JSON.stringify(rest);
        };

        // Initialize tracking structures once per group (not per pushProxies call)
        // Build a set of existing proxy names for O(1) lookup
        const existingNames = new Set(config.proxies.map((p) => p.name));

        // Build a map for O(1) content-based lookup
        const contentToProxy = new Map<string, Proxy>();
        for (const proxy of config.proxies) {
          contentToProxy.set(getContentKey(proxy), proxy);
        }

        // Helper function to generate unique name
        const getUniqueName = (baseName: string): string => {
          if (!existingNames.has(baseName)) {
            return baseName;
          }

          const pattern = /(.*)\s(\d+)$/;
          let name = baseName;
          let counter = 1;

          if (pattern.test(baseName)) {
            const match = baseName.match(pattern);
            if (match) {
              name = match[1];
              counter = parseInt(match[2], 10) + 1;
            }
          }

          let uniqueName = `${name} ${counter}`;
          while (existingNames.has(uniqueName)) {
            counter++;
            uniqueName = `${name} ${counter}`;
          }

          return uniqueName;
        };

        const pushProxies = (proxies: Proxy[], bypassLoopbackCheck?: boolean) => {
          if (!bypassLoopbackCheck) {
            proxies = proxies.filter((proxy, index, self) => {
              return proxy.server !== "127.0.0.1" && proxy.server !== "::1" && proxy.server !== "localhost" && self.findIndex((it) => compareObjects(proxy, it)) === index;
            });
          }

          const allowedShadowSocksCipher = ["aes-128-gcm", "aes-192-gcm", "aes-256-gcm", "aes-128-cfb", "aes-192-cfb", "aes-256-cfb", "aes-128-ctr", "aes-192-ctr", "aes-256-ctr", "rc4-md5", "chacha20-ietf", "xchacha20", "chacha20-ietf-poly1305", "xchacha20-ietf-poly1305"];

          const proxiesToAdd: Proxy[] = [];

          for (const proxy of proxies) {
            if (proxy.type === "ss" && proxy.cipher && !allowedShadowSocksCipher.includes(proxy.cipher)) continue;
            if (proxy.type === "vless") continue;

            // Check if this proxy already exists (by comparing content, not name)
            const contentKey = getContentKey(proxy);
            const existingProxy = contentToProxy.get(contentKey);

            let finalProxy: Proxy;
            if (existingProxy) {
              // Proxy with same content exists, reuse its name
              finalProxy = existingProxy;
            } else {
              // New proxy, ensure unique name
              const uniqueName = getUniqueName(proxy.name);
              finalProxy = { ...proxy, name: uniqueName };

              if (!uuid.validate(finalProxy.uuid)) finalProxy.uuid = uuid.v7();

              // Add to our tracking structures and list
              existingNames.add(uniqueName);
              contentToProxy.set(contentKey, finalProxy);
              proxiesToAdd.push(finalProxy);
            }

            // Add to group if not already present
            if (!group.proxies.includes(finalProxy.name)) {
              group.proxies.push(finalProxy.name);
            }
          }

          config.proxies.push(...proxiesToAdd);
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
                  if (proxies instanceof Array) {
                    pushProxies(proxies);
                  }
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
