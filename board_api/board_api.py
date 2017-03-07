from flask import Flask
from bson.json_util import dumps
from mongoengine import *

app = Flask(__name__)

connect('databoard', host='localhost', port=32768)

class Grants(Document):
    url = StringField(required=False)
    title = StringField(required=False)
    text = StringField(required=False)
    contacts = StringField(required=False)
    itemType = StringField(required=False)
    modified = BooleanField(required=False)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/all')
def get_all():

    return dumps(Grants.objects)

    for u in Grants.objects:

        return u.url;

    return "OK"


if __name__ == '__main__':
    app.run()
