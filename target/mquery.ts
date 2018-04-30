type Callback = Function;

class MQuery {
    private static appName = 'mQuery';
    private static DOC = document;
    private length = 0;
    
    constructor(obj?: any) {
        let nodes: Array<Node> | MQuery;

        if (MQuery.typeOf(obj, 'function')) {
            nodes = MQuery.generateNodeArray();
            this.ready(obj);
        } else {
            nodes = MQuery.generateNodeArray(obj);
        }

        this.concat(nodes);
    }

    // ARRAY PROPERTIES
    
    private static toArray(nodes: NodeList): Array<Node> {
        return [].slice.call(nodes || []);
    }

    private push(node: Node): MQuery {
        if (!node || node[MQuery.appName] === this) {return this; }
        this[this.length++] = node;
        node[MQuery.appName] = this;
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
        nodes.forEach((node) => this.push(node));
        return this;
    }

    // UTILITIES

    private static isSet(param): boolean {
        return param !== undefined;
    }

    private static typeOf(object: any, type: string): boolean {
        if (type === 'array') {return Array.isArray(object); }
        return type === (typeof object).toLowerCase();
    }

    private static instanceOf(object: any, type: any): boolean {
        return object instanceof type;
    }
    
    private static getOrDefault(value: any, defaultValue: any): any {
        return MQuery.isSet(value) ? value : defaultValue;
    }

    private static snakeToCamelCase(s: string): string {
        return s.replace(/(\-\w)/g, (m) => m[1].toUpperCase());
    }

    private static camelToSnakeCase(c: string): string {
        return c.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());
    }

    private static forEach(nodeList: NodeList, fn: Callback) { 
        Array.prototype.forEach.call(nodeList, fn); 
    } 

    private static forEachObj(obj: Object, fn: Callback): void {
        Object.keys(obj).forEach((key) => fn(key, obj[key]));
    }

    // MQUERY PROPERTIES

    private static htmlToNode(html: string): Node {
        let tmp = MQuery.DOC.createElement('_');
        tmp.innerHTML = html;
        return tmp.firstChild;
    }

    private static matches(node: any, selector: string): boolean {
        if (!MQuery.isSet(selector)) {return true; }
        if (node.matches) {return node.matches(selector); }
        let tmp = MQuery.DOC.createElement('_');
        tmp.appendChild(node);
        return !!tmp.querySelector(selector);
    }

    private static hasParent(elem: Node): boolean {
        return !!elem.parentNode;
    }

    private static generateNodeArray(obj?: any): Array<Node> | MQuery {
        if (!MQuery.isSet(obj)) {
            return [MQuery.DOC];
        }

        if (MQuery.typeOf(obj, 'string')) {
            try {
                return MQuery.toArray(MQuery.DOC.querySelectorAll(obj));
            } catch (e) {
                return [MQuery.htmlToNode(obj)];
            }
        }

        if (MQuery.instanceOf(obj, MQuery)) {
            return obj;
        }

        return MQuery.typeOf(obj, 'array') ? obj : [obj];
    }

    private eachConcat(fnVal: Callback): string {
        let value = '';
        this.each((i, elem) => {
            value += fnVal.apply(elem, [i, elem]) + ' ';
        });
        return value.trim() || undefined;
    }

    public static defaultEvents(events: Array<string>): void {
        events.forEach((event) => {
            MQuery.prototype[event] = function (handler) {
                if (!MQuery.isSet(handler)) {
                    return this.trigger(event);
                }
                return this.on(event, handler);
            }
        });
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
        this.forEach((node => handler.apply(node, [count++, node])));
        return this;
    }

    public on(event: string, selectOrHandler: any, handler?: EventListener): MQuery {
        if (arguments.length === 2) {let handler = selectOrHandler; }

        let events = event.split(' '),
            elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each((i, elem) => {
            events.forEach((event) => elem.addEventListener(event, handler, true));
        });
        return this;
    }

    public off(event: string, selectOrHandler: any, handler: EventListener): MQuery {
        if (arguments.length === 2) {let handler = selectOrHandler; }

        let events = event.split(' '),
            elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each((i, elem) => {
            events.forEach((event) => elem.removeEventListener(event, handler, true));
        });
        return this;
    }

    public find(selector: string): MQuery {
        let nodes = new MQuery([]);

        this.each((i, elem) => {
            let concat = elem.querySelectorAll(selector);
            nodes.concat(concat);
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
            MQuery.forEachObj(nameOrJSON, (key, value) => this.css(key, value));
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

    public html(value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.innerHTML = value;
            });
        }
        return this.eachConcat((i, elem) => elem.innerHTML);
    }

    public prepend(value: string): MQuery {
        return this.each((i, elem) => {
            elem.innerHTML = value + elem.innerHTML;
        });
    }

    public append(value: string): MQuery {
        return this.each((i, elem) => {
            elem.innerHTML = elem.innerHTML + value;
        });
    }

    public val(value?: string): MQuery | string {
        if (!MQuery.isSet(value)) {
            return this.attr('value');
        }
        return this.attr('value', value);
    }
}

let mQuery = (ref?: any) => new MQuery(ref), m$ = mQuery;
mQuery['ready'] = mQuery().ready;