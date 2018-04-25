type Callback = Function;

class MQuery {
    private static DOC = document;
    private nodeList: NodeList;
    
    constructor(obj?: any) {
        if (MQuery.typeOf(obj, 'function')) {
            this.nodeList = MQuery.generateNodeList();
            this.ready(obj);
        } else {
            this.nodeList = MQuery.generateNodeList(obj);
        }
    }

    private static isSet(param): boolean {
        return param !== undefined;
    }

    private static typeOf(object, type): boolean {
        if (type === 'array') {
            return Array.isArray(object);
        }
        return type === (typeof object).toLowerCase();
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

    private static arrayIncludes(array: any[], elem: any): boolean {
        return array.some((value) => value === elem);
    }

    private static htmlToNode(html: string): Node {
        let tmp = MQuery.DOC.createElement('_');
        tmp.innerHTML = html;
        return tmp.firstChild;
    }

    private static nodeIsSelector(node: Node, selector: string): boolean {
        let tmp = MQuery.DOC.createElement('_');
        tmp.appendChild(node);
        return !!tmp.querySelector(selector);
    }

    private static hasParent(elem: Node): boolean {
        return !!elem.parentNode;
    }

    private static forEach(nodeList: NodeList, callback: Callback) {
        Array.prototype.forEach.call(nodeList, callback);
    }

    private static generateNodeList(obj?: any): NodeList {
        if (!MQuery.isSet(obj)) {
            return MQuery.listToNodeList([MQuery.DOC]);
        }

        if (MQuery.typeOf(obj, 'string')) {
            try {
                return MQuery.DOC.querySelectorAll(obj);
            } catch (e) {
                return MQuery.listToNodeList([MQuery.htmlToNode(obj)]);
            }
        }

        if (MQuery.isSet(obj.nodeList)) {
            return obj.nodeList;
        }

        if (MQuery.typeOf(obj, 'nodelist')) {
            return obj;
        }

        return MQuery.listToNodeList(MQuery.typeOf(obj, 'array') ? obj : [obj]);
    }

    private static listToNodeList(list: Array<Node>): NodeList {
        let emptyNodeList = MQuery.DOC.createDocumentFragment().childNodes,
            properties = {};

        list.forEach((node, index) => properties[index] = {value: node});
        properties['length'] = { value: list.length };

        return Object.create(emptyNodeList, properties);
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

    public firstNode(): Node {
        return this.nodeList[0];
    }

    public lastNode(): Node {
        return this.nodeList[this.nodeList.length - 1];
    }

    public nodes(): NodeList {
        return this.nodeList;
    }

    public leaves(): MQuery {
        let leaves = [];
        this.each((i, elem) => {
            if (!elem.hasChildNodes()) {
                leaves.push(elem);
                return;
            }
            MQuery.forEach(elem.getElementsByTagName("*"), (child) => {
                if (!child.hasChildNodes()) {leaves.push(child); }
            });
        });
        return new MQuery(leaves);
    }

    public ready(handler: EventListener): MQuery {
        MQuery.DOC.addEventListener('DOMContentLoaded', handler, true);
        return this;
    }

    public each(handler: Callback): MQuery {
		let count = 0;
        MQuery.forEach(this.nodeList, (node) => handler.apply(node, [count++, node]));
        return this;
    }

    public on(event: string, handler: EventListener): MQuery {
        let events = event.split(' ');
        return this.each((i, elem) => {
            events.forEach((event) => {
                elem.addEventListener(event, handler, true);
            })
        });
    }

    public off(event: string, handler: EventListener): MQuery {
        let events = event.split(' ');
        return this.each((i, elem) => {
            events.forEach((event) => {
                elem.removeEventListener(event, handler, true);
            })
        });
    }

    public find(selector: string): MQuery {
        let nodes: Array<Node> = [];

        this.each((i, elem) => {
            let concat = elem.querySelectorAll(selector);
            concat.forEach(node => {
                if (!MQuery.arrayIncludes(nodes, node)) {
                    nodes.push(node);
                }
            });
        });

        return new MQuery(nodes);
    }
	
	public parent(selector?: string): MQuery {
        let parents = new Array<Node>();

        this.each((i, elem) => {
            if (!MQuery.hasParent(elem)) {return false; }
            elem = elem.parentNode;

            if (MQuery.isSet(selector) && !MQuery.nodeIsSelector(elem, selector)) {
                return false;
            }

            if (!MQuery.arrayIncludes(parents, elem)) {
                parents.push(elem);
            }
            return true;
        });

        return new MQuery(parents);
    }

    public trigger(event: string): MQuery {
        return this.each((i, elem) => {
            if (event === 'focus') {
                elem.focus();
                return;
            }
            elem.dispatchEvent(new CustomEvent(event));
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

    public css(name: string, value?: string): MQuery | string {
        name = MQuery.snakeToCamelCase(name);

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
let $ = m$;