#!/usr/bin/env python
from BeautifulSoup import BeautifulSoup as bs
soup = bs(open('example_comment.html').read())
pretty = soup.prettify()
out = open('formatted.html', 'w')
out.write(pretty)
out.flush()
out.close()
