# -*- coding: utf-8 -*-
import scrapy
from gurt_site.items import GrantItem


class GrantSpider(scrapy.Spider):
    name = "grantSpider"
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
        item['title']=response.css(".news h2 *::text").extract_first()
        item['text']=''.join(response.css(".newstxt2 *::text").extract())
        yield item


class ConferenceSpider(scrapy.Spider):
    name = "conferenceSpider"
    allowed_domains = ["gurt.org.ua"]
    start_urls = ["http://gurt.org.ua/news/conferences/"]
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
        item=ConferenceItem()
        item['url']=response.url
        item['title']=response.css(".news h2 *::text").extract_first()
        item['text']=''.join(response.css(".newstxt2 *::text").extract())
        yield item