---
slug: install-cluster-apache-storm
title: Storm-集群搭建入门
authors: [jeesk]
tags: [storm]
---

####  前置工作
1.  3台 安装JDK 8的虚拟机
2.  3台机器安装 zookeeper 集群的机器
3.  修改hosts 如下,假设我们有3 台机器,ip 192.168.17.81,192.168.17.82,192.168.17.83, 修改hosts文件
```

192.168.17.81 zk01 kafka01 storm01
192.168.17.82 zk02 kafka02 storm02
192.168.17.83 zk03 kafka03 storm03
```
1.  下载storm 安装包
打开storm 发行版页面 `http://storm.apache.org/downloads.html`, 选取一个storm 的二进制下载 ```
```
wget  https://www.apache.org/dyn/closer.lua/storm/apache-storm-2.2.0/apache-storm-2.2.0.tar.gz
```
2.  分发解压
```
# 在storm01 的机器上面执行, 3 台机器记得配置互相免密登录
 scp apache-storm-2.2.0.tar.gz root@storm02:/opt/soft/
 scp apache-storm-2.2.0.tar.gz root@storm03:/opt/soft/
#  在3 台机器对应的目录执行解压, 软连接
tar -zxvf apache-storm-2.2.0.tar.gz  && ln -s  /opt/soft/apache-storm-2.2.0 storm
``` 
3.  修改配置
在storm01 的 /opt/soft/storm/conf 目录下执行一面的操作
```
cp storm.yaml storm.yaml.bak
vim storm.yaml
```
文件里面粘贴如下内容
```
#  storm 的3台机器
storm.zookeeper.servers:
        - "storm01"
        - "storm02"
        - "storm03"
# 配置nimbus 机器的IP
nimbus.host:    "storm01"
# 配置对应组件的jvm 内存
nimbus.childopts:       "-Xmx1024m"
supervisor.childopts:   "-Xmx1024m"
worker.childopts:       "-Xmx1024m"
ui.childopts:   "-Xmx768m"
# 配置supervisor 的端口
supervisor.slots.ports:
        -       6700
        -       6701
        -       6702
        -       6703
# 配置storm ui的端口, 这个端口是nimbus 机器上启动的ui. 
ui.port: 9999
```
将storm.yaml, 分发到另外2台机器上面
```
scp storm.yaml root@storm02:/opt/soft/storm/conf
scp storm.yaml root@storm03:/opt/soft/storm/conf
```

4.  相关命令在storm 的bin目录执行
  -  启动nimbus:  `./storm nimbus `
  -  启动storm ui:  `./storm ui`
  -  启动supervisor:  `./storm supervisor`
  -  启动拓扑: `./storm jar xxxxx.jar  拓扑名称`
  -  杀死拓扑: `./storm kill 拓扑名称 -w 10` , 执行kill 命令可以通过-2
 等待秒数,执行停用以后的等待时间
 +  停用任务:  `./storm deactivte 拓扑名称`
  -  启用任务: `./storm activate 拓扑名`
  -  重新部署任务: `./storm rebalance 拓扑名`
 注意, 启动nimbus, ui 的命令只能在nimbus 的机器上面执行, 启动supervisor 只能在另外2台机器上面执行.  
    上面storm ui的访问地址 http://storm01:9999/index.html

>  完结撒花,路过点赞, 月入10W .


