import pymongo

from scrapy.conf import settings
from scrapy.exceptions import DropItem
from datetime import datetime


from scrapy import signals


class MongoDBPipeline(object):

    EMPTY_FLAGS = {
        "important": False,
        "displayed": False,
        "skipped": False,
        "done": False,
        "modified": False,
    }

    def __init__(self):
        connection = pymongo.MongoClient(
            settings['CONN_STRING']
        )
        self.db = connection[settings['MONGODB_DB']]
        self.collection = self.db[settings['MONGODB_COLLECTION']]

    @classmethod
    def from_crawler(cls, crawler):
        pipeline = cls()
        crawler.signals.connect(pipeline.spider_opened,
                                signal=signals.spider_opened)
        crawler.signals.connect(pipeline.engine_started,
                                signal=signals.engine_started)
        return pipeline

    def engine_started(self):
        self.db["scrapy_dates"].update_one(
            {"last_updated_date": {'$exists': True}},
            {"$set": {"last_updated_date": datetime.now()}},
            upsert=True)

    def spider_opened(self, spider):
        domain = spider.allowed_domains[0]
        self.db["domains"].update_one(
            {"domain": domain},
            {"$setOnInsert": {"domain": domain}},
            upsert=True)

    def process_item(self, item, spider):
        valid = True
        for data in item:
            if not data:
                valid = False
                raise DropItem("Missing {0}!".format(data))
        if valid:
            if item['contacts'] == "":
                item['contacts'] = "N/A"
            document = self.collection.find_one({"url": item['url']},
                                                {"_id": 0,
                                                 "flags": 0,
                                                 "notes": 0,
                                                 "publication_date": 0})
            if not document:
                spider.logger.info("Inserting new document")
                item['flags'] = self.EMPTY_FLAGS
                item["notes"] = ""
                item['publication_date'] = datetime.now()
                self.collection.insert(dict(item))
            elif document != item:
                spider.logger.info("Updating old document")
                item['flags'] = self.EMPTY_FLAGS
                item['flags']['modified'] = True
                item['publication_date'] = datetime.now()
                self.collection.update({"url": item['url']}, dict(item))
            else:
                spider.logger.info("Found exact same document")
        return item
