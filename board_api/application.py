from flask import Flask
from flask import request
from flask import jsonify
import json
from mongoengine import *

# EB looks for an 'application' callable by default.
application = Flask(__name__)

connect('databoard', host='ec2-54-237-130-222.compute-1.amazonaws.com', port=27017, username="root",
        password="test12345", authentication_source="admin")


class Grants(Document):
    _id = ObjectIdField(required=False)
    url = StringField(required=False)
    title = StringField(required=False)
    text = StringField(required=False)
    contacts = StringField(required=False)
    itemType = StringField(required=False)
    modified = BooleanField(required=False)


@application.route('/')
def hello_world():
    return 'Hello 1!'


@application.route('/grants')
def get_all():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    return jsonify({"Count": Grants.objects.count(),
                    "Data": json.loads(Grants.objects.skip((page - 1) * page_size).limit(page_size).to_json())})


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.config['JSON_AS_ASCII'] = False
    application.debug = True
    application.run()
