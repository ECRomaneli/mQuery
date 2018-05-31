var MQuery = /** @class */ (function () {
    /**
     * Default constructor
     * @param selector MQuery | NodeList | Node | QuerySelector | HTML String
     */
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
    // =================== ARRAY PROPERTIES =================== //
    /**
     * Transform object parameter to Array
     * @param obj object must be array compatible
     * @return Array
     */
    MQuery.toArray = function (obj) {
        return [].slice.call(obj || []);
    };
    /**
     * Insert Node on internal list
     * @param node Node element
     * @return MQuery instance
     */
    MQuery.prototype.push = function (node) {
        // Verify if node has been inserted inside this list before
        if (!node || node[MQuery.APP_NAME] === this) {
            return this;
        }
        this[this.length++] = node;
        // Add list reference to the node
        node[MQuery.APP_NAME] = this;
        return this;
    };
    /**
     * Each listed elements on position ascendant order
     * @param fn {elem, index, list} Callback for each elements
     * @return void
     */
    MQuery.prototype.forEach = function (fn) {
        for (var i = 0; i < this.length; ++i) {
            fn(this[i], i, this);
        }
    };
    /**
     * Each listed elements on position descendant order at found a positive return
     * @param fn {elem, index, list} Callback for each elements
     * @return true if some iteration return true, or false if not
     */
    MQuery.prototype.some = function (fn) {
        for (var i = this.length - 1; i >= 0; --i) {
            if (fn(this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Concat array-like elements inside current object
     * @param nodes MQuery | Array[Node]
     * @return MQuery instance
     */
    MQuery.prototype.concat = function (nodes) {
        var _this = this;
        nodes.forEach(function (node) { _this.push(node); });
        return this;
    };
    // ====================== UTILITIES ======================= //
    /**
     * Verify if parameter is set (comparing with undefined)
     * NOTE: [], 0 and "" will return true
     * @param param parameter to be verified
     * @return if object is setted or not
     */
    MQuery.isSet = function (param) {
        return param !== undefined;
    };
    /**
     * Verify the type of object passed and compare
     * @param object object to be verified
     * @param type type of object
     * @return if object is of passed type or not
     */
    MQuery.typeOf = function (object, types) {
        return types.split(' ').some(function (type) {
            if (type === 'array') {
                return Array.isArray(object);
            }
            return type === (typeof object).toLowerCase();
        });
    };
    /**
     * Verify if object is instance of type passed
     * @param object object to be verified
     * @param type type of object
     * @return if object is instance of type or not
     */
    MQuery.instanceOf = function (object, type) {
        return object instanceof type;
    };
    /**
     * Get the value or, if not exists, the default value
     * @param value value
     * @param defaultValue default value
     * @return value if exists or default value if not
     */
    MQuery.getOrDefault = function (value, defaultValue) {
        return MQuery.isSet(value) ? value : defaultValue;
    };
    /**
     * Transform snake case string to camel case
     * @param s snake case string
     * @return camel case string
     */
    MQuery.snakeToCamelCase = function (s) {
        return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    };
    /**
     * Transform camel case string to snake case
     * @param c camel case string
     * @return snake case string
     */
    MQuery.camelToSnakeCase = function (c) {
        return c.replace(/([A-Z])/g, function (m) { return "-" + m.toLowerCase(); });
    };
    /**
     * Each elements of the list calling forEach Array Function
     * @param list List of elements
     * @param fn {elem} Callback for each elements
     * @return void
     */
    MQuery.forEach = function (list, fn) {
        Array.prototype.forEach.call(list, fn);
    };
    /**
     * [HEAVY] Each object attributes and values
     * @param obj Object to each
     * @param fn {key, value} Callback for each elements
     * @return void
     */
    MQuery.forEachObj = function (obj, fn) {
        for (var key in obj) {
            fn(key, obj[key]);
        }
    };
    // ================== MQUERY PROPERTIES =================== //
    /**
     * Transform HTML/XML code to list of elements
     * @param code HTML/XML code
     * @return NodeList
     */
    MQuery.codeToNodeList = function (code) {
        MQuery.AUX_ELEM.innerHTML = code;
        return MQuery.AUX_ELEM.childNodes;
    };
    /**
     * Verify if element matches selector
     * @param elem element to be verified
     * @param selector querySelector
     * @return true if element matches selector, or false if not
     */
    MQuery.matches = function (elem, selector) {
        if (!MQuery.isSet(selector)) {
            return true;
        }
        if (elem.matches) {
            return elem.matches(selector);
        }
        MQuery.AUX_ELEM.innerHTML = '';
        MQuery.AUX_ELEM.appendChild(elem);
        return !!MQuery.AUX_ELEM.querySelector(selector);
    };
    /**
     * Verify if element has parent
     * @param elem elemet to be verified
     * @return true if has parent, or false if not
     */
    MQuery.hasParent = function (elem) {
        return elem.parentNode && elem.parentNode !== MQuery.AUX_ELEM;
    };
    /**
     * Generate list of elements to concat
     * @param selector MQuery | NodeList | Node | QuerySelector | HTML String
     * @return Array<Node>|MQuery
     */
    MQuery.generateNodeArray = function (selector) {
        if (!MQuery.isSet(selector)) {
            return [];
        }
        if (MQuery.typeOf(selector, 'string')) {
            try {
                return MQuery.toArray(MQuery.DOC.querySelectorAll(selector));
            }
            catch (e) {
                return MQuery.toArray(MQuery.codeToNodeList(selector));
            }
        }
        if (MQuery.typeOf(selector, 'array') || MQuery.instanceOf(selector, MQuery)) {
            return selector;
        }
        return [selector];
    };
    /**
     * Set event shorthand methods
     * @param events Array<string> Example: ['click', 'focus', 'mouseenter'] enable this shorthand methods.
     * @return void
     */
    MQuery.setEventsShorthand = function (events) {
        events.forEach(function (event) {
            MQuery.fn[event] = function (handler) {
                if (!MQuery.isSet(handler)) {
                    return this.trigger(event);
                }
                return this.on(event, handler);
            };
        });
    };
    /**
     * Export automatic mQuery instance methods to objects.
     * Ex.: MQuery.export(foo, ['click'], 'button') enables foo.click() trigger click on button tags
     * @param target object will be receive the method
     * @param fns array of functions will be exported
     * @param selector QuerySelector for mQuery instance
     * @return void
     */
    MQuery["export"] = function (target, fns, selector) {
        if (selector === void 0) { selector = []; }
        fns.forEach(function (fn) {
            target[fn] = function () {
                var mQuery = new MQuery(selector);
                mQuery[fn].apply(mQuery, arguments);
            };
        });
    };
    /**
     * Generic child insertion
     * @param rawChildren array<MQuery|Node|string> children array
     * @param nodeInsertFn function responsible to add node child
     * @param stringInsertFn function responsible to add string child
     * @return void
     */
    MQuery.setChildren = function (rawChildren, nodeInsertFn, stringInsertFn) {
        var _this = this;
        rawChildren.forEach(function (children) {
            if (MQuery.instanceOf(children, MQuery)) {
                children.each(function (i, child) {
                    if (MQuery.hasParent(child)) {
                        return stringInsertFn(child.outerHTML);
                    }
                    nodeInsertFn(child);
                });
                return;
            }
            if (MQuery.typeOf(children, 'array')) {
                return _this.setChildren(children, nodeInsertFn, stringInsertFn);
            }
            if (MQuery.typeOf(children, 'string')) {
                return stringInsertFn(children);
            }
            return nodeInsertFn(children);
        });
    };
    /**
     * Shorthand to concat all nodes quered values with space between them
     * @param fnVal function responsible to generate value
     * @return string with values concated
     */
    MQuery.prototype.eachConcat = function (fnVal) {
        var value = '';
        this.each(function (i, elem) {
            value += fnVal.apply(elem, [i, elem]) + " ";
        });
        return value.trim() || undefined;
    };
    /**
     * Return all leaf nodes (nodes without child)
     * @return MQuery instance
     */
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
    /**
     * Called after DOM content finish load
     * @param handler event listener
     * @return MQuery instance
     */
    MQuery.prototype.ready = function (handler) {
        MQuery.DOC.addEventListener('DOMContentLoaded', handler, true);
        return this;
    };
    /**
     * Each quered nodes
     * @param handler callback to iterate nodes
     * @return MQuery instance
     */
    MQuery.prototype.each = function (handler) {
        var count = 0;
        this.forEach(function (node) { handler.apply(node, [count++, node]); });
        return this;
    };
    /**
     * Attach listeners on events passed by paramenter
     * @param event events separated by space
     * @param selectOrHandler [OPTIONAL] selector to query before attach
     * @param handler event listener
     * @return MQuery instance
     */
    MQuery.prototype.on = function (event, selectOrHandler, handler) {
        if (arguments.length === 2) {
            handler = selectOrHandler;
        }
        var events = event.split(' '), elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each(function (i, elem) {
            events.forEach(function (event) { elem.addEventListener(event, handler, true); });
        });
        return this;
    };
    /**
     * Detach listeners on events passed by paramenter
     * @param event events separated by space
     * @param selectOrHandler [OPTIONAL] selector to query before detach
     * @param handler event listener
     * @return MQuery instance
     */
    MQuery.prototype.off = function (event, selectOrHandler, handler) {
        if (arguments.length === 2) {
            var handler_1 = selectOrHandler;
        }
        var events = event.split(' '), elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each(function (i, elem) {
            events.forEach(function (event) { elem.removeEventListener(event, handler, true); });
        });
        return this;
    };
    MQuery.prototype.is = function (selector) {
        var nodes = new MQuery([]);
        this.each(function (i, elem) {
            if (MQuery.matches(elem, selector)) {
                nodes.push(elem);
            }
        });
        return nodes;
    };
    /**
     * Find children elements by selector
     * @param selector query selector
     * @return MQuery instance
     */
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
    /**
     * Get parent node
     * @param selector [OPTIONAL] parent's selector
     * @return MQuery instance
     */
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
    /**
     * [EXPERIMENTAL] Load data inside quered elements
     */
    MQuery.prototype.load = function (url, complete, error) {
        var _this = this;
        var fetchURL = fetch(url).then(function (data) { return data.text(); });
        fetchURL.then(function (text) { _this.html(text); });
        MQuery.isSet(complete) && fetchURL.then(complete);
        MQuery.isSet(error) && fetchURL["catch"](error);
        return this;
    };
    /**
     * Trigger events
     * @param event event name
     * @param data data to be passed to event
     * @return MQuery instance
     */
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
    /**
     * Get/Set attribute on quered nodes
     * @param attr attribute name
     * @param value [ONLY TO SET] attribute value
     * @return MQuery instance if setting a value, or string if getting
     */
    MQuery.prototype.attr = function (attr, value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                if (MQuery.isSet(elem[attr])) {
                    return elem[attr] = value;
                }
                elem.setAttribute(attr, value);
            });
        }
        return this.eachConcat(function (i, elem) {
            if (MQuery.isSet(elem[attr])) {
                return elem[attr];
            }
            return elem.getAttribute(attr);
        });
    };
    MQuery.prototype.removeAttr = function (attr) {
        return this.each(function (i, elem) {
            elem.removeAttribute(attr);
        });
    };
    /**
     * Get/Set style on quered nodes
     * @param nameOrJSON name of the style or [ONLY TO SET] JSON with styles and values
     * @param value [ONLY TO SET] value of the style
     * @return MQuery instance if setting a value, or string if getting
     */
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
    /**
     * Get/Set inner text on quered nodes (for active HTML code, use .html())
     * @param value text to be added
     * @return MQuery instance if setting a value, or string if getting
     */
    MQuery.prototype.text = function (value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                elem.textContent = value;
            });
        }
        return this.eachConcat(function (i, elem) { return elem.textContent; });
    };
    /**
     * Get/Set inner html on quered nodes
     * @param value [ONLY TO SET] html code to be added
     * @return MQuery instance if setting a value, or string if getting
     */
    MQuery.prototype.html = function (value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                elem.innerHTML = value;
            });
        }
        return this.eachConcat(function (i, elem) { return elem.innerHTML; });
    };
    /**
     * Get/Set outer html on quered nodes
     * @param value [ONLY TO SET] html code to replace
     * @return MQuery instance if setting a value, or string if getting
     */
    MQuery.prototype.outerHtml = function (value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                elem.outerHTML = value;
            });
        }
        return this.eachConcat(function (i, elem) { return elem.outerHTML; });
    };
    MQuery.prototype.children = function (selector) {
        var nodes = new MQuery([]);
        this.each(function (i, elem) { nodes.concat(elem.childNodes); });
        return selector ? nodes.is(selector) : nodes;
    };
    MQuery.prototype.first = function () {
        return new MQuery(this.length ? this[0] : []);
    };
    MQuery.prototype.last = function () {
        return new MQuery(this.length ? this[this.length - 1] : []);
    };
    /**
     * Get all siblings
     * @param selector [OPTIONAL] filter siblings by selector
     * @return MQuery instance
     */
    MQuery.prototype.siblings = function (selector) {
        var siblings = new MQuery([]);
        this.each(function (i, elem) {
            MQuery.forEach(elem.parentNode.children, function (child) {
                if (child === elem) {
                    return false;
                }
                if (!MQuery.matches(child, selector)) {
                    return false;
                }
                siblings.push(child);
            });
        });
        return siblings;
    };
    /**
     * Get previous sibling
     * @param selector [OPTIONAL] get previous sibling matches selector
     * @return MQuery instance
     */
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
    /**
     * Get next sibling
     * @param selector [OPTIONAL] get next sibling matches selector
     * @return MQuery instance
     */
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
    /**
     * Add elements before first child
     * @param elem1... MQuery|Node|element
     * @return MQuery instance
     */
    MQuery.prototype.prepend = function () {
        var rawChildren = MQuery.toArray(arguments).reverse();
        return this.each(function (i, parent) {
            MQuery.setChildren(rawChildren, function (child) { parent.insertBefore(child, parent.firstChild); }, function (str) { parent.insertAdjacentHTML('afterbegin', str); });
        });
    };
    /**
     * Add elements after last child
     * @param elem1... MQuery|Node
     * @return MQuery instance
     */
    MQuery.prototype.append = function () {
        var rawChildren = MQuery.toArray(arguments);
        return this.each(function (i, parent) {
            MQuery.setChildren(rawChildren, function (child) { parent.appendChild(child); }, function (str) { parent.insertAdjacentHTML('beforeend', str); });
        });
    };
    /**
     * Get/Set 'data' attribute
     * @param attr attribute name
     * @param value [ONLY TO SET] attribute value
     * @return MQuery instance if setting a value, or string if getting
     */
    MQuery.prototype.data = function (attr, value) {
        if (!MQuery.isSet(value)) {
            return this.attr("data-" + attr);
        }
        return this.attr("data-" + attr, value);
    };
    /**
     * Get/Set input value
     * @param value [ONLY TO SET] input value
     * @return MQuery instance if setting a value, or string if getting
     */
    MQuery.prototype.val = function (value) {
        if (!MQuery.isSet(value)) {
            return this.attr('value');
        }
        return this.attr('value', value);
    };
    /**
     * Add class on quered nodes
     * @param className class name
     * @return MQuery instance
     */
    MQuery.prototype.addClass = function (className) {
        return this.each(function (i, elem) { elem.classList.add(className); });
    };
    /**
     * Remove class on quered nodes
     * @param className class name
     * @return MQuery instance
     */
    MQuery.prototype.removeClass = function (className) {
        return this.each(function (i, elem) { elem.classList.remove(className); });
    };
    /**
     * Return if some quered node has the class
     * @param className class name
     * @return true, if some quered node has the class, and false if not.
     */
    MQuery.prototype.hasClass = function (className) {
        return this.some(function (elem) { return elem.classList.contains(className); });
    };
    /**
     * Toggle class on quered nodes
     * @param className class name
     * @return MQuery instance
     */
    MQuery.prototype.toggleClass = function (className) {
        return this.each(function (i, elem) { elem.classList.toggle(className); });
    };
    /**
     * Remove nodes on MQuery array
     * @param selector [OPTIONAL] query selector
     */
    MQuery.prototype.remove = function (selector) {
        var nodes = new MQuery();
        this.each(function (i, elem) {
            if (MQuery.matches(elem, selector)) {
                elem.outerHTML = '';
                return;
            }
            nodes.push(elem);
        });
        return nodes;
    };
    /**
     * Remove all childs (including texts)
     */
    MQuery.prototype.empty = function () {
        return this.each(function (i, elem) { elem.innerHTML = ''; });
    };
    MQuery.prototype.width = function () {
        if (!this.length) {
            return undefined;
        }
        return this[0].clientWidth;
    };
    MQuery.prototype.height = function () {
        if (!this.length) {
            return undefined;
        }
        return this[0].clientHeight;
    };
    /**
     * CONSTANTS AND PROPERTIES
     */
    MQuery.APP_NAME = 'mQuery';
    MQuery.DOC = document;
    MQuery.AUX_ELEM = MQuery.DOC.createElement("_" + MQuery.APP_NAME + "_");
    MQuery.fn = MQuery.prototype;
    return MQuery;
}());
var m$ = function (ref) { return new MQuery(ref); }, mQuery = m$;
MQuery["export"](m$, ['ready', 'load']);
