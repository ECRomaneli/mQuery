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

```typescript
    const {m$} = require('@ecromaneli/mquery')
    let $t = m$('p')

    // http://api.jquery.com/ready/
    $t.ready(handler: Function): MQuery

    // http://api.jquery.com/each/
    $t.each(iterator: Function): MQuery 

    // http://api.jquery.com/on/
    $t.on(events: string, selector?: any, handler: function): MQuery

    // http://api.jquery.com/off/
    $t.off(events: string, selector?: Selector, handler: function): MQuery

    // http://api.jquery.com/trigger/
    $t.trigger(events: string, data?: any): MQuery

    // http://api.jquery.com/find/
    $t.find(selector: string): MQuery

    // http://api.jquery.com/parent/
    $t.parent(selector?: string): MQuery

    // http://api.jquery.com/css/
    $t.css(prop: string, value?: string): MQuery | string

    // http://api.jquery.com/css/
    $t.css(propArray: Array<string, string>): MQuery

    // http://api.jquery.com/attr/
    $t.attr(attr: string, value?: string): MQuery

    // http://api.jquery.com/html/
    $t.html(htmlText?: string): MQuery | string

    // http://api.jquery.com/text/
    $t.text(text: string): MQuery | string

    // http://api.jquery.com/val/
    $t.val(value?: string): MQuery | string

    // http://api.jquery.com/simblings/
    $t.simblings(selector?: string): MQuery

    // http://api.jquery.com/prev/
    $t.prev(selector?: string): MQuery

    // http://api.jquery.com/next/
    $t.next(selector?: string): MQuery

    // http://api.jquery.com/addclass/
    $t.addClass(class: string): MQuery

    // http://api.jquery.com/removeclass/
    $t.removeClass(class: string): MQuery

    // http://api.jquery.com/toggleclass/
    $t.toggleClass(class: string): MQuery

    // http://api.jquery.com/prepend/
    $t.prepend(...elem: MQuery | NodeList | HTMLElement): MQuery

    // http://api.jquery.com/append/
    $t.append(...elem: MQuery | NodeList | HTMLElement): MQuery
```

### Experimental
- [width([size])](http://api.jquery.com/width/)
- [height([size])](http://api.jquery.com/height/)
- load(url): [ALPHA]


### On Working...
- parents()

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

[MIT License](https://github.com/ECRomaneli/mQuery/blob/master/LICENSE.md)