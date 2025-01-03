import scrapy
import json
import re
import os

class DetailSpider(scrapy.Spider):
    name = 'detail'

    def start_requests(self):
        # 加载现有的 JSON 数据
        if not os.path.exists('grammar_data.json'):
            self.log("JSON file not found! Please ensure grammar_data.json exists.")
            return

        with open('grammar_data.json', 'r', encoding='utf-8') as f:
            self.grammar_data = json.load(f)

        # 遍历 JSON 数据，找到 detail 为空的项
        for item in self.grammar_data:
            if not item.get('detail'):  # 只处理 detail 为空的数据
                yield scrapy.Request(
                    url=item['link'],
                    callback=self.parse_detail,
                    meta={'item': item}  # 将数据传递到回调函数
                )

    def parse_detail(self, response):
        # 获取传递的 item 数据
        item = response.meta['item']

        # 提取 detail 内容
        detail = response.css('div.post_content').get()
        if detail:
            # 清理无意义的空白符
            detail = re.sub(r'\s+', ' ', detail).strip()

        # 更新 detail 字段
        item['detail'] = detail if detail else "No detail found"

        # 打印更新日志
        self.log(f"Updated detail for: {item['name']}")

        # 保存数据到 JSON 文件
        self.update_json_file(item)

    def update_json_file(self, updated_item):
        # 修改原始 JSON 文件
        for i, item in enumerate(self.grammar_data):
            if item['link'] == updated_item['link']:
                self.grammar_data[i] = updated_item
                break

        # 写回 JSON 文件
        with open('grammar_data.json', 'w', encoding='utf-8') as f:
            json.dump(self.grammar_data, f, ensure_ascii=False, indent=4)

    def closed(self, reason):
        self.log("Spider closed. All data saved back to grammar_data.json.")


'''
scrapy crawl detail

'''