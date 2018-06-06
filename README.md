<h1 align='center'>mQuery</h1>
<p align='center'>
The mQuery (or Mini-jQuery) is a most simple and clean way to query HTML elements and bind Event Handlers without jQuery
</p>
<p align='center'>
    <img src="https://img.shields.io/npm/v/@ecromaneli/mquery.svg" alt="module version">&nbsp;
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license">&nbsp;
    <img src="https://circleci.com/gh/ECRomaneli/mQuery.svg?style=shield" alt="CircleCI">&nbsp;
    <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="contributions welcome">
</p>

## Objective
The objective of mQuery is not replace the jQuery, is provide a simple way to manipule HTML elements and your events with jQuery-like functions without your robust functionalities and with that, make a lightweight library.

## Install

```shell
    npm i @ecromaneli/mquery
```

## How to use
### Module
Just import `mQuery` or `m$` with require and use like jQuery:
```typescript
    const {m$, mQuery} = require('@ecromaneli/mquery')

    // DOM Ready, see https://api.jquery.com/ready/
    m$(() => { 
        let $elem = m$('tag.class#id[attr="value"]')
        $elem.find('child').css({ style: 'value'  })
    })
``` 

### Web
Download script into **/dist/web/** folder and import normally:
```html
    <script type="text/javascript" src="mquery.min.js"/>

    <script>
        // DOM Ready, see https://api.jquery.com/ready/
        m$(() => { 
            let $elem = m$('tag.class#id[attr="value"]')
            $elem.find('child').css({ style: 'value'  })
        });
    </script>
``` 

## Constructors
All principal jQuery constructors works fine:

```typescript
    // on ready callback
    m$(handler: Function): MQuery

    // Array of HTMLElements
    m$(elemArr: Array<HTMLElement>): MQuery

    // HTML Element
    m$(elem: HTMLElement): MQuery

    // NodeList
    m$(list: NodeList): MQuery

    // MQuery instance
    m$(instance: MQuery): MQuery
```

## Functions
Actually, all functions listed behind, are jQuery compatible. Then, all mQuery code with any functions listed, will works with jQuery.

### Stable
- [ready(callback)](http://api.jquery.com/ready/)
- [each(callback)](http://api.jquery.com/each/)
- [on(events[, selector], handler)](http://api.jquery.com/on/)
- [off(events[, selector], handler)](http://api.jquery.com/off/)
- [trigger(events[, data])](http://api.jquery.com/trigger/)
- [find(selector)](http://api.jquery.com/find/)
- [parent([selector])](http://api.jquery.com/parent/)
- [css(prop, value)](http://api.jquery.com/css/)
- [css(propArray)](http://api.jquery.com/css/)
- [attr(attrName, value)](http://api.jquery.com/attr/)
- [html([htmlText])](http://api.jquery.com/html/)
- [text([text])](http://api.jquery.com/text/)
- [val([value])](http://api.jquery.com/val/)
- [simblings([selector])](http://api.jquery.com/simblings/)
- [prev([selector])](http://api.jquery.com/prev/)
- [next([selector])](http://api.jquery.com/next/)
- [addClass(class)](http://api.jquery.com/addclass/)
- [removeClass(class)](http://api.jquery.com/removeclass/)
- [toggleClass(class)](http://api.jquery.com/toggleclass/)
- [prepend(elem1, ...elemN)](http://api.jquery.com/prepend/)
- [append(elem1, ...elemN)](http://api.jquery.com/append/)

### Experimental
- [width([size])](http://api.jquery.com/width/)
- [height([size])](http://api.jquery.com/height/)
- load(url) [ALPHA]


### On Working...
- parents()

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[MIT License](https://github.com/ECRomaneli/mQuery/blob/master/LICENSE.md)