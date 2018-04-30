var MQuery = /** @class */ (function () {
    function MQuery(obj) {
        this.length = 0;
        var nodes;
        if (MQuery.typeOf(obj, 'function')) {
            nodes = MQuery.generateNodeArray();
            this.ready(obj);
        }
        else {
            nodes = MQuery.generateNodeArray(obj);
        }
        this.concat(nodes);
    }
    // ARRAY PROPERTIES
    MQuery.toArray = function (obj) {
        return [].slice.call(obj || []);
    };
    MQuery.prototype.push = function (node) {
        if (!node || node[MQuery.appName] === this) {
            return this;
        }
        this[this.length++] = node;
        node[MQuery.appName] = this;
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
        nodes.forEach(function (node) { return _this.push(node); });
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
        return c.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); });
    };
    MQuery.forEach = function (nodeList, fn) {
        Array.prototype.forEach.call(nodeList, fn);
    };
    MQuery.forEachObj = function (obj, fn) {
        Object.keys(obj).forEach(function (key) { return fn(key, obj[key]); });
    };
    // MQUERY PROPERTIES
    MQuery.codeToNodeList = function (code) {
        var tmp = MQuery.DOC.createElement('_');
        tmp.innerHTML = code;
        return tmp.childNodes;
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
    MQuery.parseText = function (args) {
        var text = '';
        args.forEach(function (value, i) {
            if (MQuery.instanceOf(value, MQuery)) {
                text += value.outerHtml();
            }
            else if (MQuery.typeOf(value, 'string')) {
                text += value;
            }
        });
        return text;
    };
    MQuery.hasParent = function (elem) {
        return !!elem.parentNode;
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
        this.forEach((function (node) { return handler.apply(node, [count++, node]); }));
        return this;
    };
    MQuery.prototype.on = function (event, selectOrHandler, handler) {
        if (arguments.length === 2) {
            var handler_1 = selectOrHandler;
        }
        var events = event.split(' '), elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each(function (i, elem) {
            events.forEach(function (event) { return elem.addEventListener(event, handler, true); });
        });
        return this;
    };
    MQuery.prototype.off = function (event, selectOrHandler, handler) {
        if (arguments.length === 2) {
            var handler_2 = selectOrHandler;
        }
        var events = event.split(' '), elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each(function (i, elem) {
            events.forEach(function (event) { return elem.removeEventListener(event, handler, true); });
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
            MQuery.forEachObj(nameOrJSON, function (key, value) { return _this.css(key, value); });
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
        var args = MQuery.toArray(arguments);
        return this.each(function (i, elem) {
            elem.innerHTML = MQuery.parseText(args) + elem.innerHTML;
        });
    };
    MQuery.prototype.append = function () {
        var args = MQuery.toArray(arguments);
        console.log(args);
        return this.each(function (i, elem) {
            elem.innerHTML = elem.innerHTML + MQuery.parseText(args);
        });
    };
    MQuery.prototype.val = function (value) {
        if (!MQuery.isSet(value)) {
            return this.attr('value');
        }
        return this.attr('value', value);
    };
    MQuery.prototype.addClass = function (className) {
        return this.each(function (i, elem) { return elem.classList.add(className); });
    };
    MQuery.prototype.removeClass = function (className) {
        return this.each(function (i, elem) { return elem.classList.remove(className); });
    };
    MQuery.prototype.hasClass = function (className) {
        return this.some(function (elem) { return elem.classList.contains(className); });
    };
    MQuery.prototype.toggleClass = function (className) {
        return this.each(function (i, elem) { return elem.classList.toggle(className); });
    };
    MQuery.appName = 'mQuery';
    MQuery.DOC = document;
    return MQuery;
}());
var mQuery = function (ref) { return new MQuery(ref); }, m$ = mQuery;
mQuery['ready'] = mQuery().ready;
