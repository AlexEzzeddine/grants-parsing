# -*- coding: utf-8 -*-
import scrapy
from databoard.items import GrantItem


class GurtSpider(scrapy.Spider):
    name = "prostirSpider"
    allowed_domains = ["prostir.ua"]
    start_urls = ["http://www.prostir.ua/category/grants/"]
    base_url = "http://www.prostir.ua"

    def parse(self, response):
        links = response.selector.css(".newsblock .more::attr(href)").extract()

        for link in links:
            yield scrapy.Request(link, callback=self.getDetails)

        next_page = self.base_url +\
            response.css('div.imgborder a::attr(href)').extract_first()

        if next_page:
            yield scrapy.Request(next_page, callback=self.parse)

    def getDetails(self, response):
        item = GrantItem()
        item['domain'] = self.allowed_domains[0]
        item['url'] = response.url
        item['title'] = response.css(
            ".article h1:first-of-type::text").extract_first()
        item['text'] = ''.join(response.css(".article_text *::text").extract())
        item['contacts'] = ""
        yield item
