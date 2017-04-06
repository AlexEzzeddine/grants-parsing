# -*- coding: utf-8 -*-
import scrapy
from scrapy.exceptions import CloseSpider
from databoard.items import GrantItem


class ProstirSpider(scrapy.Spider):
    name = "prostirSpider"
    allowed_domains = ["prostir.ua"]
    start_urls = ["http://www.prostir.ua/category/grants/"]
    base_url = "http://www.prostir.ua"

    def parse(self, response):
        links = response.selector.css(".newsblock .more::attr(href)").extract()
        if not links:
            raise CloseSpider('Last Page Parsed')
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
        temp_text = ''.join(response.css(".article_text *::text").extract())
        without_start_symbols = temp_text.replace('\r\n\r\n            \r\n            ', '')
        without_end_symbols = without_start_symbols.replace('\n            \r\n                        \r\n            \r\n                \r\n         '
                          '                           \r\n            \r\n            \r\n                jQuery('
                          'function () {\r\n                    jQuery(".article_text .wpuf_customs").hide();\r\n     '
                          '           });\r\n            \r\n        ', '')
        item['text'] = without_end_symbols
        item['contacts'] = ""
        yield item
