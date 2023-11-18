import { NextApiRequest, NextApiResponse } from "next";
import { getRoles } from "../../components/user";
import { Config, defaultClashConfig, Group, Proxy } from "../../components/clash_profile/default";
import YAML from "yaml";
import AV from "leancloud-storage/core";
import * as http from "http";
import * as https from "https";

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

    const config = defaultClashConfig;
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

        const pushProxies = (proxies: Proxy[]) => {
          for (const proxy of config.proxies) {
            proxies = proxies.filter((it) => (it.server !== proxy.server || it.port !== proxy.port) && it.server !== "127.0.0.1" && it.server !== "::1" && it.server !== "localhost");
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
          pushProxies(proxies);
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
                  pushProxies(proxies as any[]);
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
