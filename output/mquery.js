var MQuery = /** @class */ (function () {
    function MQuery(selector) {
        this.length = 0;
        var nodes;
        if (MQuery.typeOf(selector, 'function')) {
            nodes = MQuery.generateNodeArray();
            this.ready(selector);
        }
        else {
            nodes = MQuery.generateNodeArray(selector);
        }
        this.concat(nodes);
    }
    // ARRAY PROPERTIES
    MQuery.toArray = function (obj) {
        return [].slice.call(obj || []);
    };
    MQuery.prototype.push = function (node) {
        if (!node || node[MQuery.APP_NAME] === this) {
            return this;
        }
        this[this.length++] = node;
        node[MQuery.APP_NAME] = this;
        return this;
    };
    MQuery.prototype.forEach = function (fn) {
        for (var i = 0; i < this.length; ++i) {
            fn(this[i], i, this);
        }
    };
    MQuery.prototype.some = function (fn) {
        for (var i = this.length - 1; i >= 0; --i) {
            if (fn(this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
    MQuery.prototype.concat = function (nodes) {
        var _this = this;
        nodes.forEach(function (node) { _this.push(node); });
        return this;
    };
    // UTILITIES
    MQuery.isSet = function (param) {
        return param !== undefined;
    };
    MQuery.typeOf = function (object, type) {
        if (type === 'array') {
            return Array.isArray(object);
        }
        return type === (typeof object).toLowerCase();
    };
    MQuery.instanceOf = function (object, type) {
        return object instanceof type;
    };
    MQuery.getOrDefault = function (value, defaultValue) {
        return MQuery.isSet(value) ? value : defaultValue;
    };
    MQuery.snakeToCamelCase = function (s) {
        return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    };
    MQuery.camelToSnakeCase = function (c) {
        return c.replace(/([A-Z])/g, function (m) { return "-" + m.toLowerCase(); });
    };
    MQuery.forEach = function (list, fn) {
        Array.prototype.forEach.call(list, fn);
    };
    MQuery.forEachObj = function (obj, fn) {
        Object.keys(obj).forEach(function (key) { fn(key, obj[key]); });
    };
    // MQUERY PROPERTIES
    MQuery.codeToNodeList = function (code) {
        MQuery.AUX_ELEM.innerHTML = code;
        return MQuery.AUX_ELEM.childNodes;
    };
    MQuery.matches = function (node, selector) {
        if (!MQuery.isSet(selector)) {
            return true;
        }
        if (node.matches) {
            return node.matches(selector);
        }
        var tmp = MQuery.DOC.createElement('_');
        tmp.appendChild(node);
        return !!tmp.querySelector(selector);
    };
    MQuery.hasParent = function (elem) {
        return elem.parentNode && elem.parentNode !== MQuery.AUX_ELEM;
    };
    MQuery.generateNodeArray = function (obj) {
        if (!MQuery.isSet(obj)) {
            return [MQuery.DOC];
        }
        if (MQuery.typeOf(obj, 'string')) {
            try {
                return MQuery.toArray(MQuery.DOC.querySelectorAll(obj));
            }
            catch (e) {
                return MQuery.toArray(MQuery.codeToNodeList(obj));
            }
        }
        if (MQuery.instanceOf(obj, MQuery)) {
            return obj;
        }
        return MQuery.typeOf(obj, 'array') ? obj : [obj];
    };
    MQuery.setEventFunctions = function (events) {
        var fn = function (handler) {
            if (!MQuery.isSet(handler)) {
                return this.trigger(event);
            }
            return this.on(event, handler);
        };
        events.forEach(function (event) { MQuery.prototype[event] = fn; });
    };
    MQuery.exportFunctions = function (target, fns, selector) {
        if (selector === void 0) { selector = []; }
        fns.forEach(function (fn) {
            target[fn] = function () {
                var mQuery = new MQuery(selector);
                mQuery[fn].apply(mQuery, arguments);
            };
        });
    };
    MQuery.setChildren = function (rawChildren, nodeInsertFn, stringInsertFn) {
        rawChildren.forEach(function (children) {
            if (MQuery.instanceOf(children, MQuery)) {
                children.each(function (i, child) {
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
    };
    MQuery.prototype.eachConcat = function (fnVal) {
        var value = '';
        this.each(function (i, elem) {
            value += fnVal.apply(elem, [i, elem]) + " ";
        });
        return value.trim() || undefined;
    };
    MQuery.prototype.leaves = function () {
        var leaves = new MQuery([]);
        this.each(function (i, elem) {
            if (!elem.firstElementChild) {
                leaves.push(elem);
                return;
            }
            MQuery.forEach(elem.getElementsByTagName("*"), function (child) {
                if (!child.firstElementChild) {
                    leaves.push(child);
                }
            });
        });
        return leaves;
    };
    MQuery.prototype.ready = function (handler) {
        MQuery.DOC.addEventListener('DOMContentLoaded', handler, true);
        return this;
    };
    MQuery.prototype.each = function (handler) {
        var count = 0;
        this.forEach(function (node) { handler.apply(node, [count++, node]); });
        return this;
    };
    MQuery.prototype.on = function (event, selectOrHandler, handler) {
        if (arguments.length === 2) {
            var handler_1 = selectOrHandler;
        }
        var events = event.split(' '), elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each(function (i, elem) {
            events.forEach(function (event) { elem.addEventListener(event, handler, true); });
        });
        return this;
    };
    MQuery.prototype.off = function (event, selectOrHandler, handler) {
        if (arguments.length === 2) {
            var handler_2 = selectOrHandler;
        }
        var events = event.split(' '), elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each(function (i, elem) {
            events.forEach(function (event) { elem.removeEventListener(event, handler, true); });
        });
        return this;
    };
    MQuery.prototype.find = function (selector) {
        var nodes = new MQuery([]), concat;
        this.each(function (i, elem) {
            try {
                concat = elem.querySelectorAll(selector);
                nodes.concat(concat);
            }
            catch (e) { }
        });
        return nodes;
    };
    MQuery.prototype.parent = function (selector) {
        var parents = new MQuery([]);
        this.each(function (i, elem) {
            if (!MQuery.hasParent(elem)) {
                return false;
            }
            elem = elem.parentNode;
            if (!MQuery.matches(elem, selector)) {
                return false;
            }
            parents.push(elem);
            return true;
        });
        return parents;
    };
    MQuery.prototype.load = function (url, complete, error) {
        var _this = this;
        var fetchURL = fetch(url).then(function (data) { return data.text(); });
        fetchURL.then(function (text) { _this.html(text); });
        MQuery.isSet(complete) && fetchURL.then(complete);
        MQuery.isSet(error) && fetchURL["catch"](error);
        return this;
    };
    MQuery.prototype.trigger = function (event, data) {
        return this.each(function (i, elem) {
            if (event === 'focus') {
                elem.focus();
                return;
            }
            var customEvent;
            if (window['CustomEvent']) {
                customEvent = new CustomEvent(event, data);
            }
            else {
                customEvent = document.createEvent(MQuery.snakeToCamelCase(event));
                customEvent.initCustomEvent(event, true, true, data);
            }
            elem.dispatchEvent(customEvent);
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
    MQuery.prototype.css = function (nameOrJSON, value) {
        var _this = this;
        if (!MQuery.typeOf(nameOrJSON, 'string')) {
            MQuery.forEachObj(nameOrJSON, function (key, value) { _this.css(key, value); });
            return this;
        }
        var name = MQuery.snakeToCamelCase(nameOrJSON);
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
                elem.textContent = value;
            });
        }
        return this.eachConcat(function (i, elem) { return elem.textContent; });
    };
    MQuery.prototype.html = function (value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                elem.innerHTML = value;
            });
        }
        return this.eachConcat(function (i, elem) { return elem.innerHTML; });
    };
    MQuery.prototype.outerHtml = function (value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                elem.outerHTML = value;
            });
        }
        return this.eachConcat(function (i, elem) { return elem.outerHTML; });
    };
    MQuery.prototype.simblings = function (selector) {
        var simblings = new MQuery([]);
        this.each(function (i, elem) {
            MQuery.forEach(elem.parentNode.children, function (child) {
                if (child === elem) {
                    return false;
                }
                if (!MQuery.matches(child, selector)) {
                    return false;
                }
                simblings.push(child);
            });
        });
        return simblings;
    };
    MQuery.prototype.prev = function (selector) {
        var prev = new MQuery([]), prevElem;
        this.each(function (i, elem) {
            prevElem = elem.previousElementSibling;
            while (prevElem && !MQuery.matches(prevElem, selector)) {
                prevElem = prevElem.previousElementSibling;
            }
            prev.push(prevElem);
        });
        return prev;
    };
    MQuery.prototype.next = function (selector) {
        var next = new MQuery([]), nextElem;
        this.each(function (i, elem) {
            nextElem = elem.nextElementSibling;
            while (nextElem && !MQuery.matches(nextElem, selector)) {
                nextElem = nextElem.nextElementSibling;
            }
            next.push(nextElem);
        });
        return next;
    };
    MQuery.prototype.prepend = function () {
        var rawChildren = MQuery.toArray(arguments).reverse();
        return this.each(function (i, parent) {
            MQuery.setChildren(rawChildren, function (child) { parent.insertBefore(child, parent.firstChild); }, function (str) { parent.insertAdjacentHTML('afterbegin', str); });
        });
    };
    MQuery.prototype.append = function () {
        var rawChildren = MQuery.toArray(arguments);
        return this.each(function (i, parent) {
            MQuery.setChildren(rawChildren, function (child) { parent.appendChild(child); }, function (str) { parent.insertAdjacentHTML('beforeend', str); });
        });
    };
    MQuery.prototype.data = function (attr, value) {
        if (!MQuery.isSet(value)) {
            return this.attr("data-" + attr);
        }
        return this.attr("data-" + attr, value);
    };
    MQuery.prototype.val = function (value) {
        if (!MQuery.isSet(value)) {
            return this.attr('value');
        }
        return this.attr('value', value);
    };
    MQuery.prototype.addClass = function (className) {
        return this.each(function (i, elem) { elem.classList.add(className); });
    };
    MQuery.prototype.removeClass = function (className) {
        return this.each(function (i, elem) { elem.classList.remove(className); });
    };
    MQuery.prototype.hasClass = function (className) {
        return this.some(function (elem) { return elem.classList.contains(className); });
    };
    MQuery.prototype.toggleClass = function (className) {
        return this.each(function (i, elem) { elem.classList.toggle(className); });
    };
    MQuery.APP_NAME = 'mQuery';
    MQuery.DOC = document;
    MQuery.AUX_ELEM = MQuery.DOC.createElement("_" + MQuery.APP_NAME + "_");
    return MQuery;
}());
var m$ = function (ref) { return new MQuery(ref); }, mQuery = m$;
MQuery.exportFunctions(m$, ['ready', 'load']);
