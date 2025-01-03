import requests
from bs4 import BeautifulSoup
import json

# 目标URL
url = "https://mainichi-nonbiri.com/japanese-grammar/"

# 发送GET请求
response = requests.get(url)

# 检查请求状态
if response.status_code == 200:
    # 解析HTML内容
    soup = BeautifulSoup(response.content, 'html.parser')

    # 查找主容器
    post_content = soup.find('div', class_='post_content')
    
    if post_content:
        # 存储提取的JSON数据
        data_list = []

        # 遍历所有<h3>标签 (文法类别)
        for h3_tag in post_content.find_all('h3'):
            # 获取当前的 category 名称
            category = h3_tag.get_text(strip=True)

            # 遍历该<h3>下的<p>标签（文法项）
            for p_tag in h3_tag.find_next_siblings('p', limit=1):
                # 提取 <a> 标签中的链接和文本内容
                for a_tag in p_tag.find_all('a'):
                    # 获取文法名称
                    name = a_tag.get_text(strip=True)

                    # 获取文法链接
                    link = a_tag['href']

                    # 提取 level（假设在 <span> 中）
                    span_tag = a_tag.find_previous('span')
                    level = span_tag.get_text(strip=True).replace('【', '').replace('文法】', '') if span_tag else "Unknown"
                    
                    # 提取首字母（在 <span> 标签之后的字符）
                    first_match = span_tag.next_sibling.strip() if span_tag else None
                    first = first_match[0] if first_match else "Unknown"

                    # 提取 item（从 link 的最后一个部分获取）
                    item = link.rstrip('/').split('/')[-1]

                    # 组装数据项
                    data = {
                        "name": name,
                        "category": category,
                        "first": first,
                        "level": level,
                        "item": item,
                        "link": link,
                        "detail": ""
                    }

                    # 添加到结果列表
                    data_list.append(data)
        
        # 将数据保存到JSON文件
        with open("grammar_data.json", "w", encoding="utf-8") as json_file:
            json.dump(data_list, json_file, ensure_ascii=False, indent=4)

        # 统计去重的 item 数量
        items = [entry['item'] for entry in data_list]
        unique_items = set(items)

        print(f"数据已成功保存到 grammar_data.json 文件中！")
        print(f"总 item 数量（包括重复）：{len(items)}")
        print(f"去重后的 item 数量：{len(unique_items)}")
    else:
        print("未找到 <div class='post_content'> 标签的内容")
else:
    print(f"请求失败，状态码：{response.status_code}")
