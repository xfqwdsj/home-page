export const defaultClashProfile = `
port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: false
mode: Rule
log-level: info
proxy-providers: {}
proxies: []
proxy-groups:
  - name: PROXY
    type: select
    proxies: []
rule-providers: {}
rules: []
`;

export const ruleGroups = `
- name: iCloud
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: Apple
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: Google
  type: select
  proxies:
    - PROXY
    - DIRECT
- name: 中国IP地址
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: 中国GeoIP
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: 私有域名
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: 保留IP地址
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: 本地进程
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: 其他
  type: select
  proxies:
    - DIRECT
    - PROXY
- name: 拦截地址
  type: select
  proxies:
    - REJECT
    - PROXY
    - DIRECT
`;

export const ruleProviders = `
reject:
  type: http
  behavior: domain
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt
  path: ./ruleset/reject.yaml
  interval: 86400
icloud:
  type: http
  behavior: domain
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/icloud.txt
  path: ./ruleset/icloud.yaml
  interval: 86400
apple:
  type: http
  behavior: domain
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/apple.txt
  path: ./ruleset/apple.yaml
  interval: 86400
google:
  type: http
  behavior: domain
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt
  path: ./ruleset/google.yaml
  interval: 86400
direct:
  type: http
  behavior: domain
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt
  path: ./ruleset/direct.yaml
  interval: 86400
private:
  type: http
  behavior: domain
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt
  path: ./ruleset/private.yaml
  interval: 86400
cncidr:
  type: http
  behavior: ipcidr
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt
  path: ./ruleset/cncidr.yaml
  interval: 86400
lancidr:
  type: http
  behavior: ipcidr
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt
  path: ./ruleset/lancidr.yaml
  interval: 86400
applications:
  type: http
  behavior: classical
  url: https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt
  path: ./ruleset/applications.yaml
  interval: 86400
`;

export const rules =`
- 'RULE-SET,applications,本地进程'
- 'DOMAIN,clash.razord.top,DIRECT'
- 'DOMAIN,yacd.haishan.me,DIRECT'
- 'RULE-SET,private,私有域名'
- 'RULE-SET,reject,拦截地址'
- 'RULE-SET,icloud,iCloud'
- 'RULE-SET,apple,Apple'
- 'RULE-SET,google,Google'
- 'RULE-SET,direct,其他'
- 'RULE-SET,lancidr,保留IP地址'
- 'RULE-SET,cncidr,中国IP地址'
- 'GEOIP,CN,中国GeoIP'
`;
