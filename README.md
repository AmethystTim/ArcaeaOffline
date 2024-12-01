## Arcaea Offline

**As I always said, if you don't like it, don't play.    —— Guy**

使用`Arcaea Offline`避免Guy哥每月200源点的巨额订阅费用🫵

### Arcaea Offline 支持功能

- [x] 成绩维护
- [x] Best 30生成
- [x] AI酱复活（随机歌曲，推分建议，音游圣经）
- [x] 一键更新新版本曲目信息
- [ ] 个性化设置
- [ ] 歌曲数据备份与恢复 

#### Best 30

![alt text](./assets/readme/image.png)

#### 歌曲成绩维护

![alt text](./assets/readme/image2.png)

#### AI酱对话

![alt text](./assets/readme/image3.png)

<div align="center">

![alt text](./assets/readme/aichan.gif)

</div>

### 快速部署

1. `git clone https://github.com/DinorexTim/ArcaeaOffline.git`
2. `pip install -r requirements.txt`安装依赖

3. 运行`init.py`，完成初始化（包括曲目列表、定数信息、曲绘、搭档头像的爬取以及本地数据库的创建）

4. 运行`start.py`，启动本地服务器

5. 使用浏览器访问`http://localhost:5000`

### 数据源

- [Arcaea 中文维基](https://arcwiki.mcd.blue)
    - `chartconstant.json`: [https://arcwiki.mcd.blue/index.php?title=Template:ChartConstant.json&action=edit'](https://arcwiki.mcd.blue/index.php?title=Template:ChartConstant.json&action=edit')
    - `songlist.json`: [https://arcwiki.mcd.blue/index.php?title=Template:Songlist.json&action=edit](https://arcwiki.mcd.blue/index.php?title=Template:Songlist.json&action=edit)
    - 曲绘: [https://arcwiki.mcd.blue/%E5%AE%9A%E6%95%B0%E8%A1%A8](https://arcwiki.mcd.blue/%E5%AE%9A%E6%95%B0%E8%A1%A8)
    - 搭档头像: [https://arcwiki.mcd.blue/%E6%90%AD%E6%A1%A3](https://arcwiki.mcd.blue/%E6%90%AD%E6%A1%A3)

### 免责声明

- 本项目中的图片来自互联网，仅供学习、分享和交流使用，所有版权归原作者所有
