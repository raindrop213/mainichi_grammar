# -*- coding: utf-8 -*-
import scrapy
from scrapy1.items import ScrapyItem

class TestSpider(scrapy.Spider):
    name = 'test' #起了个爬虫名，这个爬虫名代表整个文件
    allowed_domains = ['www.itcast.cn'] #表示我们只在这个网站区域内爬，不会爬到外面去。
    start_urls = ['http://www.itcast.cn/channel/teacher.shtml'] #表示我们从这个网址开始爬。

    def parse(self, response):
        node_list = response.xpath("//div[@class='li_txt']")  #表示我们爬取的源码位置，建议小伙伴们先百度了解一下xpath语法

        items=[]
        for node in node_list:

            item = ScrapyItem()

            name = node.xpath("./h3/text()").extract() #表示爬取h3标签下的文本，.extract()将xpath对象转化为Unicode字符串格式
            title = node.xpath("./h4/text()").extract()
            info = node.xpath("./p/text()").extract()
            
            item['name'] = name[0] #表示每次取name列表中的第一个元素，不用的话会爬取到很多无关的数据。
            item['title'] = title[0]
            item['info'] = info[0]
            items.append(item)
            
        return items