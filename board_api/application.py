from bson import ObjectId
from datetime import datetime
from flask import json
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from mongoengine import *

# EB looks for an 'application' callable by default.
application = Flask(__name__)
CORS(application)

connect('databoard', host='ec2-54-237-130-222.compute-1.amazonaws.com', port=27017, username="root",
        password="test12345", authentication_source="admin")


class MyJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.strftime("%d.%m.%Y")
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


class Grants(DynamicDocument):
    _id = ObjectIdField()
    url = StringField()
    title = StringField()
    text = StringField()
    contacts = StringField()
    itemType = StringField()
    publication_date = DateTimeField()
    flags = DictField()

    meta = {'strict': False}


@application.route('/')
def hello_world():
    return 'SpiderBoard v0.01 Alpha.'


@application.route('/grants')
def get_all():
    filters = {"flags." + flag: True for flag in filter(None, request.args.get('q', "").split(','))}
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    data = Grants.objects(__raw__=filters).skip((page - 1) * page_size).limit(page_size)
    return jsonify({
        "Count": Grants.objects(__raw__=filters).count(),
        "Data": [o.to_mongo() for o in data]
    })


@application.route('/changestatus')
def change_status():
    _id = request.args.get('id')
    status_name = request.args.get('status_name')
    value = request.args.get('value') == "true"
    doc = Grants.objects(_id=_id).first()
    doc.flags[status_name] = value
    doc.save()
    return jsonify(doc.flags)


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.json_encoder = MyJSONEncoder
    application.config['JSON_AS_ASCII'] = False
    application.run()
