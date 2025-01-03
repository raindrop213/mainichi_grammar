import json
import scrapy
import re


class GrammarSpider(scrapy.Spider):
    name = "grammar"

    def start_requests(self):
        # 读取 JSON 数据
        with open('grammar_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 去重处理
        self.visited_links = set()
        self.items = {}  # 存储 item 和 link 的对应关系
        self.results = []  # 存储结果数据

        for entry in data:
            item = entry['item']
            link = entry['link']
            if link not in self.visited_links:
                self.visited_links.add(link)
                self.items[link] = item
                yield scrapy.Request(url=link, callback=self.parse)

    def parse(self, response):
        # 提取 <div class="post_content"> 的内容
        content = response.css('div.post_content').get()

        if content:
            # 清理 HTML 排版中的空白符，保留标签结构
            content = self.clean_html_whitespace(content)

            # 将结果保存到列表中
            self.results.append({
                "item": self.items[response.url],
                "content": content
            })
        else:
            self.logger.warning(f"No content found in {response.url}")

    def clean_html_whitespace(self, html):
        """
        清理 HTML 中的多余空白符，保留标签内的空白符。
        """
        # 去掉标签之间多余的换行和空格
        html = re.sub(r'>\s+<', '><', html)
        # 去掉 HTML 文本开头和结尾的多余空白符
        html = re.sub(r'^\s+|\s+$', '', html)
        return html

    def closed(self, reason):
        # 保存结果到 JSON 文件
        with open('grammar_detail.json', 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=4)
        self.logger.info("Data saved to grammar_detail.json")
