from urllib.parse import urljoin
from numpy import rint
import requests
from bs4 import BeautifulSoup
import re
import os

# Arcaea 中文维基定数表
url = 'https://arcwiki.mcd.blue/%E6%90%AD%E6%A1%A3'
curdir = os.path.abspath(os.path.dirname(__file__))
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    res = soup.find_all('img')
    avatars_urls = [urljoin(url,img['src']) for img in res if 'src' in img.attrs]

    index = 0
    for url in avatars_urls:
        index += 1
        print(f"当前： {url}, 进度{index}/{len(avatars_urls)}")
        match = re.search(r'Partner_(.*?)_icon\.png', url)
        if not match:
            continue
        if os.path.exists(os.path.join(curdir,f"./assets/avatars/{match.group(1)}.png")):
            print(f"{match.group(1)}已存在，跳过")
            continue        
        response = requests.get(url)
        if response.status_code == 200:
            with open(os.path.join(curdir,f"./assets/avatars/{match.group(1)}.png"), "wb") as file:
                file.write(response.content)
        else:
            print(f"请求失败，状态码: {response.status_code}")
    print('done :)')
else:
    print(f"请求失败，状态码: {response.status_code}")