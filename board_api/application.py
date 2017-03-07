from flask import Flask
from flask import request
from mongoengine import *

# EB looks for an 'application' callable by default.
application = Flask(__name__)

connect('databoard', host='ec2-54-237-130-222.compute-1.amazonaws.com', port=27017, username="root", password="test12345", authentication_source="admin")


class Grants(Document):
    id = ObjectIdField(required=False)
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
    page=int(request.args.get('page'))
    pageSize=int(request.args.get('pageSize'))
    return Grants.objects.skip((page - 1) * pageSize).limit(pageSize).to_json().encode('utf-8')

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
