import json
import os

from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room

from chatApp.auth import login_required
from chatApp.db import get_db

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'chatApp.sqlite'),
)
from . import auth

app.register_blueprint(auth.bp)


@socketio.on('message')
def handle_string(msg):
    print("server received:" + msg)


@socketio.event
def joinRoom(message):
    join_room(message['room'])
    emit('roomJoined',
         {"user": request.sid,
          "room": message['room']}, to=message['room'])


@socketio.event
def leaveRoom(message):
    emit('roomLeftPersonal', {"user": request.sid, "room": message['room']})
    leave_room(message['room'])


@login_required
@app.route('/index')
def index():
    s = session['user']
    chats = session['chats']
    user = json.loads(s)
    chats = json.loads(chats)
    if user is None:
        return render_template('auth/login.html')
    else:
        return render_template("index.html", user=user, chats=chats)


@socketio.event
def SendContent(message):
    uid = message['uid']
    db = get_db()
    user = db.execute(
        'SELECT * FROM user WHERE id = ?', (uid,)
    ).fetchone()
    print(user)
    emit('messageReceived',
         {"uid": str(uid), "room": message['room'], "content": message["content"], "images": user["images"],
          "username": user["username"]},
         to=message['room'])


if __name__ == '__main__':
    socketio.run(app)
