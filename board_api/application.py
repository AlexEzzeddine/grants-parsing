from bson import ObjectId
from math import ceil
from datetime import datetime
from flask import json
from flask import Flask
import flask_login
from flask import request, redirect, url_for
from flask import jsonify
from flask_cors import CORS
from mongoengine import *
from werkzeug.security import generate_password_hash, \
    check_password_hash

# EB looks for an 'application' callable by default.
application = Flask(__name__)
application.secret_key = "dsfakadfa2938ghf4b293t34gk3g023hggv"
CORS(application)
login_manager = flask_login.LoginManager()
login_manager.init_app(application)

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
    notes = StringField()
    publication_date = DateTimeField()
    flags = DictField()
    meta = {'strict': False}


class Users(Document):
    email = StringField()
    password = StringField()


class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(email):
    if not Users.objects(email=email).first():
        return

    user = User()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if not Users.objects(email=email).first():
        return

    user = User()
    user.id = email

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    user.is_authenticated = check_password_hash(
        Users.objects(email=email).first().password,
        request.form['pw'])

    return user


@application.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return '''
               <form action='login' method='POST'>
                <input type='text' name='email' id='email' placeholder='email'></input>
                <input type='password' name='pw' id='pw' placeholder='password'></input>
                <input type='submit' name='submit'></input>
               </form>
               '''

    email = request.form['email']
    if not Users.objects(email=email).first():
        return "User not found"
    if check_password_hash(
            Users.objects(email=email).first().password,
            request.form['pw']):
        user = User()
        user.id = email
        flask_login.login_user(user)
        return "Ok"

    return 'Bad password'


@application.route('/grants')
#@flask_login.login_required
def get_all():
    filters = {}
    domain="All"
    domain_filters = request.args.get("filters")
    if domain_filters:
        domain = json.loads(domain_filters)['rules'][0]['data']
    if domain and domain != "All":
        filters.update({"domain": domain})
    flags = json.loads(request.args.get("flags", "[]"))
    filters.update({
        "flags." + flag: True for flag in flags
    })
    page = int(request.args.get('page', 1))
    rows = int(request.args.get('rows', 16))
    data = Grants.objects(__raw__=filters).skip(
        (page - 1) * rows).limit(rows)
    count = Grants.objects(__raw__=filters).count()
    return jsonify({
        "Count": count,
        "Pages": ceil(count / rows),
        "Data": [obj.to_mongo() for obj in data]
    })


@application.route('/domains')
def get_domains():
    db = Grants._get_db()
    domains = [doc["domain"] for doc in db.domains.find()]
    return jsonify(domains)


@application.route('/last_updated_date')
def get_last_updated_date():
    db = Grants._get_db()
    last_updated_date = db.scrapy_dates.find_one()['last_updated_date']
    return jsonify(last_updated_date)


@application.route('/grants/<grant_id>', methods=["PUT"])
def change_status(grant_id):
    doc = Grants.objects(_id=grant_id).first()
    for status, value in request.form.items():
        status=status.lower()
        value=value.lower()
        if status in doc.flags and value in ["true","false"]:
            doc.flags[status] = value == "true"
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
