import { NextApiRequest, NextApiResponse } from "next";
import { getRoles } from "../../components/user";
import { defaultClashConfig, Group } from "../../components/clash_profile/default";
import YAML from "yaml";
import AV from "leancloud-storage/core";
import * as http from "http";

const AC = require("leancloud-storage") as typeof AV;

AC.init({
  appId: "oGcy9vKWCexf8bMi2jBtyziu-MdYXbMMI", appKey: "SFcECqIUlHq4iPpMy2DpjxbY",
});

interface ServerSideGroup {
  name: string;
  type: string;
  template: string;
}

const send = (config: any, res: NextApiResponse) => {
  ((config["proxy-groups"] as any[])[0]["proxies"] as string[]).push("DIRECT");
  (config["rules"] as string[]).push("MATCH,PROXY");
  res
    .setHeader("Content-Type", "text/yaml; charset=utf-8")
    .status(200)
    .send(YAML.stringify(config));
};

const ClashApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    (async () => {
      const name = req.query["n"] as string | null | undefined;
      const password = req.query["p"] as string | null | undefined;
      if (!(name && password)) {
        res.status(400).send(null);
        return;
      }

      const config = defaultClashConfig;
      const roles = await getRoles(AC.User.logIn(name, password));
      const ruleName = req.query["r"] as string | undefined;
      for (let role of roles) {
        const proxy = await new AC.Query("Proxies").get(role.get("proxy").id);
        const proxies = proxy.get("proxies") as any[] | undefined;
        const providers = proxy.get("providers") as string[] | undefined;
        const groups = (proxy.get("groups") as ServerSideGroup[]).map((group) => {
          const { name, type } = group;
          if (type !== "select" && type !== "url-test") {
            throw new Error("Unsupported group type.");
          }
          let result: Group = { name, type, proxies: [] };
          if (type === "url-test") {
            result = {
              url: "http://www.gstatic.com/generate_204", interval: 300, tolerance: 50, ...result,
            };
          }

          const pushProxies = (proxies: any[]) => {
            (config["proxies"] as any[]).push(...proxies);
            result.proxies.push(...proxies.map((it) => it["name"]));
          };

          if (proxies) {
            pushProxies(proxies);
          }

          if (providers) {
            for (let providerUrl of providers) {
              const url = new URL(providerUrl);
              if (url.protocol === "http:") {
                http.get(url, (res) => {
                  let data = "";
                  res.setEncoding("utf8");
                  res.on("data", (chunk) => {
                    data += chunk;
                  });
                  res.on("end", () => {
                    const { proxies } = YAML.parse(data);
                    pushProxies(proxies as any[]);
                  });
                });
              }
            }
          }

          return result;
        });
        (config["proxy-groups"] as any[]).push(...groups);
        ((config["proxy-groups"] as any[])[0]["proxies"] as any[]).push(...groups.map((group) => group.name));
      }

      if (!ruleName) {
        send(config, res);
        AC.User.logOut();
        return;
      }

      const rule = await new AC.Query("Rules")
        .equalTo("name", ruleName)
        .first();
      if (!rule) {
        res.status(404).send("Rule not found.");
        AC.User.logOut();
        return;
      }

      if (rule.get("groups") as any[] | null | undefined) {
        (config["proxy-groups"] as any[]).push(...rule.get("groups"));
      }
      if (rule.get("providers") as any | null | undefined) {
        config["rule-providers"] = Object.assign(config["rule-providers"], rule.get("providers"));
      }
      if (rule.get("rules") as any[] | null | undefined) {
        (config["rules"] as any[]).push(...rule.get("rules"));
      }
      send(config, res);
      AC.User.logOut();
    })();
  } else {
    res
      .writeHead(405, {
        Allow: "GET",
      })
      .end();
  }
};

export default ClashApi;
