![CircleCI](https://circleci.com/gh/ECRomaneli/mQuery.svg?style=shield)
![License](https://img.shields.io/npm/l/mquery.svg)

# mQuery.js
The mQuery (or Mini-jQuery) is a most simple and clean way to query DOM Elements and bind Event Listeners without jQuery.

## Objectives
The objective of mQuery.js is not replace the jQuery, is provide a simple way to manipulate DOM Elements and your events with jQuery-like functions without your robust functionalities and with that, make a lightweight library.

## Functions
Actually, all functions listed behind, are jQuery compatible. Then, all jQuery code with any functions listed, will works.

- [ready(callback)](http://api.jquery.com/ready/)
- [each(callback)](http://api.jquery.com/each/)
- [on(events, handler)](http://api.jquery.com/on/)
- [off(events, handler)](http://api.jquery.com/off/)
- [trigger(events)](http://api.jquery.com/trigger/)
- [find(selector)](http://api.jquery.com/find/)
- [parent([selector])](http://api.jquery.com/parent/)
- [css(prop, value)](http://api.jquery.com/css/)
- [attr(attrName, value)](http://api.jquery.com/attr/)
- [html([htmlText])](http://api.jquery.com/html/)
- [text([text])](http://api.jquery.com/text/)
- [val([value])](http://api.jquery.com/val/)

#### On Working...
- prepend()
- append()
- prev()
- next()
- simblings()
- parents()
- addClass()
- removeClass()
- toggleClass()
- hasClass()
- width()
- height()

## Constructors
All principal jQuery's constructor works fine. Like:
- m$(DOMReadyCallback)
- m$(DOMElementArray)
- m$(DOMElement)
- m$(MQueryElement)

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[MIT License](https://github.com/laradock/laradock/blob/master/LICENSE)