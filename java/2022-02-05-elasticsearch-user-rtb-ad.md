---
slug: elasticsearch-user-rtb-ad
title: Elasticsearch 在竞价广告中的检索使用
tags: [elasticsearch,rtb-ad]
authors: [jeesk]
---

## Elasticsearch 在竞价广告中的检索使用




###	 一、广告定向简述

####	1.1 在竞价广告中的定向条件往往如下所示

-    ad1  定向为地域北京,上海,广州,深圳,18~28岁的旅游,健身行业男性,并且要求适用的操作系统为ios,android,广告出价5块
-    ad2  定向为地域成都在18~28岁的健身行业男性,并且要求适用的操作系统为ios和mac,广告出价4.8块
-    ad3  定向为在28~38岁的男性,并且要求适用的操作系统为android,广告出价5.7块
-    ad4  定向为在28~38岁,并且要求适用的操作系统为ios,广告出价5.2块

####	1.2  角色对应广告分析

 -    角色1:     北京,女性,健身行业,操作系统ios
 -    角色2:     广州,男性,18~28岁,旅游行业,操作系统为ios
 -    角色3:     成都,女性,28~38岁,健身行业,操作系统为ios
 -    角色4:     成都,男性,28~38岁,健身行业,操作系统为ios

####	1.3.  认真分析后得出下面每个角色可以推送的广告如下

- 角色1:  ad4
- 角色2:  ad1,ad4
- 角色3:  ad4
- 角色4:  ad2,ad4

往往传统数据库无法满足上述的查询时延, 大厂往往又开发自己的倒排索引系统, 为了减少成本, 可以使用elasticsearch的布尔查询.

### 二、使用elasticsearch 查询实时查询广告

#### 2.1.   mysql中, 如果要查询某个用户满足的广告条件如下可整理为表达式

[（不存在性别定向）|| （存在性别定向且满足条件）]  
&&  [（不存在年龄定向）|| （存在年龄定向且满足条件）]
&&  [（不存在标签定向）|| （存在标签定向且满足条件）]
&&  [（不存在地域定向）|| （存在地域定向且满足条件）]
&&  [（不存在操作系统定向）|| （存在操作系统定向且满足条件）]

####	2.2  准备工具:  postman 或者支持curl命令行, 一台安装了docker的机器

#####	2.2.1	拉取es镜像,并且运行起来

```shell
docker pull docker.io/elasticsearch:7.1.1
docker run -d --name es1  -e ES_JAVA_OPTS="-Xms512m -Xmx512m" -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" b0e9f9f047e6
```

#####	2.2.2    执行命令

postman或者命令行中执行 `curl --location --request GET 'http://192.168.17.77:9200'`

如果返回下面的文档说明你安装单机版本的elasticsearch已经安装完成

```json
{
    "name": "cc51cc2a79ce",
    "cluster_name": "docker-cluster",
    "cluster_uuid": "BveCHkuVTtWwr-rcWDmTpg",
    "version": {
        "number": "7.1.1",
        "build_flavor": "default",
        "build_type": "docker",
        "build_hash": "7a013de",
        "build_date": "2019-05-23T14:04:00.380842Z",
        "build_snapshot": false,
        "lucene_version": "8.0.0",
        "minimum_wire_compatibility_version": "6.8.0",
        "minimum_index_compatibility_version": "6.0.0-beta1"
    },
    "tagline": "You Know, for Search"
}
```

####	2.3.  建立广告索引,查询广告位对应广告

通常用户访问app拉取广告是以广告位为基准, 该广告位下面有n个带有定向条件的广告.那么 查询条件就是广告位id,底价+以及用户自身的属性

创建广告位id为100的索引

`curl --location --request PUT 'http://192.168.17.77:9200/posfor100'`

1. 增加该索引对应的数据(类型于mysql的行数据)

```
北上广深,成都分别映射为 1,2,3,4,5
男女映射为1,2
操作系统ios, android,mac 映射为1,2,3  
行业旅游,健身分别映射为 1,2 
年龄18~28 映射为2
```



插入对应的4条数据,假设上面4个广告对应的id为 101,102,103,104

```json
curl --location --request POST 'http://192.168.17.77:9200/posfor100/_doc/101' \
--header 'Content-Type: application/json' \
--data-raw '{"city":[1,2,3,4],"ageRange":[2],"gender":[1],"os":[1,2],"industry":[1,2],"price":5}'
```

```json
curl --location --request POST 'http://192.168.17.77:9200/posfor100/_doc/102' \
--header 'Content-Type: application/json' \
--data-raw '{"city":[5],"ageRange":[2],"gender":[1],"os":[1,3],"industry":[2],"price":4.8}'
```

```json
curl --location --request POST 'http://192.168.17.77:9200/posfor100/_doc/103' \
--header 'Content-Type: application/json' \
--data-raw '{"ageRange":[2],"gender":[1],"os":[2],"price":5.7}'
```

```json
curl --location --request POST 'http://192.168.17.77:9200/posfor100/_doc/104' \
--header 'Content-Type: application/json' \
--data-raw '{"ageRange":[2],"os":[1],"price":5.2}'
```

1. 假设该广告位100的底价为3块钱,使用布尔查询

角色1 对应的查询

```shell
curl --location --request GET 'http://192.168.17.77:9200/posfor100/_search' \
--header 'Content-Type: application/json' \
--data-raw '{"query":{"bool":{"filter":[{"bool":{"should":[{"term":{"gender":{"value":2,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"gender","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"os":{"value":1,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"os","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"city":{"value":1,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"city","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"industry":{"value":2,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"industry","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"ageRange":{"value":2,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"ageRange","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"filter":[{"range":{"price":{"from":3.0,"to":null,"include_lower":true,"include_upper":true,"boost":1.0}}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}}'
```

得到查询条件如下, 获得了id 104的广告,即是广告4

```json
{
    "took": 403,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.0,
        "hits": [
            {
                "_index": "posfor100",
                "_type": "_doc",
                "_id": "104",
                "_score": 0.0,
                "_source": {
                    "ageRange": [
                        2
                    ],
                    "os": [
                        1
                    ],
                    "price": 5.2
                }
            }
        ]
    }
}
```

角色2对应的查询

```shell
curl --location --request GET 'http://192.168.17.77:9200/posfor100/_search' \
--header 'Content-Type: application/json' \
--data-raw '{"query":{"bool":{"filter":[{"bool":{"should":[{"term":{"gender":{"value":1,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"gender","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"os":{"value":1,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"os","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"city":{"value":4,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"city","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"industry":{"value":1,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"industry","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"should":[{"term":{"ageRange":{"value":2,"boost":1.0}}},{"bool":{"must_not":[{"exists":{"field":"ageRange","boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"minimum_should_match":"1","boost":1.0}},{"bool":{"filter":[{"range":{"price":{"from":3.0,"to":null,"include_lower":true,"include_upper":true,"boost":1.0}}}],"adjust_pure_negative":true,"boost":1.0}}],"adjust_pure_negative":true,"boost":1.0}}}'
```

得到的结果

```json
{
    "took": 3,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 0.0,
        "hits": [
            {
                "_index": "posfor100",
                "_type": "_doc",
                "_id": "101",
                "_score": 0.0,
                "_source": {
                    "city": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "ageRange": [
                        2
                    ],
                    "gender": [
                        1
                    ],
                    "os": [
                        1,
                        2
                    ],
                    "industry": [
                        1,
                        2
                    ],
                    "price": 5
                }
            },
            {
                "_index": "posfor100",
                "_type": "_doc",
                "_id": "104",
                "_score": 0.0,
                "_source": {
                    "ageRange": [
                        2
                    ],
                    "os": [
                        1
                    ],
                    "price": 5.2
                }
            }
        ]
    }
}
```

由上可得角色1获取到ad4,角色2获取到ad1,ad4, 和我们最初得到的结论是一样的2,  剩余角色3,角色4对应的广告,请各位亲自己动手验证.  

###	三、小结

1. 学习到定向条件可以通过es的布尔表达式来检索

   

参考如下

1. [基于布尔表达式的广告索引设计](https://zhuanlan.zhihu.com/p/59658727)
2. [Elasticsearch（Es）聚合查询（指标聚合、桶聚合）](https://www.knowledgedict.com/tutorial/elasticsearch-aggregations.html)