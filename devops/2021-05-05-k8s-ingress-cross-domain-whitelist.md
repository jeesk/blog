---
slug: k8s-ingress-cross-domain-whitelist
title: K8s的ingress-配置跨域和白名单
authors: [jeesk]
tags: [k8s]
---

配置跨域:
```
    nginx.ingress.kubernetes.io/Access-Control-Allow-Origin: 'http://12341234.s1.natapp.cc'
    nginx.ingress.kubernetes.io/cors-allow-headers: >-
      AUTHTOKEN,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified- 
     Since,Cache-Control,Content-Type,Authorization
    nginx.ingress.kubernetes.io/cors-allow-methods: 'PUT, GET, POST, OPTIONS'
    nginx.ingress.kubernetes.io/cors-allow-origin: 'http://12342134.s1.natapp.cc'
    nginx.ingress.kubernetes.io/enable-access-log: 'true'
    nginx.ingress.kubernetes.io/enable-cors: 'true'
```
配置白名单:
```
nginx.ingress.kubernetes.io/whitelist-source-range: >-
      19.19.29.12
```
配置路由规则
```
spec:
  tls:
    - hosts:
        - mysite
      secretName: mysite.com
  rules:
    - host: rzzm.h5cmpassport.com
      http:
        paths:
          - path: '/abc*|adfd*|group[0-9]'
            pathType: ImplementationSpecific
            backend:
              serviceName: mysiteservice
              servicePort: 8083
```
