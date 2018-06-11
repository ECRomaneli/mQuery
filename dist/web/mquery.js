/**
 * MQuery, a jQuery-like lightweight framework.
 */
var MQuery = /** @class */ (function () {
    /**
     * Default constructor.
     * @param selector MQuery | NodeList | Node | Array<Node> | QuerySelector | HTML String
     */
    function MQuery(selector) {
        this.length = 0;
        var elems;
        if (MQuery.typeOf(selector, 'function')) {
            elems = MQuery.generateNodeArray();
            this.ready(selector);
        }
        else {
            elems = MQuery.generateNodeArray(selector);
        }
        this.concat(elems);
    }
    // =================== ARRAY PROPERTIES =================== //
    /**
     * Transform object parameter to Array.
     * @param obj object must be array compatible
     * @return Array
     */
    MQuery.toArray = function (obj) {
        return [].slice.call(obj || []);
    };
    /**
     * Insert element on internal list.
     * @param elem element
     * @return MQuery instance
     */
    MQuery.prototype.push = function (elem) {
        // Verify if elem has been inserted inside this list before
        if (!elem || elem[MQuery.APP_NAME] === this) {
            return this;
        }
        this[this.length++] = elem;
        // Add list reference to the elem
        elem[MQuery.APP_NAME] = this;
        return this;
    };
    /**
     * Each listed elements on position ascendant order.
     * @param fn {elem, index, list} Callback for each elements
     * @return void
     */
    MQuery.prototype.forEach = function (fn) {
        for (var i = 0; i < this.length; ++i) {
            fn(this[i], i, this);
        }
    };
    /**
     * Each listed elements on position descendant order at found a positive return.
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
     * Concat array-like elements inside current object.
     * @param elems MQuery | Array[HTMLElement]
     * @return MQuery instance
     */
    MQuery.prototype.concat = function (elems) {
        var _this = this;
        elems.forEach(function (elem) { _this.push(elem); });
        return this;
    };
    // ====================== UTILITIES ======================= //
    /**
     * Verify if parameter is set (comparing with undefined).
     * NOTE: [], 0 and "" will return true.
     * @param param parameter to be verified
     * @return if object is setted or not
     */
    MQuery.isSet = function (param) {
        return param !== undefined;
    };
    /**
     * Verify the type of object passed and compare.
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
     * Verify if object is instance of type passed.
     * @param object object to be verified
     * @param type type of object
     * @return if object is instance of type or not
     */
    MQuery.instanceOf = function (object, type) {
        return object instanceof type;
    };
    /**
     * Get the value or, if not exists, the default value.
     * @param value value
     * @param defaultValue default value
     * @return value if exists or default value if not
     */
    MQuery.getOrDefault = function (value, defaultValue) {
        return MQuery.isSet(value) ? value : defaultValue;
    };
    /**
     * Transform snake case string to camel case.
     * @param s snake case string
     * @return camel case string
     */
    MQuery.snakeToCamelCase = function (s) {
        return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    };
    /**
     * Transform camel case string to snake case.
     * @param c camel case string
     * @return snake case string
     */
    MQuery.camelToSnakeCase = function (c) {
        return c.replace(/([A-Z])/g, function (m) { return "-" + m.toLowerCase(); });
    };
    /**
     * Each elements of the list calling forEach Array Function.
     * @param list List of elements
     * @param fn (elem, index, array) Callback for each elements
     * @return void
     */
    MQuery.forEach = function (list, fn) {
        [].forEach.call(list, fn);
    };
    /**
     * [HEAVY] Each object attributes and values.
     * @param obj Object to each
     * @param fn ForEachIterator Callback for each elements
     * @return void
     */
    MQuery.forEachObj = function (obj, fn) {
        for (var key in obj) {
            fn(key, obj[key]);
        }
    };
    // ================== MQUERY PROPERTIES =================== //
    /**
     * Transform HTML/XML code to list of elements.
     * @param code HTML/XML code
     * @return NodeList
     */
    MQuery.codeToNodeList = function (code) {
        MQuery.AUX_ELEM.innerHTML = code;
        return MQuery.AUX_ELEM.childNodes;
    };
    /**
     * Verify if element matches selector.
     * @param elem element to be verified
     * @param querySelector querySelector
     * @return true if element matches selector, or false if not
     */
    MQuery.matches = function (elem, querySelector) {
        if (!MQuery.isSet(querySelector)) {
            return true;
        }
        if (elem.matches) {
            return elem.matches(querySelector);
        }
        MQuery.AUX_ELEM.innerHTML = '';
        MQuery.AUX_ELEM.appendChild(elem);
        return !!MQuery.AUX_ELEM.querySelector(querySelector);
    };
    /**
     * Verify if element has parent.
     * @param elem element to be verified
     * @return true if has parent, or false if not
     */
    MQuery.hasParent = function (elem) {
        return !!elem.parentNode && elem.parentNode !== MQuery.AUX_ELEM;
    };
    /**
     * Generate list of elements to concat.
     * @param selector MQuery | NodeList | HTMLElement | QuerySelector | HTML String
     * @return Array<HTMLElement>|MQuery
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
     * Set event shorthand methods.
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
     * Ex.: MQuery.(foo, ['click'], 'button') enables foo.click() trigger click on button tags
     * @param target object will be receive the method
     * @param fns array of functions will be ed
     * @param selector selector for mQuery instance
     * @return void
     */
    MQuery.export = function (target, fns, selector) {
        if (selector === void 0) { selector = []; }
        fns.forEach(function (fn) {
            target[fn] = function () {
                var mQuery = new MQuery(selector);
                mQuery[fn].apply(mQuery, arguments);
            };
        });
    };
    /**
     * Generic child insertion.
     * @param rawChildren array<MQuery|HTMLElement|string> children array
     * @param elemInsertFn function responsible to add elem child
     * @param stringInsertFn function responsible to add string child
     * @return void
     */
    MQuery.setChildren = function (rawChildren, elemInsertFn, stringInsertFn) {
        var _this = this;
        rawChildren.forEach(function (children) {
            if (MQuery.instanceOf(children, MQuery)) {
                children.each(function (i, child) {
                    if (MQuery.hasParent(child)) {
                        return stringInsertFn(child.outerHTML);
                    }
                    elemInsertFn(child);
                });
                return;
            }
            if (MQuery.typeOf(children, 'array')) {
                return _this.setChildren(children, elemInsertFn, stringInsertFn);
            }
            if (MQuery.typeOf(children, 'string')) {
                return stringInsertFn(children);
            }
            return elemInsertFn(children);
        });
    };
    /**
     * Shorthand to concat all elements quered values with space between them.
     * @param fnVal function responsible to generate value
     * @return string with values concated
     */
    MQuery.prototype.eachConcat = function (fnVal) {
        var value = '';
        this.each(function (i, elem) {
            value += fnVal.apply(elem, [i, elem]) + " ";
        });
        return value.trim() || void 0;
    };
    /**
     * Return all leaf elements (elements without child).
     * @return MQuery instance
     */
    MQuery.prototype.leaves = function () {
        var leaves = new MQuery([]);
        this.each(function (i, elem) {
            if (!elem.firstChild) {
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
     * Called after DOM content finish load.
     * @param handler event listener
     * @return MQuery instance
     */
    MQuery.prototype.ready = function (handler) {
        MQuery.DOC.addEventListener('DOMContentLoaded', handler, true);
        return this;
    };
    /**
     * Each quered elements.
     * @param handler callback to iterate elements
     * @return MQuery instance
     */
    MQuery.prototype.each = function (handler) {
        var count = 0;
        this.forEach(function (elem) { handler.apply(elem, [count++, elem]); });
        return this;
    };
    /**
     * Attach listeners on events passed by paramenter.
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
     * Detach listeners on events passed by paramenter.
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
        var elems = new MQuery([]);
        this.each(function (i, elem) {
            if (MQuery.matches(elem, selector)) {
                elems.push(elem);
            }
        });
        return elems;
    };
    /**
     * Find children elements by selector.
     * @param selector query selector
     * @return MQuery instance
     */
    MQuery.prototype.find = function (selector) {
        var elems = new MQuery([]), concat;
        this.each(function (i, elem) {
            try {
                concat = elem.querySelectorAll(selector);
                elems.concat(concat);
            }
            catch (e) { }
        });
        return elems;
    };
    /**
     * Get parent element.
     * @param selector [OPTIONAL] parent's selector
     * @return MQuery instance
     */
    MQuery.prototype.parent = function (selector) {
        var parents = new MQuery([]);
        this.each(function (i, elem) {
            if (!MQuery.hasParent(elem)) {
                return false;
            }
            elem = elem.parentElement;
            if (!MQuery.matches(elem, selector)) {
                return false;
            }
            parents.push(elem);
            return true;
        });
        return parents;
    };
    /**
     * [EXPERIMENTAL] Load data inside quered elements.
     */
    // public load(url: string, complete?: any, error?: any): MQuery {
    //     let fetchURL = fetch(url).then((data) => data.text());
    //     fetchURL.then((text) => {this.html(text); });
    //     MQuery.isSet(complete) && fetchURL.then(complete);
    //     MQuery.isSet(error) && fetchURL.catch(error);
    //     return this;
    // }
    MQuery.prototype.load = function (url, data, complete) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("demo").innerHTML = this.responseText;
            }
        };
        xhttp.open("GET", "ajax_info.txt", true);
        xhttp.send();
        return this;
    };
    MQuery.prototype.ajax = function (url, config) {
        if (MQuery.instanceOf(url, Object)) {
            config = url;
            url = '';
        }
        else {
            config.url = url;
        }
        var callbacks = { done: [], fail: [] };
        MQuery.forEachObj(MQuery.AJAX_CONFIG, function (key, value) {
            if (MQuery.isSet(config[key])) {
                return;
            }
            config[key] = value;
        });
        // Create XMLHtmlRequest
        var request = config.xhr();
        // Call beforeSend
        config.beforeSend && config.beforeSend(request, config);
        // Set context of callbacks
        var context = config.context || config;
        // Set Method
        var method = config.type || config.method;
        var callSuccess = function (fn, data) {
            var status = request.statusText.replace(/^[\d*\s]/g, '');
            if (MQuery.isSet(config.dataFilter)) {
                data = config.dataFilter(data, request.getResponseHeader('Content-Type'));
            }
            MQuery.callFn(fn, context, [data, status, request]);
            MQuery.callFn(config.complete, context, [request, 'success']);
            config.complete = function () { };
        };
        var callError = function (fn, textStatus, errorMessage) {
            var errorThrown = request.statusText.replace(/^[\d*\s]/g, '');
            MQuery.callFn(fn, context, [request, textStatus, errorThrown]);
            MQuery.callFn(config.complete, context, [request, textStatus]);
            config.complete = function () { };
        };
        var done = function () {
            MQuery.callFns(callbacks.done, function (callback) {
                if (request.status === 200) {
                    callSuccess(callback, request.response);
                }
                else {
                    callError(callback, null, request.statusText);
                }
            });
        };
        var fail = function (textStatus, errorMessage) {
            MQuery.callFns(callbacks.fail, function (callback) {
                callError(textStatus, errorMessage, callback);
            });
        };
        var options = {
            done: function (callback) {
                callbacks.done.push(callback);
                return options;
            },
            fail: function (callback) {
                callbacks.fail.push(callback);
                return options;
            },
            then: function (success, error) {
                options.done(success);
                options.fail(error);
                return options;
            },
            allways: function (callback) { return options.then(callback, callback); }
        };
        // Open request
        request.open(config.method, config.url, config.async, config.username, config.password);
        // Override mime type
        if (MQuery.isSet(config.mimeType)) {
            request.overrideMimeType(config.mimeType);
        }
        // Set headers
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        if (MQuery.isSet(config.headers)) {
            MQuery.forEachObj(config.headers, function (header, value) {
                request.setRequestHeader(header, value);
            });
        }
        if (config.contentType !== false
            && (method === 'POST' || method === 'PUT')) {
            request.setRequestHeader('Content-Type', config.contentType);
        }
        // Set timeout in ms
        request.timeout = config.timeout;
        // Listeners
        options.then(config.success, config.error);
        request.onload = done;
        request.onerror = function () { fail('error', 'Connection error.'); };
        request.ontimeout = function () { fail('timeout', 'Request timed out.'); };
        request.onabort = function () { fail('abort', 'Request aborted.'); };
        // Proccess data
        var data = config.data;
        // Send data
        request.send(data);
        return options;
    };
    MQuery.callFn = function (fn, context, params) {
        if (params === void 0) { params = []; }
        if (!fn || !MQuery.typeOf(fn, 'function')) {
            return;
        }
        fn.apply(context, params);
    };
    MQuery.callFns = function (fns, call) {
        fns.forEach(function (fn) { call(fn); });
    };
    /**
     * Trigger events.
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
            if (window && window['CustomEvent']) {
                customEvent = new CustomEvent(event, data);
            }
            else {
                customEvent = document.createEvent(MQuery.snakeToCamelCase(event));
                customEvent.initCustomEvent(event, true, true, data);
            }
            elem.dispatchEvent(customEvent);
        });
    };
    MQuery.prototype.attr = function (attr, value) {
        if (MQuery.isSet(value)) {
            return this.each(function (i, elem) {
                if (MQuery.isSet(elem[attr])) {
                    elem[attr] = value;
                    return;
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
    /**
     * Return children of all elements on list.
     * @param selector [OPTIONAL] match children before return
     */
    MQuery.prototype.children = function (selector) {
        var elems = new MQuery([]);
        this.each(function (i, elem) { elems.concat(elem.childNodes); });
        return selector ? elems.is(selector) : elems;
    };
    /**
     * Return first element on list or undefined if list is empty.
     */
    MQuery.prototype.first = function () {
        return new MQuery(this.length ? this[0] : undefined);
    };
    /**
     * Return last element on list or undefined if list is empty.
     */
    MQuery.prototype.last = function () {
        return new MQuery(this.length ? this[this.length - 1] : undefined);
    };
    /**
     * Get all siblings.
     * @param selector [OPTIONAL] filter siblings by selector
     * @return MQuery instance
     */
    MQuery.prototype.siblings = function (selector) {
        var siblings = new MQuery([]);
        this.each(function (i, elem) {
            MQuery.forEach(elem.parentElement.children, function (child) {
                if (child === elem) {
                    return;
                }
                if (!MQuery.matches(child, selector)) {
                    return;
                }
                siblings.push(child);
            });
        });
        return siblings;
    };
    /**
     * Get previous sibling.
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
     * Get next sibling.
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
     * Add elements before first child.
     * @param elem1... MQuery|element
     * @return MQuery instance
     */
    MQuery.prototype.prepend = function () {
        var rawChildren = MQuery.toArray(arguments).reverse();
        return this.each(function (i, parent) {
            MQuery.setChildren(rawChildren, function (child) { parent.insertBefore(child, parent.firstChild); }, function (str) { parent.insertAdjacentHTML('afterbegin', str); });
        });
    };
    /**
     * Add elements after last child.
     * @param elem1... MQuery|Element
     * @return MQuery instance
     */
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
    /**
     * Add class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    MQuery.prototype.addClass = function (className) {
        return this.each(function (i, elem) { elem.classList.add(className); });
    };
    /**
     * Remove class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    MQuery.prototype.removeClass = function (className) {
        return this.each(function (i, elem) { elem.classList.remove(className); });
    };
    /**
     * Return if some quered element has the class.
     * @param className class name
     * @return true, if some quered element has the class, and false if not.
     */
    MQuery.prototype.hasClass = function (className) {
        return this.some(function (elem) { return elem.classList.contains(className); });
    };
    /**
     * Toggle class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    MQuery.prototype.toggleClass = function (className) {
        return this.each(function (i, elem) { elem.classList.toggle(className); });
    };
    /**
     * Remove elements on MQuery array.
     * @param selector [OPTIONAL] query selector
     */
    MQuery.prototype.remove = function (selector) {
        var elems = new MQuery();
        this.each(function (i, elem) {
            if (MQuery.matches(elem, selector)) {
                elem.outerHTML = '';
                return;
            }
            elems.push(elem);
        });
        return elems;
    };
    /**
     * Remove all childs (including texts).
     */
    MQuery.prototype.empty = function () {
        return this.each(function (i, elem) { elem.innerHTML = ''; });
    };
    /**
     * Return width of first element on list.
     */
    MQuery.prototype.width = function () {
        if (!this.length) {
            return undefined;
        }
        return this[0].clientWidth;
    };
    /**
     * Return height of first element on list.
     */
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
    MQuery.AJAX_CONFIG = {
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        method: 'GET',
        statusCode: {},
        xhr: function () { return new XMLHttpRequest(); },
        url: '',
        headers: {},
        async: true
    };
    return MQuery;
}());
/**
 * Return instance of MQuery with elements matched.
 * @param selector selector
 * @return MQuery instance
 */
var m$ = function (selector) { return new MQuery(selector); };
/**
 * Return instance of MQuery with elements matched.
 * @param selector selector
 * @return MQuery instance
 */
var mQuery = m$;
// Export global MQuery fns
MQuery.export(m$, ['ready', 'load']);
