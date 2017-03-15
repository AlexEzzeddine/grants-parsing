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

connect('databoard',
        host='ec2-54-91-141-246.compute-1.amazonaws.com',
        port=27017,
        username="root",
        password="test12345",
        authentication_source="admin")


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
    domain = StringField()
    publication_date = DateTimeField()
    flags = DictField()
    meta = {'strict': False}


@application.route('/')
def hello_world():
    return 'SpiderBoard v0.01 Alpha.'


@application.route('/grants')
def get_all():
    domains = json.loads(request.args.get("domains", "[]"))
    flags = json.loads(request.args.get("flags", "[]"))
    filters = {}
    if domains:
        filters.update({
            "$or": [{"domain": domain} for domain in domains]
        })
    filters.update({
                       "flags." + flag: True for flag in flags
                       })
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    data = Grants.objects(__raw__=filters).skip(
        (page - 1) * page_size).limit(page_size)
    return jsonify({
        "Count": Grants.objects(__raw__=filters).count(),
        "Data": [o.to_mongo() for o in data]
    })


@application.route('/domains')
def get_domains():
    domains = ["gurt.org.ua", "prostir.ua"]
    return jsonify({
        "domains": domains
    })


@application.route('/last_updated_date')
def get_last_updated_date():
    now = datetime.now().strftime('%c')

    return jsonify({
        "date": now
    })


@application.route('/status/<grant_id>', methods=["POST"])
def change_status(grant_id):
    status_name = request.form.get('status_name')
    value = request.form.get('value') == "true"
    doc = Grants.objects(_id=grant_id).first()
    doc.flags[status_name] = value
    doc.save()
    return jsonify(doc.flags)


application.debug = True
application.json_encoder = MyJSONEncoder
application.config['JSON_AS_ASCII'] = False

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.run()
