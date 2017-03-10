from bson.json_util import dumps
from flask import Flask
from flask import Response
from flask import request
from flask_cors import CORS
from mongoengine import *

# EB looks for an 'application' callable by default.
application = Flask(__name__)
CORS(application)

connect('databoard', host='ec2-54-237-130-222.compute-1.amazonaws.com', port=27017, username="root",
        password="test12345", authentication_source="admin")

class Grants(DynamicDocument):
    _id = ObjectIdField(required=False)
    url = StringField(required=False)
    title = StringField(required=False)
    text = StringField(required=False)
    contacts = StringField(required=False,default="N/A")
    itemType = StringField(required=False)
    modified = BooleanField(required=False)
    publication_date = DateTimeField(required=False)
    flags = DynamicField(required=False, default={
        "important": False,
        "displayed": False,
        "skipped": False,
        "done": False
    })

    meta = {'strict': False}


@application.route('/')
def hello_world():
    return 'Hello 1!'


@application.route('/grants')
def get_all():
    query = request.args.get('query')
    page = int(request.args.get('page'))
    page_size = int(request.args.get('page_size'))
    important = bool(request.args.get("important", None))
    displayed = bool(request.args.get("displayed", None))
    skipped = bool(request.args.get("skipped", None))
    done = bool(request.args.get("done", None))
    data=[]
    for grant in Grants.objects(__raw__={}).skip((page - 1) * page_size).limit(page_size):
        item= {
            "id":str(grant._id),
            "url":grant.url,
            "title":grant.title,
            "text":grant.text,
            "contacts":grant.contacts,
            "itemType":grant.itemType,
            "modified":grant.modified,
            "publication_date":str(grant.publication_date),
            "flags":{
                "important" : grant.flags['important'],
                "displayed": grant.flags['displayed'],
                "skipped": grant.flags['skipped'],
                "done": grant.flags['done']
            }
        }
        data.append(item)

    return Response(dumps({
        "Count": Grants.objects(__raw__={}).count(),
        "Data": data
    }, indent=2, ensure_ascii=False), mimetype='application/json')


@application.route('/changestatus')
def change_status():
    id = request.args.get('id')
    status_name = request.args.get('status_name')
    value = bool(request.args.get('value'))
    doc = Grants.objects(_id=id).first()
    doc.flags[status_name] = value
    doc.save()
    return dumps(doc.flags)


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
