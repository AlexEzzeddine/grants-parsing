# -*- coding: utf-8 -*-

from flask import Flask
from flask import jsonify
from mongoengine import *

app = Flask(__name__)

connect('databoard', host='ec2-54-237-130-222.compute-1.amazonaws.com', port=27017, username="root", password="test12345", authentication_source="admin")

class Grants(Document):
	id = ObjectIdField(required=False)
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
	return Grants.objects[:10].to_json().encode('utf-8')

if __name__ == '__main__':
    app.run()
