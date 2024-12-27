from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
import re

# Arcaea 中文维基定数表
url = 'https://arcwiki.mcd.blue/%E5%AE%9A%E6%95%B0%E8%A1%A8'

response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    res = soup.find_all('img')
    illustration_urls = [urljoin(url,img['src']) for img in res if 'src' in img.attrs]
    
    index = 0
    for url in illustration_urls:
        index += 1
        print(f"当前： {url}, 进度{index}/{len(illustration_urls)}")
        match = re.search(r'Songs_([^/]+)\.jpg', url)
        if not match:
            continue
        response = requests.get(url)
        if response.status_code == 200:
            with open(f"./assets/illustrations/{match.group(1)}.jpg", "wb") as file:
                file.write(response.content)
        else:
            print(f"请求失败，状态码: {response.status_code}")
    print('done :)')
else:
    print(f"请求失败，状态码: {response.status_code}")