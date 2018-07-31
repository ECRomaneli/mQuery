function m$(selector, context) {
    return new mQuery.Class(selector, context);
}
var mQuery = m$;
(function (m$) {
    var HTTP;
    (function (HTTP) {
        HTTP["GET"] = "GET";
        HTTP["HEAD"] = "HEAD";
        HTTP["POST"] = "POST";
        HTTP["PUT"] = "PUT";
        HTTP["DELETE"] = "DELETE";
        HTTP["CONNECT"] = "CONNECT";
        HTTP["OPTIONS"] = "OPTIONS";
        HTTP["TRACE"] = "TRACE";
        HTTP["PATCH"] = "PATCH";
    })(HTTP = m$.HTTP || (m$.HTTP = {}));
    // init constants
    var DOC = document;
    var WIN = window || DOC.defaultView;
    var AJAX_CONFIG = {
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        method: HTTP.GET,
        statusCode: {},
        xhr: function () { return new XMLHttpRequest(); },
        headers: {},
        timeout: 0,
        async: true
    };
    // mQuery constants
    m$.APP_NAME = 'mQuery';
    m$.AUX_ELEM = DOC.createElement("_" + m$.APP_NAME + "_");
    /**
     * mQuery Core.
     */
    var mQuery = /** @class */ (function () {
        /**
         * Constructor.
         * @param selector mQuery | NodeList | Node | Node[] | QuerySelector | HTML String
         */
        function mQuery(selector, context) {
            this.length = 0;
            // If selector is a false value with no context or is document
            var empty = isFalse(selector);
            if ((empty && !context) || typeOf(selector, ['document', 'window'])) {
                // If has selector, then add selector into mQuery list
                !empty && this.push(selector);
                // Return mQuery instance
                return this;
            }
            // If selector is function
            if (typeOf(selector, 'function')) {
                return ROOT.ready(selector);
            }
            // If selector is NOT string
            if (!typeOf(selector, 'string')) {
                return merge(this, createArr(selector));
            }
            // If is HTML, parse HTML and, if any element has been created merge
            if (isHTML(selector)) {
                var elems = parseHTML(selector);
                if (elems.length) {
                    return merge(this, elems);
                }
            }
            // If selector is not selector, find selector with querySelector
            return find(this, createContext(context), selector);
        }
        // =================== ARRAY PROPERTIES =================== //
        /**
         * Insert element without repeat.
         */
        mQuery.prototype.push = function (elem) {
            if (!isSet(elem)) {
                return this;
            }
            if (!elem[m$.APP_NAME]) {
                // Set APP_NAME property into Node
                elem[m$.APP_NAME] = { $ref: this };
            }
            else {
                // Get APP_NAME property
                var prop = elem[m$.APP_NAME];
                // Verify if elem has been inserted inside this list before (last)
                if (prop.$ref === this) {
                    return this;
                }
                // Add list reference to the element
                prop.$ref = this;
            }
            // Add element increasing length
            this[this.length++] = elem;
            // Return this
            return this;
        };
        /**
         * Concat array-like elements inside current object.
         */
        mQuery.prototype.concat = function (elems) {
            return merge(this, elems);
        };
        // ================== MQUERY PROPERTIES =================== //
        /**
         * [ONLY MQUERY] Return all leaf elements (elements without child).
         */
        mQuery.prototype.leaves = function () {
            return this.find('*').filter(function (_, elem) { return !elem.firstElementChild; });
        };
        /**
         * Specify a function to execute when the DOM is fully loaded.
         * @param handler A function to execute after the DOM is ready.
         */
        mQuery.prototype.ready = function (handler) {
            if (DOC.readyState !== 'loading') {
                handler(m$);
            }
            else {
                DOC.addEventListener('DOMContentLoaded', function () { handler(m$); });
            }
            return this;
        };
        /**
         * Iterate over a mQuery object, executing a function for each matched element.
         * @param handler A function to execute for each matched element.
         */
        mQuery.prototype.each = function (handler) {
            return each(this, handler);
        };
        mQuery.prototype.on = function (events, selector, handler) {
            var $elems = this;
            if (isSet(handler)) {
                $elems = this.find(selector);
            }
            else {
                handler = selector;
            }
            $elems.each(function (_, elem) {
                events.split(' ').forEach(function (event) {
                    elem.addEventListener(event, handler, true);
                });
            });
            return this;
        };
        mQuery.prototype.one = function (events, selector, handler) {
            var $elems = this, oneHandler;
            if (isSet(handler)) {
                $elems = this.find(selector);
            }
            else {
                handler = selector;
            }
            events.split(' ').forEach(function (event) {
                oneHandler = function () {
                    m$(this).off(event, oneHandler);
                    return handler.apply(this, arguments);
                };
                $elems.on(event, oneHandler);
            });
            return this;
        };
        mQuery.prototype.off = function (events, selector, handler) {
            var $elems = this;
            if (isSet(handler)) {
                $elems = this.find(selector);
            }
            else {
                handler = selector;
            }
            $elems.each(function (_, elem) {
                events.split(' ').forEach(function (event) { elem.removeEventListener(event, handler, true); });
            });
            return this;
        };
        mQuery.prototype.is = function (filter) {
            var isStr = typeOf(filter, 'string');
            return some(this, function (i, elem) {
                return isStr ? matches(elem, filter) : filter.call(elem, i, elem);
            });
        };
        mQuery.prototype.filter = function (filter) {
            var elems = m$(), isStr = typeOf(filter, 'string');
            this.each(function (i, elem) {
                if (isStr) {
                    if (matches(elem, filter)) {
                        elems.push(elem);
                    }
                }
                else if (filter.call(elem, i, elem)) {
                    elems.push(elem);
                }
            });
            return setContext(elems, this);
        };
        mQuery.prototype.not = function (filter) {
            return this.filter(typeOf(filter, 'string') ?
                function (_, elem) { return !matches(elem, filter); } :
                function (i, elem) { return !filter.call(elem, i, elem); });
        };
        mQuery.prototype.has = function (selector) {
            var elems = m$(), isStr = typeOf(selector, 'string');
            this.each(function (_, elem) {
                if (isStr ? elem.querySelector(selector) : elem.contains(selector)) {
                    elems.push(elem);
                }
            });
            return setContext(elems, this);
        };
        /**
         * Get the descendants of each element in the current set of matched elements, filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        mQuery.prototype.find = function (selector) {
            return find(m$(), this, selector);
        };
        /**
         * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        mQuery.prototype.parent = function (selector) {
            var parents = m$();
            this.each(function (_, elem) {
                if (!hasParent(elem)) {
                    return;
                }
                elem = elem.parentElement;
                if (!matches(elem, selector)) {
                    return;
                }
                parents.push(elem);
            });
            return setContext(parents, this);
        };
        /**
         * Get the ancestors of each element in the current set of matched elements.
         * @param selector A string containing a selector expression to match elements against.
         */
        mQuery.prototype.parents = function (selector) {
            var parents = m$(), newParents = this.parent();
            do {
                parents.concat(newParents);
                newParents = newParents.parent();
            } while (newParents.length);
            return parents.filter(selector);
        };
        /**
         * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
         */
        mQuery.prototype.end = function () {
            return this.prevObject || EMPTY;
        };
        /**
         * Execute all handlers and behaviors attached to the matched elements for the given event type.
         * @param event A string containing a JavaScript event type, such as click or submit.
         * @param params Additional parameters to pass along to the event handler.
         */
        mQuery.prototype.trigger = function (event, params) {
            return this.each(function (_, elem) {
                if (event === 'focus') {
                    elem.focus();
                    return;
                }
                var customEvent;
                if (WIN && WIN['CustomEvent']) {
                    customEvent = new CustomEvent(event, params);
                }
                else {
                    customEvent = DOC.createEvent(snakeToCamelCase(event));
                    customEvent.initCustomEvent(event, true, true, params);
                }
                elem.dispatchEvent(customEvent);
            });
        };
        mQuery.prototype.attr = function (attrs, value) {
            var _this = this;
            // attr(attrName: string, value: string | null): this;
            if (isSet(value)) {
                return this.each(function (_, elem) {
                    if (value === null) {
                        _this.removeAttr(attrs);
                    }
                    elem.setAttribute(attrs, value);
                });
            }
            // attr(attrs: PlainObject): this;
            if (!typeOf(attrs, 'string')) {
                each(attrs, function (attr, value) {
                    _this.attr(attr, value);
                });
                return this;
            }
            // attr(attrName: string): string;
            return isEmpty(this) ? void 0 : (this[0].getAttribute(attrs) || void 0);
        };
        /**
         * Remove an attribute from each element in the set of matched elements.
         * @param attrNames An attribute to remove, it can be a space-separated list of attributes.
         */
        mQuery.prototype.removeAttr = function (attrNames) {
            return this.each(function (_, elem) {
                attrNames.split(' ').forEach(function (attrName) {
                    elem.removeAttribute(attrName);
                });
            });
        };
        mQuery.prototype.prop = function (props, value) {
            var _this = this;
            // prop(propName: string, value: string): this;
            if (isSet(value)) {
                return this.each(function (_, elem) {
                    if (isSet(elem[props])) {
                        elem[props] = value;
                        return;
                    }
                    elem.setAttribute(props, value);
                });
            }
            // prop(props: PlainObject): this;
            if (!typeOf(props, 'string')) {
                each(props, function (prop, value) {
                    _this.prop(prop, value);
                });
                return this;
            }
            // prop(propName: string): any;
            if (isEmpty(this)) {
                return void 0;
            }
            if (isSet(this[0][props])) {
                return this[0][props];
            }
            return this[0].getAttribute(props) || void 0;
        };
        /**
         * Remove a property for the set of matched elements.
         * @param propNames An property to remove, it can be a space-separated list of attributes
         */
        mQuery.prototype.removeProp = function (propNames) {
            return this.each(function (_, elem) {
                propNames.split(' ').forEach(function (propName) {
                    if (isSet(elem[propName])) {
                        delete elem[propName];
                        return;
                    }
                    elem.removeAttribute(propName);
                });
            });
        };
        mQuery.prototype.css = function (styleName, value) {
            var _this = this;
            if (!typeOf(styleName, 'string')) {
                each(styleName, function (key, value) { _this.css(key, value); });
                return this;
            }
            if (isSet(value)) {
                if (typeOf(value, 'number')) {
                    value += 'px';
                }
                return this.each(function (_, elem) { elem.style[styleName] = value; });
            }
            if (isEmpty(this)) {
                return void 0;
            }
            var elem = this[0], view = elem.ownerDocument.defaultView;
            if (view && view.getComputedStyle) {
                return view.getComputedStyle(elem, void 0).getPropertyValue(styleName);
            }
            styleName = snakeToCamelCase(styleName);
            if (elem.currentStyle) {
                return elem.currentStyle[styleName];
            }
            console.warn('Returning HTMLElement.style, this may not corresponding to the current style.');
            return elem.style[styleName];
        };
        mQuery.prototype.text = function (text) {
            if (isSet(text)) {
                return this.each(function (_, elem) {
                    elem.textContent = text;
                });
            }
            var value = '';
            this.each(function (_, elem) {
                value += elem.textContent;
            });
            return value.trim() || void 0;
        };
        mQuery.prototype.html = function (htmlString) {
            if (isSet(htmlString)) {
                return this.each(function (_, elem) {
                    elem.innerHTML = htmlString;
                });
            }
            return isEmpty(this) ? void 0 : this[0].innerHTML;
        };
        /**
         * Get the children of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        mQuery.prototype.children = function (selector) {
            var elems = m$();
            this.each(function (_, elem) { elems.concat(elem.children); });
            elems.prevObject = this;
            return selector ? elems.filter(selector) : elems;
        };
        /**
         * Reduce the set of matched elements to the first in the set.
         */
        mQuery.prototype.first = function () {
            return setContext(m$(this.get(0)), this);
        };
        /**
         * Reduce the set of matched elements to the final one in the set.
         */
        mQuery.prototype.last = function () {
            return setContext(m$(this.get(-1)), this);
        };
        /**
         * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        mQuery.prototype.siblings = function (selector) {
            var siblings = m$();
            this.each(function (_, elem) {
                each(elem.parentElement.children, function (_, child) {
                    if (child === elem) {
                        return;
                    }
                    if (!matches(child, selector)) {
                        return;
                    }
                    siblings.push(child);
                });
            });
            return setContext(siblings, this);
        };
        /**
         * Get the immediately preceding sibling of each element in the set of matched elements. If a selector is provided, it retrieves the previous sibling only if it matches that selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        mQuery.prototype.prev = function (selector) {
            var prev = m$();
            this.each(function (_, elem) {
                var prevElem = elem.previousElementSibling;
                if (!matches(prevElem, selector)) {
                    return;
                }
                prev.push(prevElem);
            });
            return setContext(prev, this);
        };
        /**
         * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        mQuery.prototype.next = function (selector) {
            var next = m$();
            this.each(function (_, elem) {
                var nextElem = elem.nextElementSibling;
                if (!matches(nextElem, selector)) {
                    return;
                }
                next.push(nextElem);
            });
            return setContext(next, this);
        };
        /**
         * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
         * @param contents DOM element, text node, array of elements and text nodes, HTML string, or mQuery object to insert at the beginning of each element in the set of matched elements.
         */
        mQuery.prototype.prepend = function () {
            var contents = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                contents[_i] = arguments[_i];
            }
            var rawChildren = contents.reverse();
            return this.each(function (_, parent) {
                setChildren(rawChildren, function (child) { parent.insertBefore(child, parent.firstChild); }, function (str) { parent.insertAdjacentHTML('afterbegin', str); });
            });
        };
        mQuery.prototype.prependTo = function (selector) {
            m$(selector).prepend(this);
            return this;
        };
        /**
         * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
         * @param contents DOM element, text node, array of elements and text nodes, HTML string, or mQuery object to insert at the end of each element in the set of matched elements.
         */
        mQuery.prototype.append = function () {
            var contents = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                contents[_i] = arguments[_i];
            }
            return this.each(function (_, parent) {
                setChildren(contents, function (child) { parent.appendChild(child); }, function (str) { parent.insertAdjacentHTML('beforeend', str); });
            });
        };
        mQuery.prototype.appendTo = function (selector) {
            m$(selector).append(this);
            return this;
        };
        mQuery.prototype.data = function (keyOrObj, value) {
            var _this = this;
            if (isEmpty(this)) {
                return void 0;
            }
            // data(): any;
            if (!isSet(keyOrObj)) {
                return dataRef(this[0]);
            }
            // data(key: string | number, value: any): this;
            if (isSet(value)) {
                return this.each(function (_, elem) {
                    dataRef(elem, false)[keyOrObj] = value;
                });
            }
            // data(key: string | number): any;
            if (typeOf(keyOrObj, ['string', 'number'])) {
                return dataRef(this[0], keyOrObj);
            }
            // data(obj: Object): this;
            each(keyOrObj, function (key, value) {
                _this.data(key, value);
            });
            return this;
        };
        mQuery.prototype.val = function (value) {
            if (!isSet(value)) {
                return this.prop('value');
            }
            return this.prop('value', value);
        };
        /**
         * Adds the specified class(es) to each element in the set of matched elements.
         * @param className One or more space-separated classes to be added to the class attribute of each matched element.
         */
        mQuery.prototype.addClass = function (className) {
            return this.each(function (_, elem) {
                className.split(' ').forEach(function (name) {
                    elem.classList.add(name);
                });
            });
        };
        /**
         * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
         * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
         */
        mQuery.prototype.removeClass = function (className) {
            return this.each(function (_, elem) {
                className.split(' ').forEach(function (name) {
                    elem.classList.remove(name);
                });
            });
        };
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param className The class name to search for.
         */
        mQuery.prototype.hasClass = function (className) {
            return some(this, function (_, elem) { return elem.classList.contains(className); });
        };
        /**
         * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
         * @param className One or more class names (separated by spaces) to be toggled for each element in the matched set.
         */
        mQuery.prototype.toggleClass = function (className) {
            return this.each(function (_, elem) { elem.classList.toggle(className); });
        };
        /**
         * Remove the set of matched elements from the DOM.
         * @param selector A selector expression that filters the set of matched elements to be removed.
         */
        mQuery.prototype.remove = function (selector) {
            var elems = m$();
            this.each(function (_, elem) {
                if (!matches(elem, selector)) {
                    elems.push(elem);
                    return;
                }
                // Remove element
                if (elem.remove) {
                    elem.remove();
                }
                else if (elem['removeNode']) {
                    elem['removeNode']();
                }
                else {
                    elem.outerHTML = '';
                }
            });
            return setContext(elems, this);
        };
        /**
         * Remove all child nodes of the set of matched elements from the DOM.
         */
        mQuery.prototype.empty = function () {
            return this.each(function (_, elem) { emptyElement(elem); });
        };
        /**
         * Pass each element in the current matched set through a function, producing a new mQuery object containing the return values.
         * @param beforePush The function to process each item.
         */
        mQuery.prototype.map = function (beforePush) {
            return map(this, beforePush, setContext(m$(), this));
        };
        /**
         * Retrieve one of the elements matched. If index was not passed, return an array with all elements.
         * @param index A zero-based integer indicating which element to retrieve.
         */
        mQuery.prototype.get = function (index) {
            if (!isSet(index)) {
                return makeArray(this);
            }
            if (index < 0) {
                index = this.length + index;
            }
            return index < this.length ? this[index] : void 0;
        };
        mQuery.prototype.width = function (value) {
            if (!typeOf(value, 'function')) {
                return size(this, 'Width', value);
            }
            return this.each(function (i, elem) {
                var $elem = m$(elem);
                $elem.width(value.call(elem, i, $elem.width()));
            });
        };
        mQuery.prototype.height = function (value) {
            if (!typeOf(value, 'function')) {
                return size(this, 'Height', value);
            }
            return this.each(function (i, elem) {
                var $elem = m$(elem);
                $elem.height(value.call(elem, i, $elem.height()));
            });
        };
        /**
         * Load data from the server and place the returned HTML into the matched element.
         * @param url A string containing the URL to which the request is sent.
         * @param data A plain object or string that is sent to the server with the request.
         * @param complete A callback function that is executed when the request completes.
         */
        mQuery.prototype.load = function (url, data, complete) {
            var _this = this;
            // If instance is empty, just return
            if (isEmpty(this)) {
                return this;
            }
            // Get parameters
            if (!isSet(complete)) {
                complete = data;
                data = void 0;
            }
            // Get selector with the url (if exists)
            var matches = url.trim().match(/^([^\s]+)\s?(.*)$/), selector = matches[2];
            m$.ajax({
                url: matches[1],
                data: data,
                success: function (res) {
                    if (selector) {
                        res = m$(res).filter(selector);
                    }
                    _this.empty().append(res);
                },
                complete: function (req, s) {
                    _this.each(function (_, elem) {
                        complete.call(elem, req.responseText, s, req);
                    });
                }
            });
            return this;
        };
        /**
         * Merge the contents of an object onto the mQuery prototype to provide new mQuery instance methods.
         * @param obj An object to merge onto the jQuery prototype.
         */
        mQuery.prototype.extend = function (obj) {
            each(obj, function (key, value) { m$.fn[key] = value; });
        };
        return mQuery;
    }());
    m$.mQuery = mQuery;
    m$.Class = mQuery;
    m$.fn = mQuery.prototype;
    m$.prototype = m$.fn;
    // JUST FOR COMPATIBILITY
    m$.fn.jquery = '3.3.1';
    m$.fn.splice = Array.prototype.splice;
    /* *** ============================  Utils  ============================ *** */
    /**
     * Verify if parameter is set (comparing with undefined).
     * NOTE: [], 0 and "" will return true.
     */
    function isSet(param) {
        return param !== void 0;
    }
    /**
     * [ONLY MQUERY] Verify if parameter is false ([], false, null, undefined, empty array-like objects).
     * @param param Parameter to be verified.
     */
    function isFalse(param) {
        if (isArrayLike(param)) {
            return !param.length;
        }
        return !param || (param == false && param !== '0');
    }
    m$.isFalse = isFalse;
    /**
     * Verify if array-like object is empty
     */
    function isEmpty(arr) {
        return !arr || !arr.length;
    }
    function emptyElement(elem) {
        while (elem.lastChild) {
            elem.removeChild(elem.lastChild);
        }
    }
    function instanceOf(obj) {
        var classes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classes[_i - 1] = arguments[_i];
        }
        return some(classes, function (_, cl) { return obj instanceof cl; });
    }
    m$.instanceOf = instanceOf;
    /**
     * Verify the type of object passed and compare.
     */
    function typeOf(obj, types) {
        var matched = (typeof obj).toLowerCase(), some = function (type) {
            if (matched === 'object') {
                if (type === 'document') {
                    return obj instanceof Document;
                }
                if (type === 'element') {
                    return obj instanceof Element;
                }
                if (type === 'mquery') {
                    return obj instanceof mQuery;
                }
                if (type === 'window') {
                    return obj instanceof Window;
                }
            }
            return matched === type;
        };
        if (Array.isArray(types)) {
            return types.some(some);
        }
        return some(types);
    }
    m$.typeOf = typeOf;
    /**
     * Transform snake case string to camel case.
     */
    function snakeToCamelCase(s) {
        return (s + '').replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    }
    /**
     * Return size of first element on list.
     */
    function size(inst, dim, value) {
        if (isSet(value)) {
            if (isEmpty(inst) || !typeOf(inst[0], 'element')) {
                return inst;
            }
            return inst.css(dim.toLowerCase(), value);
        }
        if (isEmpty(inst)) {
            return void 0;
        }
        var obj = inst[0];
        if (typeOf(obj, 'document')) {
            var html = obj.documentElement, body = obj.body;
            return Math.max(html["client" + dim], html["offset" + dim], html["scroll" + dim], body["offset" + dim], body["scroll" + dim]);
        }
        if (typeOf(obj, 'window')) {
            return obj["inner" + dim];
        }
        return parseFloat(inst.css(dim.toLowerCase()));
    }
    /**
     * Each matched elements in descending order until found a positive return.
    */
    function some(arr, it) {
        for (var i = arr.length - 1; i >= 0; --i) {
            if (it(i, arr[i])) {
                return true;
            }
        }
        return false;
    }
    /**
     * Verify if element matches selector.
     */
    function matches(elem, selector) {
        if (!isSet(selector)) {
            return true;
        }
        if (elem.matches) {
            return elem.matches(selector);
        }
        emptyElement(m$.AUX_ELEM);
        m$.AUX_ELEM.appendChild(elem);
        return !!m$.AUX_ELEM.querySelector(selector);
    }
    /**
     * Verify if element has parent.
     */
    function hasParent(elem) {
        return !!elem.parentNode;
    }
    /**
     * Generate list of elements to concat.
     */
    function createArr(selector) {
        if (isArrayLike(selector)) {
            return selector;
        }
        return [selector];
    }
    function createContext(selector) {
        if (!selector) {
            return ROOT;
        }
        // If mQuery was passed, then return this mQuery
        if (selector instanceof mQuery) {
            return selector;
        }
        // Create new instance
        return m$(selector, selector.prevObject || ROOT);
    }
    /**
     * Generic child insertion.
     */
    function setChildren(children, elemInsertFn, stringInsertFn) {
        each(children, function (_, child) {
            // If arrayLike
            if (isArrayLike(child)) {
                return setChildren(child, elemInsertFn, stringInsertFn);
            }
            // If string
            if (typeOf(child, ['string', 'number'])) {
                return stringInsertFn(child);
            }
            // If node
            if (!hasParent(child)) {
                return elemInsertFn(child);
            }
            return stringInsertFn(child.outerHTML);
        });
    }
    /**
     * Get data reference into element.
     * @param elem Target.
     * @param key Key to search or false if wants return all current processed data.
     */
    function dataRef(elem, key) {
        var data = elem[m$.APP_NAME]['data'], hasAttr = elem[m$.APP_NAME]['hasAttr'];
        !data && (data = elem[m$.APP_NAME]['data'] = {});
        if (key) {
            // Get by parameters if not exists
            if (!isSet(data[key]) && isSet(elem.dataset[key])) {
                data[key] = json(elem.dataset[key], true);
            }
            // Get by data
            return data[key];
        }
        // Get all (by parameters if not exists)
        if (!hasAttr && !isSet(key)) {
            each(elem.dataset, function (key, value) {
                !data[key] && (data[key] = json(value, true));
            });
            elem[m$.APP_NAME]['hasAttr'] = true;
        }
        return data;
    }
    /**
     * [MQUERY ONLY] Verify if object is array-like.
     * @param obj Object to be verified.
     */
    function isArrayLike(obj) {
        if (Array.isArray(obj)) {
            return true;
        }
        if (!obj || typeOf(obj, ['function', 'string', 'window'])) {
            return false;
        }
        var length = obj.length;
        return typeof length === "number" && (length === 0 || (length > 0 && (length - 1) in obj));
    }
    m$.isArrayLike = isArrayLike;
    /**
     * Merge the contents of two arrays together into the first array.
     * @param first The first array-like object to merge, the elements of second added.
     * @param second The second array-like object to merge into the first, unaltered.
     */
    function merge(first, second) {
        each(second, function (_, elem) { first.push(elem); });
        return first;
    }
    m$.merge = merge;
    /**
     * Convert an array-like object into a true JavaScript array.
     * @param obj Any object to turn into a native Array.
     */
    function makeArray(obj) {
        return obj.length === 1 ? [obj[0]] : Array.apply(null, obj);
    }
    m$.makeArray = makeArray;
    /**
     * Takes a function and returns a new one that will always have a particular context.
     * @param target The function whose context will be changed.
     * @param context The object to which the context (this) of the function should be set.
     */
    function proxy(target, context) {
        return target.bind(context);
    }
    m$.proxy = proxy;
    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays.
     * @param arr The array or array-like object to iterate over.
     * @param it The function that will be executed on every value.
     */
    function each(arr, it) {
        if (isArrayLike(arr)) {
            var length_1 = arr.length;
            for (var i = 0; i < length_1; i++) {
                if (it.call(arr[i], i, arr[i]) === false) {
                    break;
                }
            }
        }
        else {
            for (var key in arr) {
                if (it.call(arr[key], key, arr[key]) === false) {
                    break;
                }
            }
        }
        return arr;
    }
    m$.each = each;
    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * @param arr The array-like object to search through.
     * @param filter The function to process each item against.
     * @param invert If true, the filter gonna return false to add element. Default false.
     * @param newArr [ONLY MQUERY] Optional: List to add elements.
     */
    function grep(arr, filter, invert, newArr) {
        if (invert === void 0) { invert = false; }
        if (newArr === void 0) { newArr = []; }
        each(arr, function (i, value) {
            if (filter(value, i) == invert) {
                return;
            }
            newArr.push(value);
        });
        return newArr;
    }
    m$.grep = grep;
    /**
     * Translate all items in an array or object to new array of items.
     * @param arr The Array or object to translate.
     * @param beforePush The function to process each item.
     * @param newArr [ONLY MQUERY] List to add elements.
     */
    function map(arr, beforePush, newArr) {
        if (newArr === void 0) { newArr = []; }
        each(arr, function (i, value) { newArr.push(beforePush.call(value, value, i)); });
        return newArr;
    }
    m$.map = map;
    /**
     * Determine the internal JavaScript [[Class]] of an object.
     * @param obj Object to get the internal JavaScript [[Class]] of.
     */
    function type(obj) {
        if (Array.isArray(obj)) {
            return 'array';
        }
        return (typeof obj).toLowerCase();
    }
    m$.type = type;
    /**
     * Check to see if an object is empty (contains no enumerable properties)
     * @param obj The object that will be checked to see if it's empty.
     */
    function isEmptyObject(obj) {
        for (var _ in obj) {
            return false;
        }
        return true;
    }
    m$.isEmptyObject = isEmptyObject;
    /**
     * Execute some JavaScript code globally.
     * @param code The JavaScript code to execute.
     */
    function globalEval(code) {
        var script = DOC.createElement('script');
        script.text = code;
        DOC.head.appendChild(script).parentNode.removeChild(script);
    }
    m$.globalEval = globalEval;
    /**
     * Transform HTML/XML code to list of elements.
     * @param htmlString HTML/XML code.
     */
    function parseHTML(htmlString) {
        m$.AUX_ELEM.innerHTML = htmlString;
        var returnArr = makeArray(m$.AUX_ELEM.childNodes);
        emptyElement(m$.AUX_ELEM);
        return returnArr;
    }
    m$.parseHTML = parseHTML;
    /**
     * [ONLY MQUERY] Transforms object into string and string into object.
     * @param objOrText Object or string.
     * @param ignoreErr If the parse thrown an error, ignore. If 'true' objOrText will be returned.
     * @param forceStringify Force transform any parameter (Object or string) to string.
     */
    function json(objOrText, ignoreErr, forceStringify) {
        try {
            if (typeOf(objOrText, 'string') && !forceStringify) {
                return JSON.parse(objOrText);
            }
            return JSON.stringify(objOrText);
        }
        catch (e) {
            if (!ignoreErr) {
                throw e;
            }
            return objOrText;
        }
    }
    m$.json = json;
    function cookie(key, value, options) {
        if (options === void 0) { options = {}; }
        // Set cookie
        if (isSet(value)) {
            var expires = '';
            // Create timeout
            if (options.timeout) {
                var date = new Date();
                date.setTime(date.getTime() + (options.timeout * 1000));
                expires = "; expires=\"" + date.toUTCString();
            }
            // Set cookie
            DOC.cookie = key + "=" + json(value, true, true) + expires + "; path=" + (options.path || '/') + ";";
            return;
        }
        // Get cookie
        // Create name
        var name = key + "=", data;
        // Split cookies by ';'
        var rawCookies = DOC.cookie.split(';');
        // Find cookie with 'name'
        each(rawCookies, function (_, cookie) {
            cookie = cookie.trim();
            if (cookie.indexOf(name) !== 0) {
                return true;
            }
            // When find name, get data and stop each
            data = cookie.substring(name.length, cookie.length);
            return false;
        });
        // Return json or string
        return json(data, true);
    }
    m$.cookie = cookie;
    /**
     * Set default values for future Ajax requests. Its use is not recommended.
     * @param options A set of key/value pairs that configure the default Ajax request. All options are optional.
     */
    function ajaxSetup(options) {
        each(options, function (key, value) { AJAX_CONFIG[key] = value; });
        return AJAX_CONFIG;
    }
    m$.ajaxSetup = ajaxSetup;
    function ajax(url, options) {
        if (options === void 0) { options = {}; }
        var dfrr = m$.Deferred(), request;
        if (typeOf(url, 'string')) {
            options.url = url;
        }
        else {
            options = url;
        }
        each(AJAX_CONFIG, function (key, value) {
            if (isSet(options[key])) {
                return;
            }
            options[key] = value;
        });
        // Create XMLHtmlRequest
        request = options.xhr();
        // Call beforeSend
        options.beforeSend && options.beforeSend(request, options);
        // Set Method
        options.method = (options.type || options.method).toUpperCase();
        var // Set context of callbacks
        context = options.context || options, 
        // Deferred => resolve
        resolve = function (data) {
            if (isSet(options.dataFilter)) {
                // TODO: If start works with dataType, change second param to dataType
                data = options.dataFilter(data, request.getResponseHeader('Content-Type'));
            }
            dfrr.resolveWith(context, json(data, true), 'success', request);
        }, 
        // Deferred => reject
        reject = function (textStatus) {
            var errorThrown = request.statusText.replace(/^[\d*\s]/g, '');
            dfrr.rejectWith(context, request, textStatus, errorThrown);
        };
        // Set ajax default callbacks (success, error and complete)
        if (isSet(options.complete)) {
            dfrr.done(function (_d, s, req) { options.complete(req, s); })
                .fail(function (req, s) { options.complete(req, s); });
        }
        dfrr.done(options.success).fail(options.error);
        // Setting URL Encoded data
        if (options.data && options.method === HTTP.GET) {
            var separator = options.url.indexOf('?') >= 0 ? '&' : '?';
            options.url += separator + param(options.data);
        }
        // Open request
        request.open(options.method, options.url, options.async, options.username, options.password);
        // Override mime type
        if (isSet(options.mimeType)) {
            request.overrideMimeType(options.mimeType);
        }
        // Set headers
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        if (isSet(options.headers)) {
            each(options.headers, function (header, value) {
                request.setRequestHeader(header, value);
            });
        }
        if (options.contentType !== false) {
            request.setRequestHeader('Content-Type', options.contentType);
        }
        if (options.async) {
            // Set timeout in ms
            request.timeout = options.timeout;
        }
        else {
            console.warn("[Deprecation] Synchronous XMLHttpRequest on the main thread " +
                "is deprecated because of its detrimental effects to the end " +
                "user's experience. For more help, check https://xhr.spec.whatwg.org/.");
        }
        // Listeners
        request.onload = function () {
            var statusFn = options.statusCode[request.status];
            statusFn && statusFn();
            if (request.status === 200) {
                resolve(request.response);
            }
            else {
                reject('error');
            }
        };
        request.onerror = function () { reject('error'); };
        request.ontimeout = function () { reject('timeout'); };
        request.onabort = function () { reject('abort'); };
        // Proccess data
        if (options.method === HTTP.POST || options.method === HTTP.PUT) {
            request.send(param(options.data));
        }
        else {
            request.send();
        }
        return dfrr.promise();
    }
    m$.ajax = ajax;
    /**
     * Transform Array-like objects into encodedURI.
     */
    function buildParam(obj, prefix, forceString) {
        var uri = [], name, isArr = typeOf(obj, 'array'), e = encodeURIComponent;
        each(obj, function (key, value) {
            // If array, dont use key
            isArr && (key = '');
            // Get name 
            name = (prefix || isArr) ? prefix + "[" + key + "]" : key;
            // If string or number, set uri
            uri.push(forceString || typeOf(value, ['string', 'number']) ?
                e(name) + "=" + e(value) :
                buildParam(value, name));
        });
        return uri.join('&');
    }
    /**
     * Build default requests
     */
    function requestBuilder(method, urlOrOptions, dataOrSuccess, success) {
        var options, data;
        if (typeOf(urlOrOptions, 'string')) {
            options = { url: urlOrOptions };
        }
        else {
            options = urlOrOptions;
        }
        if (typeOf(dataOrSuccess, 'function')) {
            success = dataOrSuccess;
        }
        else {
            data = dataOrSuccess;
        }
        options.method = method;
        options.data = data;
        options.success = success;
        return ajax(options);
    }
    /**
     * Find elements by selector in context and insert in inst.
     */
    function find(inst, context, selector) {
        try {
            context.each(function (_, elem) {
                if (!elem.querySelectorAll) {
                    return;
                }
                merge(inst, elem.querySelectorAll(selector));
            });
            return setContext(inst, context);
        }
        catch (e) {
            throw new Error("Syntax error, unrecognized expression: " + selector.trim());
        }
    }
    /**
     * Return if text is HTML code or not.
     */
    function isHTML(text) {
        return text.indexOf('<') !== -1;
    }
    /**
     * Set context (prevObject) and return inst.
     */
    function setContext(inst, context) {
        inst.prevObject = context;
        return inst;
    }
    function get(urlOrOptions, dataOrSuccess, success) {
        return requestBuilder(HTTP.GET, urlOrOptions, dataOrSuccess, success);
    }
    m$.get = get;
    function post(urlOrOptions, dataOrSuccess, success) {
        return requestBuilder(HTTP.POST, urlOrOptions, dataOrSuccess, success);
    }
    m$.post = post;
    function param(obj, tradicional) {
        if (tradicional === void 0) { tradicional = false; }
        return buildParam(obj, '', tradicional);
    }
    m$.param = param;
    /**
     * Set event shorthand methods.
     * @param events string[] Ex.: ['click', 'focus', 'mouseenter'] enable this shorthand methods.
     */
    function shorthands(events) {
        events.forEach(function (event) {
            m$.fn[event] = function (handler) {
                if (!isSet(handler)) {
                    return this.trigger(event);
                }
                return this.on(event, handler);
            };
        });
    }
    m$.shorthands = shorthands;
    /**
     * A factory function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.
     * @param beforeStart A function that is called just before the constructor returns.
     */
    function Deferred(beforeStart) {
        return new m$.Promise.Deferred(beforeStart);
    }
    m$.Deferred = Deferred;
    var EMPTY = m$();
    var ROOT = m$(DOC);
    m$.ready = ROOT.ready;
})(m$ || (m$ = {}));
(function (m$) {
    var Promise;
    (function (Promise) {
        var State;
        (function (State) {
            State["Pending"] = "pending";
            State["Resolved"] = "resolved";
            State["Rejected"] = "rejected";
        })(State = Promise.State || (Promise.State = {}));
        function returnArgs(fn) {
            // return fn;
            return function () {
                fn.apply(this, arguments);
                return arguments;
            };
        }
        function call(fns, context, args) {
            fns.forEach(function (fn) {
                args = fn.apply(context, args) || [void 0];
            });
            return args;
        }
        /**
         * Chainable utility
         */
        var Deferred = /** @class */ (function () {
            function Deferred(beforeStart) {
                this._state = State.Pending;
                this.pipeline = { done: [], fail: [] };
                beforeStart && beforeStart(this);
            }
            Deferred.prototype.changeState = function (newState, context, args) {
                if (this._state !== State.Pending) {
                    return false;
                }
                this._state = newState;
                this.pipeline.context = context;
                this.pipeline.args = args;
                return true;
            };
            Deferred.prototype.resolve = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args.unshift(this);
                return this.resolveWith.apply(this, args);
            };
            Deferred.prototype.reject = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args.unshift(this);
                return this.rejectWith.apply(this, args);
            };
            Deferred.prototype.resolveWith = function (context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (this.changeState(State.Resolved, context, args)) {
                    this.pipeline.args = call(this.pipeline.done, context, args);
                }
                return this;
            };
            Deferred.prototype.rejectWith = function (context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (this.changeState(State.Rejected, context, args)) {
                    this.pipeline.args = call(this.pipeline.fail, context, args);
                }
                return this;
            };
            Deferred.prototype.state = function () {
                return this._state;
            };
            Deferred.prototype.promise = function () {
                return this;
            };
            Deferred.prototype.done = function (callback) {
                if (!callback) {
                    return this;
                }
                if (this.state() === State.Resolved) {
                    callback.apply(this.pipeline.context, this.pipeline.args);
                }
                else {
                    this.pipeline.done.push(returnArgs(callback));
                }
                return this;
            };
            Deferred.prototype.fail = function (callback) {
                if (!callback) {
                    return this;
                }
                if (this.state() === State.Rejected) {
                    callback.apply(this.pipeline.context, this.pipeline.args);
                }
                else {
                    this.pipeline.fail.push(returnArgs(callback));
                }
                return this;
            };
            Deferred.prototype.then = function (successFilter, errorFilter) {
                var p = this.pipeline;
                if (!successFilter) {
                    return this;
                }
                if (this.state() === State.Resolved) {
                    successFilter.apply(p.context, p.args);
                }
                p.done.push(successFilter);
                if (!errorFilter) {
                    return this;
                }
                if (this.state() === State.Rejected) {
                    errorFilter.apply(p.context, p.args);
                }
                p.fail.push(errorFilter);
                return this;
            };
            Deferred.prototype.always = function (callback) {
                return this.done(callback).fail(callback);
            };
            return Deferred;
        }());
        Promise.Deferred = Deferred;
    })(Promise = m$.Promise || (m$.Promise = {}));
})(m$ || (m$ = {}));
