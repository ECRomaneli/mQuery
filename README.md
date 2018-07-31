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
    m$(handler: Function): mQuery

    // Array of HTMLElements
    m$(elemArr: Array<HTMLElement>): mQuery

    // HTML Element
    m$(elem: HTMLElement): mQuery

    // NodeList
    m$(list: NodeList): mQuery

    // mQuery instance
    m$(instance: mQuery): mQuery
```

## Functions
Actually, all functions listed behind, are jQuery compatible. Then, all mQuery code with any functions listed, will works with jQuery.

### Stable

```typescript
    // http://api.jquery.com/ready/
    .ready(handler: Function): this

    // http://api.jquery.com/each/
    .each(iterator: Function): this

    // http://api.jquery.com/on/ [BASIC IMPLEMENTATION]
    .on(events: string, selector?: any, handler: Function): this

    // http://api.jquery.com/off/ [BASIC IMPLEMENTATION]
    .off(events: string, selector?: Selector, handler: Function): this

    // http://api.jquery.com/one/ [BASIC IMPLEMENTATION]
    .one(events: string, selector?: any, handler: Function): this

    // http://api.jquery.com/trigger/
    .trigger(events: string, data?: any): this

    // http://api.jquery.com/find/
    .find(selector: string): mQuery

    // http://api.jquery.com/is/
    .is(filter: Function | string): boolean

    // http://api.jquery.com/not/
    .not(filter: Function | string): mQuery

    // http://api.jquery.com/has/
    .has(selector: string | HTMLElement): mQuery

    // http://api.jquery.com/filter/
    .filter(filter: Function | string): mQuery

    // http://api.jquery.com/end/
    .end(): mQuery

    // http://api.jquery.com/parent/
    .parent(selector?: string): mQuery

    // http://api.jquery.com/parents/
    .parents(selector?: string): mQuery

    // http://api.jquery.com/css/
    .css(prop: string, value?: string): this | string

    // http://api.jquery.com/css/
    .css(propArray: Array<string, string>): this

    // http://api.jquery.com/attr/
    .attr(attr: PlainObject | string, value?: string): this

    // http://api.jquery.com/removeAttr/
    .removeAttr(attrNames: string): this

    // http://api.jquery.com/prop/
    .prop(propName: PlainObject | string, value?: string): this

    // http://api.jquery.com/removeProp/
    .removeProp(propNames: string): this

    // http://api.jquery.com/html/
    .html(htmlText?: string): this | string

    // http://api.jquery.com/text/
    .text(text: string): this | string

    // http://api.jquery.com/data/
    .data(key: PlainObject | string, value?: string): this

    // http://api.jquery.com/val/
    .val(value?: string): this | string

    // http://api.jquery.com/remove/
    .remove(selector?: string): mQuery

    // http://api.jquery.com/empty/
    .empty(): this

    // http://api.jquery.com/map/
    .map(beforePush: Function): Array

    // http://api.jquery.com/children/
    .children(selector?: string): mQuery

    // http://api.jquery.com/simblings/
    .simblings(selector?: string): mQuery

    // http://api.jquery.com/prev/
    .prev(selector?: string): mQuery

    // http://api.jquery.com/next/
    .next(selector?: string): mQuery

    // http://api.jquery.com/addclass/
    .addClass(class: string): this

    // http://api.jquery.com/removeclass/
    .removeClass(class: string): this

    // http://api.jquery.com/toggleclass/
    .toggleClass(class: string): this

    // http://api.jquery.com/prepend/
    .prepend(...elem: mQuery | NodeList | HTMLElement): this

    // http://api.jquery.com/append/
    .append(...elem: mQuery | NodeList | HTMLElement): this

    // http://api.jquery.com/width/
    .width(value?: string | number): this | number

    // http://api.jquery.com/height/
    .height(value?: string | number): this | number

    // http://api.jquery.com/load/
    .load(url: string, data?: Object | string, complete?: Function): this | number
```

### AJAX
```typescript
    // http://api.jquery.com/jQuery.ajax/
    m$.ajax(url?: string, settings: AJAXSettings): Deferred

    // http://api.jquery.com/jQuery.get/
    m$.get(url: string, data?: any, success: AJAXSuccess): Deferred
    m$.get(settings: AJAXSettings): Deferred

    // http://api.jquery.com/jQuery.post/
    m$.post(url: string, data: any, success: AJAXSuccess): Deferred
    m$.post(settings: AJAXSettings): Deferred
```

### Promise
```typescript
    // http://api.jquery.com/jQuery.Deferred/
    m$.Deferred(beforeStart?: Function): Deferred
```

### Shorthand Methods
```typescript
    // To use shorthand event methods, declare it using:
    m$.shorthands(events: string[])

    // Example:
    m$.shorthands(['click', 'mouseenter', 'focus'])
```

### Utils
```typescript
    // http://api.jquery.com/jQuery.isArrayLike/
    m$.isArrayLike(obj): boolean

    // http://api.jquery.com/jQuery.isEmptyObject/
    m$.isEmptyObject(obj: any): boolean

    // http://api.jquery.com/jQuery.globalEval/
    m$.globalEval(code: string): void

    // http://api.jquery.com/jQuery.parseHTML/
    m$.parseHTML(htmlString: string): NodeList

    // http://api.jquery.com/jQuery.param/
    m$.param(obj: ArrayLikeObject, tradicional = false): string

    // http://api.jquery.com/jQuery.merge/
    m$.merge(first: ArrayLike, second: ArrayLike): ArrayLike

    // http://api.jquery.com/jQuery.makeArray/
    m$.makeArray(obj: ArrayLike): Array

    // http://api.jquery.com/jQuery.proxy/
    m$.proxy(target: Function, context: any): Function

    // http://api.jquery.com/jQuery.each/
    m$.each(arr: ArrayLikeObject, it: ForEachIterator): ArrayLikeObject

    // http://api.jquery.com/jQuery.grep/
    m$.grep(arr: ArrayLike, filter: (value, index) => boolean, invert = false): ArrayLike

    // http://api.jquery.com/jQuery.map/
    m$.map(arr: ArrayLikeObject, beforePush: (value, index) => any): Array

    // http://api.jquery.com/jQuery.type/
    m$.type(obj: any): string

```

### Exclusive Utils
```typescript
    // Transforms object into string and string into object
    m$.json(objOrText: Object | string, ignoreErr: boolean, forceStringify?: boolean): Object | string

    // Get and set cookies by key
    m$.cookie(key: string, value?: any, options: {timeout: seconds, path: string}): any
```

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

mQuery:
[MIT License](https://github.com/ECRomaneli/mQuery/blob/master/LICENSE.md)

jQuery:
[License Page](https://jquery.org/license/)

