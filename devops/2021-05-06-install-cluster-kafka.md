---
slug: install-cluster-kafka
title: Kafka-集群教程,及若干配置说明
authors: [jeesk]
tags: [kafka]
---


####  前置需求

-    3台装有JDK 8 的虚拟机
-    zookeeper 集群 3台
-    假设有3台机器, 192.168.17.81,192.168.17.82,192.168.17.83 分别个别名
     修改 /etc/hosts 文件增加下面别名, 方面脚本操作

```
192.168.17.81 zk01 kafka1
192.168.17.82 zk02 kafka2 
192.168.17.83 zk03 kafka3 
```

####  安装教程 

1.  $\color{#FF0000}{下载 kafka 安装包,并且分发安装包到另外2台机器}$
    打开 kafka 发行版的下载页面 `http://kafka.apache.org/downloads`, 这里有很多的版本, 我们选取最新的一个版本下载

```
cd /opt/soft
wget https://www.apache.org/dyn/closer.cgi?path=/kafka/2.6.0/kafka_2.12-2.6.0.tgz
scp  kafka_2.12-2.6.0.tgz root@zk02:/opt/soft/
scp  kafka_2.12-2.6.0.tgz root@zk03:/opt/soft/
```

2.   $\color{#FF0000}{修改 hosts }$
      -  解压文件

```
# 3台机器分别执行解压命令,和软连接命令
tar -zxvf  kafka_2.12-2.6.0.tgz && ln -s /opt/soft/kafka_2.12-2.6.0 kafka
# 进入kafka 
cd kafka
```

  -  修改配置文件  config/server.properties
     这个文件需要修改的配置

```
# 这里的id , 3台机器必须不同
broker.id=0
# 这是新增的配置, 让topic 能够删除
delete.topic.enable=true
# 新增的配置, 配置3 台机器的zk
zookeeper.connect=zk01:2181,zk02:2181,zk03:2181
# 修改配置
listeners=PLAINTEXT://=zk01:9092
```

>  如果意外没有修改delete.topic.enable=true , 如何删除kafka 的topic呢。 
1.  手动在zk 里面删除brokers/topics/主题名，、config/topics/主题名
2. 删除kafka 的data， 一般在log.dir,或者log.dirs 的 目录删除和主题名为前缀的文件即可。

将这个文件分发到另外2台机器对应的目录, 然后 3台机器不同的地方主要是:

-  broker.id=0, 这里的id , 3台机器必须不同
-  listeners=PLAINTEXT://=zk01:9092 , 这 zk01, 在另外两台分别替换成zk02,zk03

3. $\color{#FF0000}{常用命令}$
   如下: 
       -   启动:  `/opt/soft/kafka/bin/kafka-server-start.sh -daemon config/server.properties`

     -   关闭:  `bin/kafka-server-stop.sh stop`
     -   查看所有的 topic:   ` bin/kafka-topics.sh --zookeeper zk01:2181 --list` , 这里的 zk01, 
     -   创建topic:  ` bin/kafka-topics.sh  --zookeeper zk01:2181 --create --replication-factor 3 --partitions 1 --topic bade ` 
         这里的zk01 是你zk的机器, replication-factor 定义复本数量,partitions 定义分区数量
   -   创建topic 的时候增加配置 

   bin/kafka-topics.sh  --zookeeper zk01:2181 --create --replication-factor 3 --partitions 1 --topic bade --config max.message.bytes=10000

   - 修改opic 的时候删除配置 `bin/kafka-topics.sh  --zookeeper zk01:2181 --create --replication-factor 3 --partitions 1 --topic bade --delete_config max.message.bytes`	

   - 删除topic:  `bin/kafka-topics.sh  --zookeeperhadoop102:2181  --delete --topic first ` , 注意: 如果 你在 config/server.properties 里面没有定义 delete.topic.enable=true, 那么 topic 只是标记删除了

   - 指定topic 发送消息:  `bin/kafka-console-producer.sh --broker-list hadoop102:9092 --topic  first` , 注意这里v的first 是topic 的名称
   - 指定topic 消费消息: `bin/kafka-console-consumer.sh --bootstrap-server hadoop102:9092 --topic first`
    - 查看Topic详情: `bin/kafka-topics.sh  --zookeeper 192.168.17.81:2181 --describe --topic first` , 这里的first 是topic名称
   - 修改topic 分区数量: `bin/kafka-topics.sh  --zookeeper 192.168.17.81:2181 --alter --topic first --partitions 6`
     tips: 注意如果事通过key来计算分区，进行顺序消费，增加分区三思而后行。 分区数量只能增加不能减少。
   - 查看不可用的分区 `bin/kafka-topics.sh  --zookeeper 192.168.17.83:2181 --describe --unavailable-partitions`
   - 查看覆盖配置的topic ` bin/kafka-topics.sh  --zookeeper 192.168.17.83:2181 --describe --topics-with-overrides`
   - 查看包含失效的副本分区 `bin/kafka-topics.sh  --zookeeper 192.168.17.83:2181 --describe --under-replicated-partitions` 
   - 创建主题增加不存在才创建的配置 ` bin/kafka-topics.sh  --zookeeper zk01:2181 --create --replication-factor 3 --partitions 1 --topic bade  --if-not-exists`
   - 修改主题配置存在主题才修改 `bin/kafka-topics.sh  --zookeeper 192.168.17.81:2181 --alter --topic first --partitions 6 --if-exists`
    -   新版配置管理kafka-config.sh



4.   $\color{#FF0000}{kakfa 配置说明}$
        如下:  
              1.    在我们生产环境中的ack 配置 是0. 不等待broker的ack, 提供一个最低的延迟, broker 没有写入磁盘就已经返回,可能丢失数据.
              2.    ack  = 1, 当partition的leader 的数据落盘就返回,如果在follower 同步成功之前leader 故障可能丢失诗句
              3.    ack = -1, 当partition的leader 和follower 全部落地后才会返回ack, 如果在follower 同步完成后, broker 发送ack 之前 leader 发生故障, 那么将会造成重复

5.   $\color{#FF0000}{故障处理细节}$

log文件的HW和LEO

LEO : LOG END OFFSET 每个复本最大的offset

HW: 指的是消费者能够见到的最大的offset, ISR 最小的LEO. 

- follower  故障
  **follower 发生故障后会被临时踢出 ISR，待该 follower 恢复后，follower 会读取本地磁盘**
  **记录的上次的 HW，并将 log 文件高于 HW 的部分截取掉，从 HW 开始向 leader 进行同步。**
  **等该 follower  的 LEO  大于等于该 Partition 的 的 HW，即 follower 追上 leader 之后，就可以重**
  **新加入 ISR 了。**
- leader  故障
  **leader 发生故障之后，会从 ISR 中选出一个新的 leader，之后，为保证多个副本之间的数据一致性，其余的 follower 会先将各自的 log 文件高于 HW 的部分截掉，然后从新的 leader**
  **同步数据。**(注意： 这只能保证副本之间的数据一致性，并不能保证数据不丢失或者不重复)

6  .  $\color{#FF0000}{测试consumer 是否重复消费的情况}$

    ```
    在2台机器上执行(下面的ip要修改成自己机器的IP)
    bin/kafka-console-consumer.sh --bootstrap-server 192.168.17.82:9092 --topic bade --consumer.config config/consumer.properties
      
    ```

>如果发生这个错误
>
>(id: -3 rack: null) disconnected (org.apache.kafka.clients.NetworkClient)

```shell
bin/kafka-console-consumer.sh --bootstrap-server 192.168.17.82:2181 --topic first --consumer.config config/consumer.properties
```

端口号的问题，以前启动消费者的时候监听的端口是 2181，但是新版本的kafka对zookeeper的依赖没有那么强烈了，所以改成了自己的 9092。  

```shell
bin/kafka-console-consumer.sh --bootstrap-server 192.168.17.82:9092,192.168.17.82:9092,192.168.17.83:9092 --topic first --consumer.config config/consumer.properties
```

```shell
bin/kafka-console-producer.sh --broker-list 192.168.17.81:9092 --topic first
```
你会发现consumer 的控制台显示的消息没有重复显示
