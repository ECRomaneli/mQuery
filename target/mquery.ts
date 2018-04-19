type Callback = Function;

class MQuery {
    private nodeList: NodeList;
    
    constructor(ref?: any) {
        if (MQuery.typeOf(ref, 'function')) {
            this.nodeList = MQuery.generateNodeList();
            this.ready(ref);
        } else {
            this.nodeList = MQuery.generateNodeList(ref);
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

    private static forEach(nodeList: NodeList, callback: Callback) {
        Array.prototype.forEach.call(nodeList, callback);
    }

    private static generateNodeList(ref?: any): NodeList {
        if (!MQuery.isSet(ref)) {
            return MQuery.listToNodeList([document]);
        }

        if (MQuery.typeOf(ref, 'string')) {
            return document.querySelectorAll(ref);
        }

        if (MQuery.isSet(ref.nodeList)) {
            return ref.nodeList;
        }

        if (MQuery.typeOf(ref, 'nodelist')) {
            return ref;
        }

        return MQuery.listToNodeList(MQuery.typeOf(ref, 'array') ? ref : [ref]);
    }

    private static listToNodeList(list: Array<Object>): NodeList {
        let emptyNodeList = document.createDocumentFragment().childNodes,
            properties = {};

        list.forEach((node, index) => properties[index] = {value: node});
        properties['length'] = { value: list.length };

        return Object.create(emptyNodeList, properties);
    }

    private eachConcat(fnVal: Callback): string {
        let value = '';
        this.each(function () {
            value += fnVal.apply(this) + ' ';
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
        this.each(function () {
            MQuery.forEach(this.getElementsByTagName("*"), (e) => {
                if (!e.hasChildNodes()) {leaves.push(e); }
            });
        });
        return new MQuery(leaves);
    }

    public ready(handler: EventListener): MQuery {
        document.addEventListener('DOMContentLoaded', handler, true);
        return this;
    }

    public each(handler: Callback): MQuery {
        MQuery.forEach(this.nodeList, (node) => handler.apply(node));
        return this;
    }

    public on(event: string, handler: EventListener): MQuery {
        let events = event.split(' ');
        return this.each(function () {
            events.forEach((event) => {
                this.addEventListener(event, handler, true);
            })
        });
    }

    public find(selector: string): MQuery {
        let nodes: Array<Node> = [];

        this.each(function () {
            let concat = this.querySelectorAll(selector);
            concat.forEach(node => nodes.push(node));
        });

        return new MQuery(nodes);
    }

    public trigger(event: string): MQuery {
        return this.each(function () {
            if (event === 'focus') {
                this.focus();
                return;
            }
            this.dispatchEvent(new CustomEvent(event));
        });
    }

    public attr(name: string, value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each(function () {
                if (MQuery.isSet(this[name])) {
                    this[name] = value;
                    return;
                }
                this.setAttribute(name, value);
            });
        }
        return this.eachConcat(function () {
            return this.getAttribute(name);
        });
    }

    public css(name: string, value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each(function () {
                this.style[name] = value;
            });
        }
        return this.eachConcat(function () {
            return this.style[name];
        });
    }

    public text(value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each(function () {
                this.innerHTML = value;
            });
        }
        return this.eachConcat(function () {
            return this.innerHTML;
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