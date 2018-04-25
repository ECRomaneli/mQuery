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
    MQuery.toArray = function (nodes) {
        return [].slice.call(nodes || []);
    };
    MQuery.prototype.push = function (node, once) {
        if (once && this.includes(node)) {
            return this;
        }
        this[this.length++] = node;
        return this;
    };
    MQuery.prototype.pop = function () {
        return this[--this.length];
    };
    MQuery.prototype.forEach = function (fn) {
        for (var i = 0; i < this.length; ++i) {
            fn(this[i], i, this);
        }
    };
    MQuery.prototype.some = function (fn) {
        for (var i = this.length - 1; i >= 0; --i) {
            if (fn(this[i])) {
                return true;
            }
        }
        return false;
    };
    MQuery.prototype.includes = function (node) {
        return this.some(function (value) { return value === node; });
    };
    MQuery.prototype.concat = function (nodes, once) {
        var _this = this;
        nodes.forEach(function (node) { return _this.push(node, once); });
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
    MQuery.forEach = function (nodeList, callback) {
        Array.prototype.forEach.call(nodeList, callback);
    };
    // MQUERY PROPERTIES
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
    MQuery.generateNodeArray = function (obj) {
        if (!MQuery.isSet(obj)) {
            return [MQuery.DOC];
        }
        if (MQuery.typeOf(obj, 'string')) {
            try {
                return MQuery.toArray(MQuery.DOC.querySelectorAll(obj));
            }
            catch (e) {
                return [MQuery.htmlToNode(obj)];
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
                    leaves.push(child, true);
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
    MQuery.prototype.on = function (event, handler) {
        var events = event.split(' ');
        return this.each(function (i, elem) {
            events.forEach(function (event) {
                elem.addEventListener(event, handler, true);
            });
        });
    };
    MQuery.prototype.off = function (event, handler) {
        var events = event.split(' ');
        return this.each(function (i, elem) {
            events.forEach(function (event) {
                elem.removeEventListener(event, handler, true);
            });
        });
    };
    MQuery.prototype.find = function (selector) {
        var nodes = new MQuery([]);
        this.each(function (i, elem) {
            var concat = elem.querySelectorAll(selector);
            concat.forEach(function (node) { return nodes.push(node, true); });
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
            if (MQuery.isSet(selector) && !MQuery.nodeIsSelector(elem, selector)) {
                return false;
            }
            parents.push(elem, true);
            return true;
        });
        return parents;
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
