import subprocess
import os

print( '==============================================================================================')
print(r'       _____                                               _____  _____.__  .__               ')
print(r'      /  _  \_______   ____ _____    ____ _____      _____/ ____\/ ____\  | |__| ____   ____  ')
print(r'     /  /_\  \_  __ \_/ ___\\__  \ _/ __ \\__  \    /  _ \   __\\   __\|  | |  |/    \_/ __ \ ')
print(r'    /    |    \  | \/\  \___ / __ \\  ___/ / __ \_ (  <_> )  |   |  |  |  |_|  |   |  \  ___/ ') 
print(r'    \____|__  /__|    \___  >____  /\___  >____  /  \____/|__|   |__|  |____/__|___|  /\___  >')
print(r'            \/            \/     \/     \/     \/                                   \/     \/ ')
print( '==============================================================================================')

curdir = os.path.abspath(os.path.dirname(__file__))
print("正在创建本地数据库")
subprocess.run(['python', os.path.join(curdir,'./data/initDB.py')], check=True)
print("获取曲目信息...")
subprocess.run(['python', os.path.join(curdir,'getchart.py')], check=True)
print("获取曲绘、头像...")
subprocess.run(['python', os.path.join(curdir,'getillustration.py')], check=True)
subprocess.run(['python', os.path.join(curdir,'getavatar.py')], check=True)

print("初始化完成，请运行start.py启动程序 :)")
