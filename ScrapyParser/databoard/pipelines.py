import pymongo

from scrapy.conf import settings
from scrapy.exceptions import DropItem
from scrapy import log


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
            document=self.collection.find_one({"url":item['url']},{"_id":0,"modified":0})
            if not document:
                spider.logger.info("Inserting new document")
                item['modified']=False
                self.collection.insert(dict(item))
            elif document!=item:
                spider.logger.info("Updating old document")
                item['modified']=True
                self.collection.update({"url":item['url']},dict(item))
            else:
                spider.logger.info("Found exact same document")
        return item