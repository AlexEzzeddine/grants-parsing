from flask import Flask
from pymongo import MongoClient
from bson import json_util

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello API'\

@app.route('/all')
def all():
    conn = 'mongodb://localhost:32768/?3t.uriVersion=2&3t.connectionMode=direct&readPreference=primary&3t.connection.name=localhost%3A32768'

    cl = MongoClient(conn)
    coll = cl["local"]["test2"]

    data = [{"foo": "HELLO"}, {"Blah": "Bloh"}]
    for d in data:
        coll.insert_one(data)

    return 'all'

if __name__ == '__main__':
    app.run()