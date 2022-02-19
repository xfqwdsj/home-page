export const freeProxies = {
  n1: {
    type: 'http',
    url: 'https://sub.xeton.dev/sub?target=clash&new_name=true&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolatiger%2Fv2ray-nodes%2Fmaster%2Fclash.yaml&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2FACL4SSR%2FACL4SSR%2Fmaster%2FClash%2Fconfig%2FACL4SSR_Online.ini&emoji=true&list=true&tfo=false&scv=false&fdn=false&sort=false',
    path: './free/n1.yaml',
    interval: 86400,
    'health-check': {
      enable: true,
      url: 'http://www.gstatic.com/generate_204',
      interval: 300,
    },
  },
  n2: {
    type: 'http',
    url: 'https://sub.xeton.dev/sub?target=clash&new_name=true&url=https%3A%2F%2Fraw.githubusercontent.com%2Ffreefq%2Ffree%2Fmaster%2Fv2&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2FACL4SSR%2FACL4SSR%2Fmaster%2FClash%2Fconfig%2FACL4SSR_Online.ini&emoji=true&list=true&tfo=false&scv=false&fdn=false&sort=false',
    path: './free/n2.yaml',
    interval: 86400,
    'health-check': {
      enable: true,
      url: 'http://www.gstatic.com/generate_204',
      interval: 300,
    },
  },
};
