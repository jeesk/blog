---
slug: install-zookeeper-cluster-lesson
title: Zookeeper集群安装教程
authors: [jeesk]
tags: [zookeeper]
---
>  安装前置条件
 -  3台安装JDK 8 的虚拟机,假设地址分别是192.168.17.81,192.168.17.82,192.168.17.83

zookeeper 发行版页面, 有许多版本的发行版的下载链接,可以根据不同的版本,下载不同的链接
`https://zookeeper.apache.org/releases.html`
1.   $\color{#FF0000}{修改 hosts }$
```
vim /etc/hosts
加入一下内容
192.168.17.81 zk01
192.168.17.82 zk02
192.168.17.83 zk03
```
后面我将使用zk01 代替192.168.17.81 
2.   $\color{#FF0000}{在zk01机器上面下载zookeeper}$
```
mkdir -p /opt/soft/ && cd  /opt/soft
wget  https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.2/apache-zookeeper-3.6.2-bin.tar.gz
如果机器没有安装wget, 那么执行下面命令安装
yum -y install wget
```
3.   $\color{#FF0000}{分发zoookeeper软件 到另外两台机器}$
```
1. 首先在另外两台机器创建目录
mkdir -p /opt/soft/ && cd  /opt/soft
2. 在zk01 的/opt/soft 的目录下执行
scp apache-zookeeper-3.6.2-bin.tar.gz root@zk02:/opt/soft/
scp apache-zookeeper-3.6.2-bin.tar.gz root@zk03:/opt/soft/
```
4.    $\color{#FF0000}{解压文件}$
       1.  在3台的机器的/opt/soft/ 文件夹执行解压命令
        `   tar -zxvf  apache-zookeeper-3.6.2-bin.tar.gz  `
        2. 在3台的机器的/opt/soft/ 继续执行软连接
        `ln -s /opt/soft/apache-zookeeper-3.6.2-bin  zookeeper`
        3.  创建需要的数据文件夹,和日志文件夹, 在后面的配置文件使用需要
          `cd zookeeper && mkdir {data,log}`
5.    $\color{#FF0000}{增加配置文件}$
在zk01上 的`/opt/soft/zookeeper-3.5.2-alpha/conf`增加 zoo.cfg文件,文件内容如下
     
  ```
    initLimit=10
    syncLimit=5
    clientPort=2181
    tickTime=2000
    dataDir=/opt/soft/apache-zookeeper-3.6.2-bin/data/
    dataLogDir=/opt/apache-zookeeper-3.6.2-bin/logs/
    dynamicConfigFile=/opt/soft/apache-zookeeper-3.6.2-bin/conf/zoo.cfg.dynamic.100000000
  ```
-  在/opt/soft/zookeeper-3.5.2-alpha/conf 增加配置zoo.cfg.dynamic.100000000 文件, 这个文件是说明zk 的集群机器的ip地址,文件内容如下
```
server.1=zk01:2888:3888:participant
server.2=zk02:2888:3888:participant
server.3=zk03:2888:3888:participant
```
-  将这个两个文件分发到zk02,zk03,在zk01 的/opt/soft/zookeeper-3.5.2-alpha/conf/ 执行命令
```
scp zoo.cfg root@zk02:/opt/soft/zookeeper-3.5.2-alpha/conf/
scp zoo.cfg root@zk02:/opt/soft/zookeeper-3.5.2-alpha/conf/
scp zoo.cfg.dynamic.100000000 root@zk03:/opt/soft/zookeeper-3.5.2-alpha/conf/
scp zoo.cfg.dynamic.100000000 root@zk03:/opt/soft/zookeeper-3.5.2-alpha/conf/
```

6.    $\color{#FF0000}{增加每一台机器的标识 }$
在3台机器上面的 `/opt/soft/zookeeper-3.5.2-alpha/conf/data` 执行命令
zk01 执行  `echo 1 > myid`
zk02 执行  `echo 2 > myid`
zk03 执行  `echo 3 > myid`

7.   $\color{#FF0000}{常用命令 }$

在3 台机器的 `/opt/soft/zookeeper-3.5.2-alpha/bin/ ` 执行
-  启动命令  ` ./zkServer.sh start  `
-  查看启动状态 ` ./zkServer.sh status  `  
```
ZooKeeper JMX enabled by default
Using config: /opt/soft/zookeeper-3.5.2-alpha/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower
------------------- 192.168.17.82 -------------------
ZooKeeper JMX enabled by default
Using config: /opt/soft/zookeeper-3.5.2-alpha/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader
------------------- 192.168.17.83 -------------------
ZooKeeper JMX enabled by default
Using config: /opt/soft/zookeeper-3.5.2-alpha/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: followe
```
-  关闭命令: `./zkServer.sh status`
8.   $\color{#FF0000}{常见问题:}$
-  确保3台机器的防火墙端口2181 已经放开, 如果是本地环境建议直接`service fillwalld stop` 关闭防火墙
-  3台机器分别执行太麻烦, 参考 zookeeper  [集群脚本](https://www.jianshu.com/p/f2d1e2cba91d) 
> 完结撒花, 路过点赞, 月入10 W!
