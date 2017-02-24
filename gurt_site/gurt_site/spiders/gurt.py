# -*- coding: utf-8 -*-
import scrapy


class GurtSpider(scrapy.Spider):
    name = "gurt"
    allowed_domains = ["gurt.org.ua"]
    start_urls = ['http://gurt.org.ua/news/grants']

    def parse(self, response):
        links = response.selector.xpath('//div/div/div[2]/div/div/h2/a')

        next_page = 'http://gurt.org.ua/news/grants/' +\
                    response.css('div.pagination > a.next ::attr(href)').extract_first()

        for link in links:
            url = 'http://gurt.org.ua' + link.xpath('@href').extract_first()
            text = link.xpath('text()').extract_first().strip()
            yield dict(url=url, text=text)

        if next_page:
            yield scrapy.Request(next_page, callback=self.parse)