import scrapy

class GrammarSpider(scrapy.Spider):
    name = "grammar"
    start_urls = ['https://mainichi-nonbiri.com/japanese-grammar']

    def parse(self, response):
        grammar_items = []

        # 定位到 <div class="post_content">
        content = response.css('div.post_content')

        # 获取所有顶层标题和其对应的范围
        top_titles = content.xpath('.//h2')
        h2_ranges = [(h2, h2.xpath('./following-sibling::*')) for h2 in top_titles]

        for h2, h2_siblings in h2_ranges:
            top_title = h2.css('::text').get()  # 获取顶层标题名称
            
            # 在当前顶层标题范围内寻找分类标题
            categories = h2_siblings.css('h3')
            for category in categories:
                category_name = category.css('::text').get()  # 获取分类名称
                
                # 查找当前分类下的词条
                items = category.xpath('following-sibling::p[1]').css('a')
                for item in items:
                    grammar_item = {
                        "top_title": top_title,  # 添加顶层标题字段
                        "level": item.xpath('./preceding-sibling::span[1]/text()').re_first(r"【(.+?)文法】"),
                        "name": item.css('::text').get(),
                        "category": category_name,
                        "link": item.css('::attr(href)').get()
                    }
                    grammar_items.append(grammar_item)

        # 将结果以 JSON 格式保存
        yield {"grammar": grammar_items}



# 运行↓
# scrapy crawl grammar -o grammar.json
