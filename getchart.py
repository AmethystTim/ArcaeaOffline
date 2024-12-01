import requests
from bs4 import BeautifulSoup
import json

url_chartconstant = 'https://arcwiki.mcd.blue/index.php?title=Template:ChartConstant.json&action=edit'
url_songlist = 'https://arcwiki.mcd.blue/index.php?title=Template:Songlist.json&action=edit'
response = requests.get(url_chartconstant)
if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    chartconstant = json.loads(soup.find_all('textarea')[0].get_text())
    with open('./data/chartconstant.json', 'w') as f:
        json.dump(chartconstant, f, indent=4)
else:
    print(f"请求失败，状态码: {response.status_code}")

response = requests.get(url_songlist)
if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    songlist = json.loads(soup.find_all('textarea')[0].get_text())
    with open('./data/songlist.json', 'w') as f:
        json.dump(songlist, f, indent=4)
else:
    print(f"请求失败，状态码: {response.status_code}")
    
print("done :)")