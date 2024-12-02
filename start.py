import random
from flask import *
from flask_socketio import *
import hashlib
from dotenv import *
import secrets
import os
from gevent import pywsgi
import sqlite3
from colorama import Fore, init
import pandas as pd
import numpy as np

load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)
init(autoreset=True)

chartconstant = {}
songlist = {}
class_song = [
    "Past",
    'Present',
    'Future',
    'Beyond',
    'Eternal',
]
class2num = {
    "Past": 0,
    'Present': 1,
    'Future': 2,
    'Beyond': 3,
    'Eternal': 4,
}

with open(os.getenv('songlist_path')) as file:
    songlist = json.load(file)

with open(os.getenv('chartconstant_path')) as file:
    chartconstant = json.load(file)

def hash(password):
    sha256 = hashlib.sha256()
    sha256.update(password.encode('utf-8'))
    return sha256.hexdigest()

def calcRating(difficulty, score):
    if score == '':
        return 0
    if score >= 1000_0000:
        return difficulty + 2
    elif score >= 980_0000:
        return difficulty + 1 + (score - 980_0000) / 20_0000
    else:
        return max(difficulty + (score - 950_0000) / 30_0000, 0)

@app.route('/')
def index():
    if session.get('username'):
        return redirect('/scores')
    return send_from_directory('public','index.html')

@app.route('/<path:path>')
def route(path):
    if os.path.isfile(os.path.join('public',f'{path}.html')):
        return send_from_directory('public',f'{path}.html')
    else:
        return send_from_directory('public',"404.html")
    
@app.route('/scripts/<path:file>')
def scripts(file):
    if os.path.isfile(os.path.join('scripts',f'{file}')):
        return send_from_directory('scripts',f'{file}')
    else:
        print(Fore.RED + f'Error: {file} not found')
        Fore.WHITE
        return None
    
@app.route('/style/<path:file>')
def stylesheets(file):
    if os.path.isfile(os.path.join('style',f'{file}')):
        return send_from_directory('style',f'{file}')
    else:
        print(Fore.RED + f'Error: {file} not found')
        Fore.WHITE
        return None
    
@app.route('/login', methods=['POST'])
def login():
    conn = sqlite3.connect(os.getenv('DB_PATH'))
    cursor = conn.cursor()
    username = request.form['username']
    password = request.form['password']
    cursor.execute('''SELECT * from users WHERE username = ?''', (username,))
    rows = cursor.fetchall()
    if hash(password) == rows[0][2]:
        session['username'] = username
        return redirect('/scores')
    else:
        return redirect('/')
    
@app.route('/assets/<path:file>')
def serve_asset(file):
    return send_from_directory('./assets', file)

@app.route('/register', methods=['POST'])
def register():
    conn = sqlite3.connect(os.getenv('DB_PATH'))
    cursor = conn.cursor()
    username = request.form['username']
    password = request.form['password']
    confirm_password = request.form['confirm-password']
    if password != confirm_password:
        print(Fore.RED + f'Error: Passwords do not match')
        Fore.WHITE
        return jsonify({'message': "Passwords do not match"})
    
    cursor.execute('''SELECT * from users WHERE username = ?''', (username,))
    rows = cursor.fetchall()
    if len(rows) == 0:
        cursor.execute('''INSERT INTO users(username, password) VALUES (?, ?)''', (username, hash(password)))
        conn.commit()
        session['username'] = username
        return redirect('/scores')
    
    print(Fore.RED + f'Error: {username} already exists')
    Fore.WHITE
    return jsonify({'message': "Username already exists"})

@app.route('/username', methods=['GET'])
def get_username():
    if session.get('username'):
        return jsonify({'username': session['username']})
    else:
        return jsonify({'username': 'null'})

@app.route('/get_chart', methods=['POST'])
def get_chart():
    rows = []
    if session.get('username'):
        conn = sqlite3.connect(os.getenv('DB_PATH'))
        cursor = conn.cursor()
        cursor.execute('''SELECT * from songs WHERE username = ?''', (session['username'],))
        rows = cursor.fetchall()
        conn.close()
    else:
        return jsonify({'success': False}), 400
    data = []
    for song in songlist['songs']:
        chart = chartconstant[song['id']]
        for index in range(len(chart)):
            if not chart[index]:
                continue
            res = [item for item in rows if item[0] == song['id'] and item[1] == class_song[index] and item[3] == session['username']]
            data.append({
                'id': song['id'],
                'title': song['title_localized']['en'],
                'artist': song['artist'],
                'difficulty': chart[index]['constant'],
                'class': class_song[index],
                'score': res[0][2] if len(res) == 1 else 0,
            })
            
    data.sort(key=lambda x: x['difficulty'])
    data = data[::-1][:int(os.getenv('MAX_SONG_LOADED'))][::-1]
    return jsonify(data)

@app.route('/update_chart', methods=['POST'])
def update_chart():
    if not session.get('username'):
        return jsonify({'success': False}), 400
    data = request.get_json()
    print(Fore.GREEN + f'{data}')
    Fore.WHITE
    conn = sqlite3.connect(os.getenv('DB_PATH'))
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR REPLACE INTO songs VALUES (?, ?, ?, ?);
        ''', 
        (data.get('id'), data.get('class'), data.get('score'), session['username'])
    )
    conn.commit()
    conn.close()
    print('Chart updated!')
    return jsonify({'success': True})

@app.route('/get_bests', methods=['GET'])
def get_bests():
    if not session.get('username'):
        return jsonify({'success': False}), 400
    conn = sqlite3.connect(os.getenv('DB_PATH'))
    cursor = conn.cursor()
    cursor.execute('''SELECT * from songs WHERE username = ?''', (session['username'],))
    rows = cursor.fetchall()
    data = []
    for row in rows:
        data.append({
            'id': row[0],
            'name': next(song for song in songlist['songs'] if song['id'] == row[0])['title_localized']['en'],
            'class': row[1],
            'difficulty': chartconstant[row[0]][class2num[row[1]]]['constant'],
            'score': row[2],
            'rating': round(calcRating(chartconstant[row[0]][class2num[row[1]]]['constant'], row[2]), 3)
        })
    data.sort(key=lambda x: x['rating'], reverse=True)
    conn.close()
    return jsonify(data[:30])

@app.route('/chat', methods=['POST'])
def chat():
    if not session.get('username'):
        return jsonify({'success': False}), 400
    data = request.get_json()
    if data.get('id') == 0:
        df = pd.read_csv(os.getenv('songs_recommand_path'))
        df = df.to_numpy().flatten().tolist()
        return jsonify({'message': df[random.randint(0, len(df)-1)]})
    elif data.get('id') == 1:
        if not session.get('username'):
            return jsonify({'success': False}), 400
        conn = sqlite3.connect(os.getenv('DB_PATH'))
        cursor = conn.cursor()
        cursor.execute('''SELECT * from songs WHERE username = ?''', (session['username'],))
        rows = cursor.fetchall()
        data = []
        for row in rows:
            data.append({
                'id': row[0],
                'name': next(song for song in songlist['songs'] if song['id'] == row[0])['title_localized']['en'],
                'class': row[1],
                'difficulty': chartconstant[row[0]][class2num[row[1]]]['constant'],
                'score': row[2],
                'rating': round(calcRating(chartconstant[row[0]][class2num[row[1]]]['constant'], row[2]), 3)
            })
        data.sort(key=lambda x: x['rating'], reverse=True)
        conn.close()
        if len(data) < 40:
            return jsonify({'message': "歌都没打几首，急着推分作甚？"})
        else:
            id = random.randint(30, 39)
            return jsonify({'message': f"推荐这首{data[id]['name']}！目前的得分为{int(data[id]['score'])}，不过不要强推，小心手癖！"})
    elif data.get('id') == 2:
        df = pd.read_csv(os.getenv('bible_path'))
        df = df.to_numpy().flatten().tolist()
        return jsonify({'message': df[random.randint(0, len(df)-1)]})
    else:
        return jsonify({'message': "爆！"})

if __name__ == '__main__':
    print( '==============================================================================================')
    print(r'       _____                                               _____  _____.__  .__               ')
    print(r'      /  _  \_______   ____ _____    ____ _____      _____/ ____\/ ____\  | |__| ____   ____  ')
    print(r'     /  /_\  \_  __ \_/ ___\\__  \ _/ __ \\__  \    /  _ \   __\\   __\|  | |  |/    \_/ __ \ ')
    print(r'    /    |    \  | \/\  \___ / __ \\  ___/ / __ \_ (  <_> )  |   |  |  |  |_|  |   |  \  ___/ ') 
    print(r'    \____|__  /__|    \___  >____  /\___  >____  /  \____/|__|   |__|  |____/__|___|  /\___  >')
    print(r'            \/            \/     \/     \/     \/                                   \/     \/ ')
    print( '==============================================================================================')
    print('ARCAEA OFFLINE IS RUNNING AT http://localhost:5000/')
    server = pywsgi.WSGIServer(('0.0.0.0', int(os.getenv('PORT'))), app)
    server.serve_forever()