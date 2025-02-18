import json
import scrapy
from urllib.parse import urlparse
import re
import os


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

        # 提取 MP3 链接
        mp3_links = response.css('a.sounds::attr(data-file)').getall()
        voice = [mp3 + ".mp3" for mp3 in mp3_links]

        if content:
            # 清理 HTML 排版中的空白符，保留标签结构
            content = self.clean_html_whitespace(content)

            # 处理 <img> 标签，保留 data-src 或 src
            content = self.rewrite_img_tags(content)

            # 提取处理后的图片链接（只包含 `src`）
            img_links = re.findall(r'<img src="([^"]+)"', content)

            # 记录 JSON 数据
            self.results.append({
                "item": self.items[response.url],
                "content": content
            })

            # 下载 MP3 文件
            for mp3_url in voice:
                yield scrapy.Request(url=mp3_url, callback=self.download_mp3)

            # 下载图片文件
            for img_url in img_links:
                yield scrapy.Request(url=img_url, callback=self.download_image)
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

    def rewrite_img_tags(self, html):
        """
        Rewrite HTML's <img> tags to retain only the data-src attribute
        and remove <noscript> tags entirely.
        """
        # Remove <noscript> tags and their content
        html = re.sub(r'<noscript>.*?</noscript>', '', html, flags=re.DOTALL)
        
        # Rewrite <img> tags to keep only the data-src attribute
        return re.sub(
            r'<img [^>]*?data-src="([^"]+)"[^>]*?>',
            r'<img src="\1">',
            html
        )

    def closed(self, reason):
        # 保存结果到 JSON 文件
        with open('grammar_detail.json', 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=4)
        self.logger.info("Data saved to grammar_detail.json")

    def download_mp3(self, response):
        # 解析 URL 来获取路径
        parsed_url = urlparse(response.url)
        url_path = parsed_url.path.lstrip("/")  # 去掉开头的 "/"
        save_path = os.path.join("files", url_path)  # 存在本地的路径

        # 确保保存目录存在
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 保存 MP3 文件
        with open(save_path, "wb") as f:
            f.write(response.body)

        self.logger.info(f"Downloaded MP3: {save_path}")


    def download_image(self, response):
        # 解析 URL 来获取路径
        parsed_url = urlparse(response.url)
        url_path = parsed_url.path.lstrip("/")  # 去掉开头的 "/"
        save_path = os.path.join("files", url_path)  # 存到 images 目录

        # 确保保存目录存在
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 保存图片
        with open(save_path, "wb") as f:
            f.write(response.body)

        self.logger.info(f"Downloaded Image: {save_path}")




'''
cd grammar_spider
scrapy crawl grammar
'''