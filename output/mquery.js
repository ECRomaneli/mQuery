var MQuery = /** @class */ (function () {
    function MQuery(obj) {
        if (MQuery.typeOf(obj, 'function')) {
            this.nodeList = MQuery.generateNodeList();
            this.ready(obj);
        }
        else {
            this.nodeList = MQuery.generateNodeList(obj);
        }
    }
    MQuery.isSet = function (param) {
        return param !== undefined;
    };
    MQuery.typeOf = function (object, type) {
        if (type === 'array') {
            return Array.isArray(object);
        }
        return type === (typeof object).toLowerCase();
    };
    MQuery.getOrDefault = function (value, defaultValue) {
        return MQuery.isSet(value) ? value : defaultValue;
    };
    MQuery.snakeToCamelCase = function (s) {
        return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    };
    MQuery.camelToSnakeCase = function (c) {
        return c.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); });
    };
    MQuery.arrayIncludes = function (array, elem) {
        return array.some(function (value) { return value === elem; });
    };
    MQuery.htmlToNode = function (html) {
        var tmp = MQuery.DOC.createElement('_');
        tmp.innerHTML = html;
        return tmp.firstChild;
    };
    MQuery.nodeIsSelector = function (node, selector) {
        var tmp = MQuery.DOC.createElement('_');
        tmp.appendChild(node);
        return !!tmp.querySelector(selector);
    };
    MQuery.hasParent = function (elem) {
        return !!elem.parentNode;
    };
    MQuery.forEach = function (nodeList, callback) {
        Array.prototype.forEach.call(nodeList, callback);
    };
    MQuery.generateNodeList = function (obj) {
        if (!MQuery.isSet(obj)) {
            return MQuery.listToNodeList([MQuery.DOC]);
        }
        if (MQuery.typeOf(obj, 'string')) {
            try {
                return MQuery.DOC.querySelectorAll(obj);
            }
            catch (e) {
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
    };
    MQuery.listToNodeList = function (list) {
        var emptyNodeList = MQuery.DOC.createDocumentFragment().childNodes, properties = {};
        list.forEach(function (node, index) { return properties[index] = { value: node }; });
        properties['length'] = { value: list.length };
        return Object.create(emptyNodeList, properties);
    };
    MQuery.prototype.eachConcat = function (fnVal) {
        var value = '';
        this.each(function (i, elem) {
            value += fnVal.apply(elem, [i, elem]) + ' ';
        });
        return value.trim() || undefined;
    };
    MQuery.defaultEvents = function (events) {
        events.forEach(function (event) {
            MQuery.prototype[event] = function (handler) {
                if (!MQuery.isSet(handler)) {
                    return this.trigger(event);
                }
                return this.on(event, handler);
            };
        });
    };
    MQuery.prototype.firstNode = function () {
        return this.nodeList[0];
    };
    MQuery.prototype.lastNode = function () {
        return this.nodeList[this.nodeList.length - 1];
    };
    MQuery.prototype.nodes = function () {
        return this.nodeList;
    };
    MQuery.prototype.leaves = function () {
        var leaves = [];
        this.each(function (i, elem) {
            if (!elem.hasChildNodes()) {
                leaves.push(elem);
                return;
            }
            MQuery.forEach(elem.getElementsByTagName("*"), function (child) {
                if (!child.hasChildNodes()) {
                    leaves.push(child);
                }
            });
        });
        return new MQuery(leaves);
    };
    MQuery.prototype.ready = function (handler) {
        MQuery.DOC.addEventListener('DOMContentLoaded', handler, true);
        return this;
    };
    MQuery.prototype.each = function (handler) {
        var count = 0;
        MQuery.forEach(this.nodeList, function (node) { return handler.apply(node, [count++, node]); });
        return this;
    };
    MQuery.prototype.on = function (event, handler) {
        var events = event.split(' ');
        return this.each(function (i, elem) {
            events.forEach(function (event) {
                elem.addEventListener(event, handler, true);
            });
        });
    };
    MQuery.prototype.find = function (selector) {
        var nodes = [];
        this.each(function (i, elem) {
            var concat = elem.querySelectorAll(selector);
            concat.forEach(function (node) {
                if (!MQuery.arrayIncludes(nodes, node)) {
                    nodes.push(node);
                }
            });
        });
        return new MQuery(nodes);
    };
    MQuery.prototype.parent = function (selector) {
        var parents = new Array();
        this.each(function (i, elem) {
            if (!MQuery.hasParent(elem)) {
                return false;
            }
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
    };
    MQuery.prototype.trigger = function (event) {
        return this.each(function (i, elem) {
            if (event === 'focus') {
                elem.focus();
                return;
            }
            elem.dispatchEvent(new CustomEvent(event));
        });
    };
    MQuery.prototype.attr = function (name, value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                if (MQuery.isSet(elem[name])) {
                    elem[name] = value;
                    return;
                }
                elem.setAttribute(name, value);
            });
        }
        return this.eachConcat(function (i, elem) { return elem.getAttribute(name); });
    };
    MQuery.prototype.css = function (name, value) {
        name = MQuery.snakeToCamelCase(name);
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                elem.style[name] = value;
            });
        }
        return this.eachConcat(function (i, elem) {
            return elem.style[name];
        });
    };
    MQuery.prototype.text = function (value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                elem.innerHTML = value;
            });
        }
        return this.eachConcat(function (i, elem) { return elem.innerHTML; });
    };
    MQuery.prototype.prepend = function (value) {
        return this.each(function (i, elem) {
            elem.innerHTML = value + elem.innerHTML;
        });
    };
    MQuery.prototype.append = function (value) {
        return this.each(function (i, elem) {
            elem.innerHTML = elem.innerHTML + value;
        });
    };
    MQuery.prototype.val = function (value) {
        if (!MQuery.isSet(value)) {
            return this.attr('value');
        }
        return this.attr('value', value);
    };
    MQuery.DOC = document;
    return MQuery;
}());
var mQuery = function (ref) { return new MQuery(ref); }, m$ = mQuery;
mQuery['ready'] = mQuery().ready;
var $ = m$;
