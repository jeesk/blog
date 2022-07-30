---
slug: zookeeper-cluster-start-script
title: Zookeeper一键群启脚本
authors: [jeesk]
tags: [zookeeper]
---

 >    为了方便管理zookeeper 集群, 我们写了一个zookeeper 脚本

1.  在bin/zkEnv.sh文件中,zk 增加JAVA_HOME .(有些时候无法找到JAVA_HOME,所以先增加JAVA_HOME)
  ```
ZOOBINDIR="${ZOOBINDIR:-/usr/bin}"
ZOOKEEPER_PREFIX="${ZOOBINDIR}/.."
#在上面的2段文字下面增加 JAVA_HOME, 下面的路径是你的 jdk HOME目录
export JAVA_HOME=/opt/soft/jdk1.8.0_161
```
2.  3 台机器免密登录, 分别为zk01,zk02,zk03
     
```
# zk01 执行 
ssh-copy-id root@zk02
ssh-copy-id root@zk03
```
 
```
#  zk02 执行 
ssh-copy-id root@zk01
ssh-copy-id root@zk03
```
```
#  zk03 执行 
ssh-copy-id root@zk01
ssh-copy-id root@zk02
```
这个时候, 你可以使用 在任意一台机器上面执行免密登录
3.  在2台机器下面的 bin 目录下面增加  zkCluster.sh
```

#!/bin/bash

red='\e[91m'
green='\e[92m'
yellow='\e[93m'
magenta='\e[95m'
cyan='\e[96m'
none='\e[0m'

zk_home=$zk_home
cluster_array=(192.168.17.81 192.168.17.82 192.168.17.83)

# 1. 获取输入参数个数，如果没有参数，直接退出
if (($# == 0)); then
    echo -e ------------------- ${yellow}no args${none} -------------------
    exit
fi

# 2. 根据指令循环操作集群
case $1 in
"start") {
    for host in ${cluster_array[@]}; do
        echo -e ------------------- $yellow$host$none -------------------
        ssh $host "$zk_home/bin/zkServer.sh start"
    done
} ;;

"stop") {
    for host in ${cluster_array[@]}; do
        echo -e ------------------- $yellow$host$none -------------------
        ssh $host "$zk_home/bin/zkServer.sh stop"
    done
} ;;

"status") {
    for host in ${cluster_array[@]}; do
        echo -e ------------------- $yellow$host$none -------------------
        ssh $host "$zk_home/bin/zkServer.sh status"
    done
} ;;

esac
```
上面的 cluster_array 就是你的3台机器ip ,也可以使用别名代替
这个时候, 你可以在任意一台机器的zk bin目录下面执行
-  群启动: ./zkCluster.sh start 
-  群关闭: ./zkCluster.sh stop 
-  群查看状态: ./zkCluster.sh status 
如果脚本没有执行权限, 增加执行权限 `chmod u+x zkCluster.sh`  即可.

>  完结撒花, 路过点赞, 月入10W !
