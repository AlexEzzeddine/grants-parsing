# -*- coding: utf-8 -*-
import scrapy
from gurt_site.items import GrantItem


class GurtSpider(scrapy.Spider):
    name = "gurt"
    allowed_domains = ["gurt.org.ua"]
    start_urls = ['http://gurt.org.ua/news/grants']
    base_url = 'http://gurt.org.ua'

    def parse(self, response):
        links = response.selector.css('.news h2 a')
        texts = response.selector.css('.newstxt')
        tuples=zip(links,texts)
        

        for link,text in tuples:
            item=GrantItem()
            item['url']=self.base_url+link.css("::attr(href)").extract_first()
            item['title']=link.css("::text").extract_first().strip().replace(u'\xa0', u' ')
            item['text']=text.css("::text").extract_first().replace(u'\xa0', u' ')
            yield item

        next_page = 'http://gurt.org.ua/news/grants/' +\
                    response.css('div.pagination > a.next ::attr(href)').extract_first()

        if next_page:
            yield scrapy.Request(next_page, callback=self.parse)