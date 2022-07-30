---
slug: josephu-question
title: 约瑟夫问题详细解法
authors: [jeesk]
tags: [algorithm] 
---

 

##		约瑟夫问题的几种算法
>据说著名犹太历史学家Josephus有过以下的故事：在罗马人占领乔塔帕特后，39 个犹太人与Josephus及他的朋友躲到一个洞中，39个犹太人决定宁愿死也不要被敌人抓到，于是决定了一个自杀方式，41个人排成一个圆圈，由第1个人开始报数，每报数到第3人该人就必须自杀，然后再由下一个重新报数，直到所有人都自杀身亡为止。然而Josephus 和他的朋友并不想遵从。首先从一个人开始，越过k-2个人（因为第一个人已经被越过），并杀掉第k个人。接着，再越过k-1个人，并杀掉第k个人。这个过程沿着圆圈一直进行，直到最终只剩下一个人留下，这个人就可以继续活着。问题是，给定了和，一开始要站在什么地方才能避免被处决。Josephus要他的朋友先假装遵从，他将朋友与自己安排在第16个与第31个位置，于是逃过了这场死亡游戏

现在简单的举个例子:

假如一共有8个, 从第一个开始报数, 然后每次报3个人出圈

1,2,3,4,5,6,7,8

1.  1,2,3,4,5,6,7,8      3号出圈
2.  1,2,4,5,6,7,8         6号出圈
3.  1,2,4,5,7,8            1号出圈
4.   2,4,5,7,8               5号出圈
5.    2,4,7,8                 2号出圈
6.    4,7,8                    8号出圈
7.    4,7                       4号出圈
8. ​     7                         

现在大家应该是明白了, 约瑟夫算法的玩法, 那么下面分享几种不同思路的解法

###	1. 环形链表解法

####		1.1	思路分析

1.   首先是拿到环形链表的第一个数据first , 和最后一个数据last
2.   在报数的时候,  循环报数,  每次first 和last 移动(m-1)次, 然后删除当前节点, 相当于出圈
3.   当过first= last的时候, 只有最后一个人了

####	1.2 代码实战

```java
package com.shanjiancaofu;

public class JosephuQuestion {
    public static void main(String[] args) {
        LinkedCircle linkedCircle = new LinkedCircle();
        // 增加8个人, 计算出圈的人
        linkedCircle.addEle(8);
        linkedCircle.calu(1, 3);
    }

    public static class LinkedCircle {
        
        /**
         * @param startNo  从第几个人开始数
         * @param countNum 报数
         */
        public void calu(int startNo, int countNum) {
            // 找到最后一个数据
            Element lastEle = first;
            while (true) {
                if (lastEle.getNext() == first) {
                    break;
                }
                lastEle = lastEle.getNext();
            }

            // 将lastEle和first 移动(startNo-1), 这里移动的原因是因为实际情况可能不是从第一个人开始报数
            for (int i = 0; i < startNo - 1; i++) {
                lastEle = lastEle.getNext();
                first = first.next;
            }

            // 循环报数
            while (true) {
                if (lastEle == first) {
                    // 只有一个数据
                    break;
                }
                // 执行报数, 移动first数据,找到出圈的人
                for (int i = 0; i < countNum - 1; i++) {
                    lastEle = lastEle.getNext();
                    first = first.next;
                }
                // 得到的first 就是移除圈的人
                System.out.println("移除圈的人NO:" + first.getNo());
                first = first.next;
                lastEle.setNext(first);
            }

        }


        private Element first;

        /**
         * 增加几个数据
         *
         * @param nums 增加的数据个数
         */
        public void addEle(int nums) {
            if (nums <= 0) {
                System.out.println("参数异常");
                return;
            }
            // 链表的最后一个数据
            Element lastElement = null;

            for (int i = 1; i <= nums; i++) {
                Element element = new Element();
                element.setNo(i);
                if (i == 1) {
                    // 第一个数据是first, 并且first的next也是first自己
                    first = element;
                    first.setNext(first);
                    lastElement = first;
                } else {
                    // 其他的数据next是first,
                    element.next = first;
                    // 设置上一个数据的next是最后一个数据
                    lastElement.next = element;
                    // 并且更新lastElelment为最后一个数据
                    lastElement = element;
                }
            }
        }


        /**
         * 数据
         */
        public static class Element {
            // 数据编号
            private int no;
            // 下一个为数据
            private Element next;

            public int getNo() {
                return no;
            }

            public void setNo(int no) {
                this.no = no;
            }

            public Element getNext() {
                return next;
            }

            public void setNext(Element next) {
                this.next = next;
            }
        }
    }

}

```

####		1.3 控制台如下

```
移除圈的人NO:3
移除圈的人NO:6
移除圈的人NO:1
移除圈的人NO:5
移除圈的人NO:2
移除圈的人NO:8
移除圈的人NO:4
```

