---
slug: sync-system-time
title: linux服务器时间同步
authors: [jeesk]
tags: [linux]
---
> >  最近发现自己的服务器时间变成了 EDT , 这个是美国东部夏令时间. 那么如何将服务器的时间变成中国的时间,并且同步呢.

1.  安装 centos 的时间同步工具
``` 
yum -y install ntp
```
2.  如果机器的时区不是中国时区需要重新设置时区
```
mv /etc/localtime /etc/localtime.bak
ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
3.  执行同步命令
```
同步淘宝的时间服务
ntpdate ntp1.aliyun.com 
```
4.  修改服务器映射到我们系统的时间，ok；
```
hwclock --systohc
```
5. 增加定时任务同步时间
```
crontab -e  进入定时任务 ,  每隔10分钟同步一次系统时间
*/10 * * * *  /usr/sbin/ntpdate  ntp1.aliyun.com  
```
>  路过点赞, 月薪10W
