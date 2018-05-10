type Callback = Function;

class MQuery {
    private static APP_NAME = 'mQuery';
    private static DOC = document;
    private static AUX_ELEM = MQuery.DOC.createElement(`_${MQuery.APP_NAME}_`);
    public length = 0;
    
    constructor(selector?: any) {
        let nodes: Array<Node> | MQuery;

        if (MQuery.typeOf(selector, 'function')) {
            nodes = MQuery.generateNodeArray();
            this.ready(selector);
        } else {
            nodes = MQuery.generateNodeArray(selector);
        }

        this.concat(nodes);
    }

    // ARRAY PROPERTIES
    
    private static toArray(obj: any): Array<any> {
        return [].slice.call(obj || []);
    }

    private push(node: Node): MQuery {
        if (!node || node[MQuery.APP_NAME] === this) {return this; }
        this[this.length++] = node;
        node[MQuery.APP_NAME] = this;
        return this;
    }

    private forEach(fn: Callback): void {
        for (let i = 0; i < this.length; ++i) {
            fn(this[i], i, this);
        }
    }

    private some(fn: Callback): boolean { 
        for (let i = this.length - 1; i >= 0; --i) { 
            if (fn(this[i], i, this)) {return true; } 
        } 
        return false; 
    } 

    private concat(nodes: any): MQuery {
        nodes.forEach((node) => {this.push(node)});
        return this;
    }

    // UTILITIES

    public static isSet(param): boolean {
        return param !== undefined;
    }

    public static typeOf(object: any, type: string): boolean {
        if (type === 'array') {return Array.isArray(object); }
        return type === (typeof object).toLowerCase();
    }

    public static instanceOf(object: any, type: any): boolean {
        return object instanceof type;
    }
    
    public static getOrDefault(value: any, defaultValue: any): any {
        return MQuery.isSet(value) ? value : defaultValue;
    }

    public static snakeToCamelCase(s: string): string {
        return s.replace(/(\-\w)/g, (m) => m[1].toUpperCase());
    }

    public static camelToSnakeCase(c: string): string {
        return c.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
    }

    public static forEach(list: any, fn: Callback) { 
        Array.prototype.forEach.call(list, fn); 
    } 

    public static forEachObj(obj: Object, fn: Callback): void {
        Object.keys(obj).forEach((key) => {fn(key, obj[key])});
    }

    // MQUERY PROPERTIES

    private static codeToNodeList(code: string): NodeList {
        MQuery.AUX_ELEM.innerHTML = code;
        return MQuery.AUX_ELEM.childNodes;
    }

    private static matches(node: any, selector: string): boolean {
        if (!MQuery.isSet(selector)) {return true; }
        if (node.matches) {return node.matches(selector); }
        let tmp = MQuery.DOC.createElement('_');
        tmp.appendChild(node);
        return !!tmp.querySelector(selector);
    }

    private static hasParent(elem: Node): boolean {
        return elem.parentNode && elem.parentNode !== MQuery.AUX_ELEM;
    }

    private static generateNodeArray(obj?: any): Array<Node> | MQuery {
        if (!MQuery.isSet(obj)) {
            return [MQuery.DOC];
        }

        if (MQuery.typeOf(obj, 'string')) {
            try {
                return MQuery.toArray(MQuery.DOC.querySelectorAll(obj));
            } catch (e) {
                return MQuery.toArray(MQuery.codeToNodeList(obj));
            }
        }

        if (MQuery.instanceOf(obj, MQuery)) {
            return obj;
        }

        return MQuery.typeOf(obj, 'array') ? obj : [obj];
    }

    public static setEventFunctions(events: Array<string>): void {
        let fn = function (handler) {
            if (!MQuery.isSet(handler)) {
                return this.trigger(event);
            }
            return this.on(event, handler);
        };
        events.forEach((event) => {MQuery.prototype[event] = fn});
    }

    public static exportFunctions(target: any, fns: Array<string>, selector: any = []): void {
        fns.forEach((fn) => {target[fn] = function () {
            let mQuery = new MQuery(selector);
            mQuery[fn].apply(mQuery, arguments);
        }});
    }

    private static setChildren(rawChildren: any, nodeInsertFn, stringInsertFn): void {
        rawChildren.forEach((children) => {
            if (MQuery.instanceOf(children, MQuery)) {
                children.each((i, child) => {
                    if (MQuery.hasParent(child)) {
                        stringInsertFn(child.outerHTML);
                        return;
                    }
                    nodeInsertFn(child);
                });
                return;
            }
            if (MQuery.typeOf(children, 'node')) {
                nodeInsertFn(children);
                return;
            }
            stringInsertFn(children);
        });
    }

    private eachConcat(fnVal: Callback): string {
        let value = '';
        this.each((i, elem) => {
            value += `${fnVal.apply(elem, [i, elem])} `;
        });
        return value.trim() || undefined;
    }

    public leaves(): MQuery {
        let leaves = new MQuery([]);
        this.each((i, elem) => {
            if (!elem.firstElementChild) {
                leaves.push(elem);
                return;
            }
            MQuery.forEach(elem.getElementsByTagName("*"), (child) => {
                if (!child.firstElementChild) {leaves.push(child); }
            });
        });
        return leaves;
    }

    public ready(handler: EventListener): MQuery {
        MQuery.DOC.addEventListener('DOMContentLoaded', handler, true);
        return this;
    }

    public each(handler: Callback): MQuery {
        let count = 0;
        this.forEach(node => {handler.apply(node, [count++, node])});
        return this;
    }

    public on(event: string, selectOrHandler: any, handler?: EventListener): MQuery {
        if (arguments.length === 2) {let handler = selectOrHandler; }

        let events = event.split(' '),
            elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each((i, elem) => {
            events.forEach((event) => {elem.addEventListener(event, handler, true)});
        });
        return this;
    }

    public off(event: string, selectOrHandler: any, handler: EventListener): MQuery {
        if (arguments.length === 2) {let handler = selectOrHandler; }

        let events = event.split(' '),
            elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each((i, elem) => {
            events.forEach((event) => {elem.removeEventListener(event, handler, true)});
        });
        return this;
    }

    public find(selector: string): MQuery {
        let nodes = new MQuery([]), concat;

        this.each((i, elem) => {
            try {
                concat = elem.querySelectorAll(selector);
                nodes.concat(concat);
            } catch (e) {}
        });

        return nodes;
    }
	
	public parent(selector?: string): MQuery {
        let parents = new MQuery([]);

        this.each((i, elem) => {
            if (!MQuery.hasParent(elem)) {return false; }
            elem = elem.parentNode;

            if (!MQuery.matches(elem, selector)) {
                return false;
            }

            parents.push(elem);
            return true;
        });

        return parents;
    }

    public load(url: string, complete?: any, error?: any): MQuery {
        let fetchURL = fetch(url).then((data) => data.text());
        fetchURL.then((text) => {this.html(text); });
        MQuery.isSet(complete) && fetchURL.then(complete);
        MQuery.isSet(error) && fetchURL.catch(error);
        return this;
    }

    public trigger(event: string, data?: Object): MQuery {
        return this.each((i, elem) => {
            if (event === 'focus') {
                elem.focus();
                return;
            }
            let customEvent;
            if (window['CustomEvent']) {
                customEvent = new CustomEvent(event, data);
            } else {
                customEvent = document.createEvent(MQuery.snakeToCamelCase(event));
                customEvent.initCustomEvent(event, true, true, data);
            }
            elem.dispatchEvent(customEvent);
        });
    }

    public attr(name: string, value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                if (MQuery.isSet(elem[name])) {
                    elem[name] = value;
                    return;
                }
                elem.setAttribute(name, value);
            });
        }
        return this.eachConcat((i, elem) => elem.getAttribute(name));
    }

    public css(nameOrJSON: any, value?: string): MQuery | string {
        if (!MQuery.typeOf(nameOrJSON, 'string')) {
            MQuery.forEachObj(nameOrJSON, (key, value) => {this.css(key, value)});
            return this;
        }

        let name = MQuery.snakeToCamelCase(nameOrJSON);

        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.style[name] = value;
            });
        }

        return this.eachConcat((i, elem) => {
            return elem.style[name];
        });
    }

    public text(value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.textContent = value;
            });
        }
        return this.eachConcat((i, elem) => elem.textContent);
    }

    public html(value?: any): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.innerHTML = value;
            });
        }
        return this.eachConcat((i, elem) => elem.innerHTML);
    }

    public outerHtml(value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.outerHTML = value;
            });
        }
        return this.eachConcat((i, elem) => elem.outerHTML);
    }

    public simblings(selector?: string): MQuery {
        let simblings = new MQuery([]);
        this.each((i, elem) => {
            MQuery.forEach(elem.parentNode.children, (child) => {
                if (child === elem) {return false; }
                if (!MQuery.matches(child, selector)) {return false; }
                simblings.push(child);
            });
        });
        return simblings;
    }

    public prev(selector?: string): MQuery {
        let prev = new MQuery([]), prevElem;
        this.each((i, elem) => {
            prevElem = elem.previousElementSibling;
            while (prevElem && !MQuery.matches(prevElem, selector)) {
                prevElem = prevElem.previousElementSibling;
            }
            prev.push(prevElem);
        });
        return prev;
    }

    public next(selector?: string): MQuery {
        let next = new MQuery([]), nextElem;
        this.each((i, elem) => {
            nextElem = elem.nextElementSibling;
            while (nextElem && !MQuery.matches(nextElem, selector)) {
                nextElem = nextElem.nextElementSibling;
            }
            next.push(nextElem);
        });
        return next;
    }

    public prepend(): MQuery {
        let rawChildren = MQuery.toArray(arguments).reverse();
        return this.each((i, parent) => {
            MQuery.setChildren(rawChildren,
                (child) =>  {parent.insertBefore(child, parent.firstChild)},
                (str) =>    {parent.insertAdjacentHTML('afterbegin', str)});
        });
    }

    public append(): MQuery {
        let rawChildren = MQuery.toArray(arguments);
        return this.each((i, parent) => {
            MQuery.setChildren(rawChildren,
                (child) =>  {parent.appendChild(child)},
                (str) =>    {parent.insertAdjacentHTML('beforeend', str)});
        });
    }

    public data(attr: string, value?: string): MQuery | string {
        if (!MQuery.isSet(value)) {
            return this.attr(`data-${attr}`);
        }
        return this.attr(`data-${attr}`, value);
    }

    public val(value?: string): MQuery | string {
        if (!MQuery.isSet(value)) {
            return this.attr('value');
        }
        return this.attr('value', value);
    }

    public addClass(className: string): MQuery {
        return this.each((i, elem) => {elem.classList.add(className)});
    }

    public removeClass(className: string): MQuery {
        return this.each((i, elem) => {elem.classList.remove(className)});
    }

    public hasClass(className: string): boolean {
        return this.some((elem) => elem.classList.contains(className));
    }

    public toggleClass(className: string): MQuery {
        return this.each((i, elem) => {elem.classList.toggle(className)});
    }
}

var m$ = (ref?: any) => new MQuery(ref), mQuery = m$;
MQuery.exportFunctions(m$, ['ready', 'load']);