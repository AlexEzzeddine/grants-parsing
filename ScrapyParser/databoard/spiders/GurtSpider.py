# -*- coding: utf-8 -*-
import scrapy
import datetime
from databoard.items import GrantItem


class GurtSpider(scrapy.Spider):
    name = "gurtSpider"
    allowed_domains = ["gurt.org.ua"]
    start_urls = ["http://gurt.org.ua/news/grants"]
    base_url = "http://gurt.org.ua"

    def parse(self, response):
        links = response.selector.css(".news h2 a::attr(href)").extract()
        

        for link in links:
            yield scrapy.Request(self.base_url+link, callback=self.getDetails)

        next_page = self.start_urls[0] +\
                    response.css('div.pagination > a.next ::attr(href)').extract_first()

        if next_page:
            yield scrapy.Request(next_page, callback=self.parse)

    def getDetails(self,response):
        item=GrantItem()
        item['url']=response.url
        item['title']="".join(response.css(".news>h2:first-of-type *::text").extract())
        item['text']=''.join(response.css(".newstxt2 *::text").extract())
        item['contacts']=' '.join(response.css(".contline+ul li *::text").extract())
        item['itemType']="Grant"
        yield item