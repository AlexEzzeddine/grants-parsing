import pymongo

from scrapy.conf import settings
from scrapy.exceptions import DropItem
from scrapy import log
import datetime


class MongoDBPipeline(object):

    def __init__(self):
        connection = pymongo.MongoClient(
            settings['CONN_STRING']
        )
        db = connection[settings['MONGODB_DB']]
        self.collection = db[settings['MONGODB_COLLECTION']]

    def process_item(self, item, spider):
        valid = True
        for data in item:
            if not data:
                valid = False
                raise DropItem("Missing {0}!".format(data))
        if valid:
            document=self.collection.find_one({"url":item['url']},{"_id":0,"modified":0,"publication_date":0, "important":0, "displayed":0, "skipped":0, "done":0})
            if not document:
                spider.logger.info("Inserting new document")
                item['modified']=False
                item['publication_date']=datetime.datetime.now()
                self.collection.insert(dict(item))
            elif document!=item:
                spider.logger.info(document)
                spider.logger.info(item)
                spider.logger.info("Updating old document")
                item['modified']=True
                item['publication_date']=datetime.datetime.now()
                self.collection.update({"url":item['url']},dict(item))
            else:
                spider.logger.info("Found exact same document")
        return item