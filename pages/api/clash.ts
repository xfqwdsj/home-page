import {NextApiRequest, NextApiResponse} from "next";
import {getRoles} from "../../components/user";
import {defaultClashConfig, Group} from "../../components/clash_profile/default";
import YAML from "yaml";
import AV from "leancloud-storage/core";

const AC = require("leancloud-storage") as typeof AV;

AC.init({
    appId: "oGcy9vKWCexf8bMi2jBtyziu-MdYXbMMI",
    appKey: "SFcECqIUlHq4iPpMy2DpjxbY",
});

interface ServerSideGroup {
    name: string;
    type: string;
    template: string;
}

const urlTestGroupConfig = {
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 50,
};

const send = (config: any, res: NextApiResponse) => {
    ((config["proxy-groups"] as Array<any>)[0]["proxies"] as Array<string>).push(
        "DIRECT",
    );
    (config["rules"] as Array<string>).push("MATCH,PROXY");
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
            if (name && password) {
                const config = JSON.parse(JSON.stringify(defaultClashConfig));
                const roles = await getRoles(AC.User.logIn(name, password));
                const ruleName = req.query["r"] as string | null | undefined;
                for (let i = 0; i < roles.length; i++) {
                    await (async () => {
                        const role = roles[i];
                        const proxy = await new AC.Query("Proxies").get(
                            role.get("proxy").id,
                        );
                        const proxies = proxy.get("proxies") as Array<any>;
                        const providers = proxy.get("providers");
                        const groups = (proxy.get("groups") as Array<ServerSideGroup>).map(
                            (group) => {
                                const {name, type} = group;
                                let result = {name, type} as Group;
                                switch (group.template) {
                                    case "proxies":
                                        (config["proxies"] as Array<any>).push(...proxies);
                                        result = {
                                            ...result,
                                            proxies: proxies.map((it) => it["name"]),
                                        };
                                        break;
                                    case "providers":
                                        config["proxy-providers"] = Object.assign(
                                            config["proxy-providers"],
                                            providers,
                                        );
                                        result = {
                                            ...result,
                                            ...urlTestGroupConfig,
                                            use: Object.keys(providers),
                                        };
                                        break;
                                }
                                return result;
                            },
                        );
                        (config["proxy-groups"] as Array<any>).push(...groups);
                        (
                            (config["proxy-groups"] as Array<any>)[0][
                                "proxies"
                                ] as Array<string>
                        ).push(...groups.map((group) => group.name));
                    })();
                }
                if (ruleName) {
                    const rule = await new AC.Query("Rules")
                        .equalTo("name", ruleName)
                        .first();
                    if (rule) {
                        if (rule.get("groups") as Array<any> | null | undefined) {
                            (config["proxy-groups"] as Array<any>).push(
                                ...rule.get("groups"),
                            );
                        }
                        if (rule.get("providers") as any | null | undefined) {
                            config["rule-providers"] = Object.assign(
                                config["rule-providers"],
                                rule.get("providers"),
                            );
                        }
                        if (rule.get("rules") as Array<any> | null | undefined) {
                            (config["rules"] as Array<any>).push(...rule.get("rules"));
                        }
                        AC.User.logOut();
                        send(config, res);
                    } else {
                        AC.User.logOut();
                        res.status(404).send("Rule not found.");
                    }
                } else {
                    AC.User.logOut();
                    send(config, res);
                }
            } else {
                res.status(400).send(null);
            }
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
