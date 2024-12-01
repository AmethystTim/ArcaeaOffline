import subprocess

print( '==============================================================================================')
print(r'       _____                                               _____  _____.__  .__               ')
print(r'      /  _  \_______   ____ _____    ____ _____      _____/ ____\/ ____\  | |__| ____   ____  ')
print(r'     /  /_\  \_  __ \_/ ___\\__  \ _/ __ \\__  \    /  _ \   __\\   __\|  | |  |/    \_/ __ \ ')
print(r'    /    |    \  | \/\  \___ / __ \\  ___/ / __ \_ (  <_> )  |   |  |  |  |_|  |   |  \  ___/ ') 
print(r'    \____|__  /__|    \___  >____  /\___  >____  /  \____/|__|   |__|  |____/__|___|  /\___  >')
print(r'            \/            \/     \/     \/     \/                                   \/     \/ ')
print( '==============================================================================================')

print("正在创建本地数据库")
subprocess.run(['python', './data/initDB.py'], check=True)
print("获取曲目信息...")
subprocess.run(['python', 'getchart.py'], check=True)
print("获取曲绘、头像...")
subprocess.run(['python', 'getillustration.py'], check=True)
subprocess.run(['python', 'getavatar.py'], check=True)

print("done :)")
