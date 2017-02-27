# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field

class GurtItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = Field()
    url = Field()
    text = Field()
    itemType = Field()


class GrantItem(GurtItem):
	def __init__(self):
		GurtItem.__init__(self)
		self["itemType"] = "Grant"

class ConferenceItem(GurtItem):
	def __init__(self):
		GurtItem.__init__(self)
		self["itemType"] = "Conference"