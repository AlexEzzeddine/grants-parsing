from datetime import datetime

import flask_login
from bson import ObjectId
from flask import json
from mongoengine import DynamicDocument, ObjectIdField, StringField, DateTimeField, DictField, Document


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


class User(flask_login.UserMixin):
    pass


class Users(Document):
    email = StringField()
    password = StringField()