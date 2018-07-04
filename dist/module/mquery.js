"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function m$(selector, context) {
    return new exports.mQuery.Class(selector, context);
}
exports.m$ = m$;
exports.mQuery = m$;
(function (m$) {
    let HTTP;
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
    const DOC = document;
    const AJAX_CONFIG = {
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        method: HTTP.GET,
        statusCode: {},
        xhr: () => new XMLHttpRequest(),
        headers: {},
        timeout: 0,
        async: true
    };
    // mQuery constants
    m$.APP_NAME = 'mQuery';
    m$.AUX_ELEM = DOC.createElement(`_${m$.APP_NAME}_`);
    /**
     * mQuery Core.
     */
    class mQuery {
        /**
         * Constructor.
         * @param selector mQuery | NodeList | Node | Node[] | QuerySelector | HTML String
         */
        constructor(selector, context) {
            this.length = 0;
            // If selector is a false value with no context or is document
            if ((isFalse(selector) && !context) || selector === DOC) {
                // Remove prevObject
                delete this.prevObject;
                // If selector is DOC, then add DOC into mQuery instance
                selector === DOC && this.push(DOC);
                // Return mQuery instance
                return this;
            }
            // If selector is a function
            if (typeOf(selector, 'function')) {
                return ROOT.ready(selector);
            }
            let prev = createList(m$(), context);
            this.prevObject = prev.length ? prev : ROOT;
            createList(this, selector, this.prevObject);
        }
        // =================== ARRAY PROPERTIES =================== //
        /**
         * Insert element without repeat.
         */
        push(elem) {
            if (!elem) {
                return this;
            }
            if (!elem[m$.APP_NAME]) {
                // Set APP_NAME property into Node
                elem[m$.APP_NAME] = { $ref: this };
            }
            else {
                // Get APP_NAME property
                let prop = elem[m$.APP_NAME];
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
        }
        /**
         * Concat array-like elements inside current object.
         */
        concat(elems) {
            return merge(this, elems);
        }
        // ================== MQUERY PROPERTIES =================== //
        /**
         * [ONLY MQUERY] Return all leaf elements (elements without child).
         */
        leaves() {
            return this.find('*').filter((i, elem) => !elem.firstElementChild);
        }
        /**
         * Specify a function to execute when the DOM is fully loaded.
         * @param handler A function to execute after the DOM is ready.
         */
        ready(handler) {
            if (DOC.readyState !== 'loading') {
                handler(void 0);
            }
            else {
                DOC.addEventListener('DOMContentLoaded', handler);
            }
            return this;
        }
        /**
         * Iterate over a mQuery object, executing a function for each matched element.
         * @param handler A function to execute for each matched element.
         */
        each(handler) {
            return each(this, handler);
        }
        on(events, selector, handler) {
            let $elems = this;
            if (isSet(handler)) {
                $elems = this.find(selector);
            }
            else {
                handler = selector;
            }
            $elems.each((i, elem) => {
                events.split(' ').forEach((event) => {
                    elem.addEventListener(event, handler, true);
                });
            });
            return this;
        }
        one(events, selector, handler) {
            let $elems = this, oneHandler;
            if (isSet(handler)) {
                $elems = this.find(selector);
            }
            else {
                handler = selector;
            }
            events.split(' ').forEach((event) => {
                oneHandler = function () {
                    m$(this).off(event, oneHandler);
                    return handler.apply(this, arguments);
                };
                $elems.on(event, oneHandler);
            });
            return this;
        }
        off(events, selector, handler) {
            let $elems = this;
            if (isSet(handler)) {
                $elems = this.find(selector);
            }
            else {
                handler = selector;
            }
            $elems.each((i, elem) => {
                events.split(' ').forEach((event) => { elem.removeEventListener(event, handler, true); });
            });
            return this;
        }
        is(filter) {
            let isStr = typeOf(filter, 'string');
            return some(this, (i, elem) => isStr ? matches(elem, filter) : filter.call(elem, i, elem));
        }
        filter(filter, context) {
            let elems = m$([], context || this), isStr = typeOf(filter, 'string');
            this.each((i, elem) => {
                if (isStr) {
                    if (matches(elem, filter)) {
                        elems.push(elem);
                    }
                }
                else if (filter.call(elem, i, elem)) {
                    elems.push(elem);
                }
            });
            return elems;
        }
        not(filter) {
            return this.filter(typeOf(filter, 'string') ?
                (i, elem) => !matches(elem, filter) :
                (i, elem) => !filter.call(elem, i, elem));
        }
        has(selector) {
            let elems = m$([], this), isStr = typeOf(selector, 'string');
            this.each((i, elem) => {
                if (isStr ? elem.querySelector(selector) : elem.contains(selector)) {
                    elems.push(elem);
                }
            });
            return elems;
        }
        /**
         * Get the descendants of each element in the current set of matched elements, filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        find(selector) {
            let elems = m$([], this), nodeList;
            this.each((i, elem) => {
                elems.concat(elem.querySelectorAll(selector));
            });
            return elems;
        }
        /**
         * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        parent(selector) {
            let parents = m$([], this);
            this.each((i, elem) => {
                if (!hasParent(elem)) {
                    return;
                }
                elem = elem.parentElement;
                if (!matches(elem, selector)) {
                    return;
                }
                parents.push(elem);
            });
            return parents;
        }
        /**
         * Get the ancestors of each element in the current set of matched elements.
         * @param selector A string containing a selector expression to match elements against.
         */
        parents(selector) {
            let parents = m$(), newParents = this.parent();
            do {
                parents.concat(newParents);
                newParents = newParents.parent();
            } while (newParents.length);
            parents = parents.filter(selector, this);
            return parents;
        }
        /**
         * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
         */
        end() {
            return this.prevObject || EMPTY;
        }
        /**
         * Execute all handlers and behaviors attached to the matched elements for the given event type.
         * @param event A string containing a JavaScript event type, such as click or submit.
         * @param params Additional parameters to pass along to the event handler.
         */
        trigger(event, params) {
            return this.each((i, elem) => {
                if (event === 'focus') {
                    elem.focus();
                    return;
                }
                let customEvent;
                if (window && window['CustomEvent']) {
                    customEvent = new CustomEvent(event, params);
                }
                else {
                    customEvent = DOC.createEvent(snakeToCamelCase(event));
                    customEvent.initCustomEvent(event, true, true, params);
                }
                elem.dispatchEvent(customEvent);
            });
        }
        attr(attrs, value) {
            // attr(attrName: string, value: string | null): this;
            if (isSet(value)) {
                return this.each((i, elem) => {
                    if (value === null) {
                        this.removeAttr(attrs);
                    }
                    elem.setAttribute(attrs, value);
                });
            }
            // attr(attrs: PlainObject): this;
            if (!typeOf(attrs, 'string')) {
                each(attrs, (attr, value) => {
                    this.attr(attr, value);
                });
                return this;
            }
            // attr(attrName: string): string;
            return empty(this) ? void 0 : (this[0].getAttribute(attrs) || void 0);
        }
        /**
         * Remove an attribute from each element in the set of matched elements.
         * @param attrNames An attribute to remove, it can be a space-separated list of attributes.
         */
        removeAttr(attrNames) {
            return this.each((i, elem) => {
                attrNames.split(' ').forEach((attrName) => {
                    elem.removeAttribute(attrName);
                });
            });
        }
        prop(props, value) {
            // prop(propName: string, value: string): this;
            if (isSet(value)) {
                return this.each((i, elem) => {
                    if (isSet(elem[props])) {
                        elem[props] = value;
                        return;
                    }
                    elem.setAttribute(props, value);
                });
            }
            // prop(props: PlainObject): this;
            if (!typeOf(props, 'string')) {
                each(props, (prop, value) => {
                    this.prop(prop, value);
                });
                return this;
            }
            // prop(propName: string): any;
            if (empty(this)) {
                return void 0;
            }
            if (isSet(this[0][props])) {
                return this[0][props];
            }
            return this[0].getAttribute(props) || void 0;
        }
        /**
         * Remove a property for the set of matched elements.
         * @param propNames An property to remove, it can be a space-separated list of attributes
         */
        removeProp(propNames) {
            return this.each((i, elem) => {
                propNames.split(' ').forEach((propName) => {
                    if (isSet(elem[propName])) {
                        delete elem[propName];
                        return;
                    }
                    elem.removeAttribute(propName);
                });
            });
        }
        css(prop, value) {
            if (!typeOf(prop, 'string')) {
                each(prop, (key, value) => { this.css(key, value); });
                return this;
            }
            let name = snakeToCamelCase(prop);
            if (isSet(value)) {
                return this.each((i, elem) => {
                    elem.style[name] = value;
                });
            }
            return empty(this) ? void 0 : this[0].style[name];
        }
        text(text) {
            if (isSet(text)) {
                return this.each((i, elem) => {
                    elem.textContent = text;
                });
            }
            let value = '';
            this.each((i, elem) => {
                value += elem.textContent;
            });
            return value.trim() || void 0;
        }
        html(htmlString) {
            if (isSet(htmlString)) {
                return this.each((i, elem) => {
                    elem.innerHTML = htmlString;
                });
            }
            return empty(this) ? void 0 : this[0].innerHTML;
        }
        /**
         * Get the children of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        children(selector) {
            let elems = m$();
            this.each((i, elem) => { elems.concat(elem.children); });
            return selector ? elems.filter(selector, this) : elems;
        }
        /**
         * Reduce the set of matched elements to the first in the set.
         */
        first() {
            return m$(empty(this) ? void 0 : this[0]);
        }
        /**
         * Reduce the set of matched elements to the final one in the set.
         */
        last() {
            return m$(empty(this) ? void 0 : this[this.length - 1]);
        }
        /**
         * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        siblings(selector) {
            let siblings = m$([], this);
            this.each((i, elem) => {
                each(elem.parentElement.children, (i, child) => {
                    if (child === elem) {
                        return;
                    }
                    if (!matches(child, selector)) {
                        return;
                    }
                    siblings.push(child);
                });
            });
            return siblings;
        }
        /**
         * Get the immediately preceding sibling of each element in the set of matched elements. If a selector is provided, it retrieves the previous sibling only if it matches that selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        prev(selector) {
            let prev = m$([], this);
            this.each((i, elem) => {
                let prevElem = elem.previousElementSibling;
                if (matches(prevElem, selector)) {
                    prev.push(prevElem);
                }
                prev.push(prevElem);
            });
            return prev;
        }
        /**
         * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        next(selector) {
            let next = m$([], this);
            this.each((i, elem) => {
                let nextElem = elem.nextElementSibling;
                if (matches(nextElem, selector)) {
                    next.push(nextElem);
                }
            });
            return next;
        }
        /**
         * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
         * @param contents DOM element, text node, array of elements and text nodes, HTML string, or mQuery object to insert at the beginning of each element in the set of matched elements.
         */
        prepend(...contents) {
            let rawChildren = contents.reverse();
            return this.each((i, parent) => {
                setChildren(rawChildren, (child) => { parent.insertBefore(child, parent.firstChild); }, (str) => { parent.insertAdjacentHTML('afterbegin', str); });
            });
        }
        /**
         * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
         * @param contents DOM element, text node, array of elements and text nodes, HTML string, or mQuery object to insert at the end of each element in the set of matched elements.
         */
        append(...contents) {
            return this.each((i, parent) => {
                setChildren(contents, (child) => { parent.appendChild(child); }, (str) => { parent.insertAdjacentHTML('beforeend', str); });
            });
        }
        data(keyOrObj, value) {
            if (empty(this)) {
                return void 0;
            }
            // data(): any;
            if (!isSet(keyOrObj)) {
                return dataRef(this[0]);
            }
            // data(key: string | number, value: any): this;
            if (isSet(value)) {
                return this.each((i, elem) => {
                    dataRef(elem, false)[keyOrObj] = value;
                });
            }
            // data(key: string | number): any;
            if (typeOf(keyOrObj, 'string number')) {
                return dataRef(this[0], keyOrObj);
            }
            // data(obj: Object): this;
            each(keyOrObj, (key, value) => {
                this.data(key, value);
            });
            return this;
        }
        val(value) {
            if (!isSet(value)) {
                return this.prop('value');
            }
            return this.prop('value', value);
        }
        /**
         * Adds the specified class(es) to each element in the set of matched elements.
         * @param className One or more space-separated classes to be added to the class attribute of each matched element.
         */
        addClass(className) {
            return this.each((i, elem) => {
                className.split(' ').forEach((addClass) => {
                    elem.classList.add(addClass);
                });
            });
        }
        /**
         * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
         * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
         */
        removeClass(className) {
            return this.each((i, elem) => {
                className.split(' ').forEach((rmClass) => {
                    elem.classList.remove(rmClass);
                });
            });
        }
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param className The class name to search for.
         */
        hasClass(className) {
            return some(this, (i, elem) => elem.classList.contains(className));
        }
        /**
         * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
         * @param className One or more class names (separated by spaces) to be toggled for each element in the matched set.
         */
        toggleClass(className) {
            return this.each((i, elem) => { elem.classList.toggle(className); });
        }
        /**
         * Remove the set of matched elements from the DOM.
         * @param selector A selector expression that filters the set of matched elements to be removed.
         */
        remove(selector) {
            let elems = m$([], this);
            this.each((i, elem) => {
                if (matches(elem, selector)) {
                    if (elem.remove) {
                        elem.remove();
                    }
                    else if (elem['removeNode']) {
                        elem['removeNode']();
                    }
                    else {
                        elem.outerHTML = '';
                    }
                    return;
                }
                elems.push(elem);
            });
            return elems;
        }
        /**
         * Remove all child nodes of the set of matched elements from the DOM.
         */
        empty() {
            return this.each((i, elem) => { elem.innerHTML = ''; });
        }
        map(beforePush) {
            return map(this, beforePush);
        }
        /**
         * Return width of first element on list.
         */
        width() {
            return empty(this) ? void 0 : this[0].clientWidth;
        }
        /**
         * Return height of first element on list.
         */
        height() {
            return empty(this) ? void 0 : this[0].clientHeight;
        }
        /**
         * Merge the contents of an object onto the mQuery prototype to provide new mQuery instance methods.
         * @param obj An object to merge onto the jQuery prototype.
         */
        extend(obj) {
            each(obj, (key, value) => { m$.fn[key] = value; });
        }
    }
    m$.mQuery = mQuery;
    m$.Class = mQuery;
    m$.fn = mQuery.prototype;
    m$.prototype = m$.fn;
    m$.fn['splice'] = Array.prototype.splice;
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
    function empty(arr) {
        return !arr || !arr.length;
    }
    /**
     * Verify the type of object passed and compare.
     */
    function typeOf(obj, types) {
        return types.split(' ').some((t) => {
            if (t === 'array-like' && isArrayLike(obj)) {
                return true;
            }
            return t === type(obj);
        });
    }
    /**
     * Transform snake case string to camel case.
     */
    function snakeToCamelCase(s) {
        return (s + '').replace(/(\-\w)/g, (m) => m[1].toUpperCase());
    }
    /**
     * Each matched elements in descending order until found a positive return.
    */
    function some(arr, it) {
        for (let i = arr.length - 1; i >= 0; --i) {
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
        m$.AUX_ELEM.innerHTML = '';
        m$.AUX_ELEM.appendChild(elem);
        return !!m$.AUX_ELEM.querySelector(selector);
    }
    /**
     * Verify if element has parent.
     */
    function hasParent(elem) {
        return !!elem.parentNode && elem.parentNode !== m$.AUX_ELEM;
    }
    /**
     * Generate list of elements to concat.
     */
    function generateNodeArray(context, selector) {
        if (typeOf(selector, 'string')) {
            return makeArray(context.find(selector));
        }
        if (typeOf(selector, 'array-like')) {
            return selector;
        }
        return [selector];
    }
    /**
     * Add elements into instance passed by argument or return defaults.
     */
    function createList(inst, selector, context) {
        // If selector not is set, return new instance
        if (!isSet(selector)) {
            return inst;
        }
        // If context not is set, create a prevObject list
        if (!isSet(context)) {
            // If mQuery was passed, then return this mQuery
            if (selector instanceof mQuery) {
                return selector;
            }
            // Copy prevObject property to new instance
            inst.prevObject = selector.prevObject;
            // Else, if selector is a array-like object
        }
        else if (isArrayLike(selector)) {
            // Remove prevObject of new instance
            delete inst.prevObject;
        }
        // Try create selection with querySelector function
        try {
            merge(inst, generateNodeArray(context || ROOT, selector));
            // If querySelector thrown some error, try create element by HTML parser
        }
        catch (e) {
            delete inst.prevObject;
            merge(inst, makeArray(parseHTML(selector)));
        }
        // Return instance
        return inst;
    }
    /**
     * Generic child insertion.
     */
    function setChildren(rawChildren, elemInsertFn, stringInsertFn) {
        each(rawChildren, (i, children) => {
            // If array
            if (typeOf(children, 'array')) {
                return setChildren(children, elemInsertFn, stringInsertFn);
            }
            // If mQuery and jQuery instance
            if (typeOf(children, 'array-like')) {
                return children.each((i, child) => {
                    if (hasParent(child)) {
                        return stringInsertFn(child.outerHTML);
                    }
                    elemInsertFn(child);
                });
            }
            // If string
            if (typeOf(children, 'string number')) {
                return stringInsertFn(children);
            }
            // If node
            return elemInsertFn(children);
        });
    }
    /**
     * Get data reference into element.
     * @param elem Target.
     * @param key Key to search or false if wants return all current processed data.
     */
    function dataRef(elem, key) {
        let data = elem[m$.APP_NAME]['data'], hasAttr = elem[m$.APP_NAME]['hasAttr'];
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
            each(elem.dataset, (key, value) => {
                !data[key] && (data[key] = json(value, true));
            });
            elem[m$.APP_NAME]['hasAttr'] = true;
        }
        return data;
    }
    /**
     * Verify if object is array-like.
     * @param obj Object to be verified.
     */
    function isArrayLike(obj) {
        if (Array.isArray(obj)) {
            return true;
        }
        var length = obj && obj.length, type = (typeof obj).toLowerCase();
        if (type === 'function' || type === 'window' || type === 'string') {
            return false;
        }
        return typeof length === "number" && (length === 0 || (length > 0 && (length - 1) in obj));
    }
    m$.isArrayLike = isArrayLike;
    /**
     * Merge the contents of two arrays together into the first array.
     * @param first The first array-like object to merge, the elements of second added.
     * @param second The second array-like object to merge into the first, unaltered.
     */
    function merge(first, second) {
        if (second.forEach) {
            second.forEach((elem) => { first.push(elem); });
        }
        else if (second.each) {
            second.each((i, elem) => { first.push(elem); });
        }
        else {
            throw Error('Concat method not found');
        }
        return first;
    }
    m$.merge = merge;
    /**
     * Convert an array-like object into a true JavaScript array.
     * @param obj Any object to turn into a native Array.
     */
    function makeArray(obj) {
        return Array.prototype.slice.call(obj || []);
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
            let length = arr.length;
            for (let i = 0; i < length; i++) {
                if (it.call(arr[i], i, arr[i]) === false) {
                    break;
                }
            }
        }
        else {
            for (let key in arr) {
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
    function grep(arr, filter, invert = false, newArr = []) {
        each(arr, (i, value) => {
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
     * @param beforePush The function to process each item against.
     * @param newArr [ONLY MQUERY] Optional: List to add elements.
     */
    function map(arr, beforePush, newArr = []) {
        each(arr, (i, value) => {
            newArr.push(beforePush(value, i));
        });
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
        for (let _ in obj) {
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
        const script = DOC.createElement('script');
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
        return m$.AUX_ELEM.childNodes;
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
    function cookie(key, value, options = {}) {
        // Set cookie
        if (isSet(value)) {
            let expires = '';
            // Create timeout
            if (options.timeout) {
                let date = new Date();
                date.setTime(date.getTime() + (options.timeout * 1000));
                expires = `; expires="${date.toUTCString()}`;
            }
            // Set cookie
            DOC.cookie = `${key}=${json(value, true, true)}${expires}; path=${options.path || '/'};`;
            return;
        }
        // Get cookie
        // Create name
        let name = `${key}=`, data;
        // Split cookies by ';'
        let rawCookies = DOC.cookie.split(';');
        // Find cookie with 'name'
        each(rawCookies, (i, cookie) => {
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
    function ajax(url, settings = {}) {
        let deferred = m$.Deferred(), request;
        if (typeOf(url, 'string')) {
            settings.url = url;
        }
        else {
            settings = url;
        }
        each(AJAX_CONFIG, (key, value) => {
            if (isSet(settings[key])) {
                return;
            }
            settings[key] = value;
        });
        // Create XMLHtmlRequest
        request = settings.xhr();
        // Call beforeSend
        settings.beforeSend && settings.beforeSend(request, settings);
        // Set Method
        settings.method = (settings.type || settings.method).toUpperCase();
        let // Set context of callbacks
        context = settings.context || settings, 
        // Deferred => resolve
        resolve = (data) => {
            let status = request.statusText.replace(/^[\d*\s]/g, '');
            if (isSet(settings.dataFilter)) {
                data = settings.dataFilter(data, request.getResponseHeader('Content-Type'));
            }
            deferred.resolveWith(context, json(data, true), status, request);
        }, 
        // Deferred => reject
        reject = (textStatus, errorMessage) => {
            let errorThrown = request.statusText.replace(/^[\d*\s]/g, '');
            deferred.rejectWith(context, request, textStatus, errorThrown);
        };
        // Set ajax default callbacks (success, error and complete)
        deferred.then(settings.success, settings.error);
        if (isSet(settings.complete)) {
            deferred.done((data, status, request) => {
                settings.complete.apply(this, [request, 'success']);
            }).fail((request, textStatus) => {
                settings.complete.apply(this, [request, textStatus]);
            });
        }
        // Setting URL Encoded data
        if (settings.data && settings.method === HTTP.GET) {
            let separator = settings.url.indexOf('?') >= 0 ? '&' : '?';
            settings.url += separator + param(settings.data);
        }
        // Open request
        request.open(settings.method, settings.url, settings.async, settings.username, settings.password);
        // Override mime type
        if (isSet(settings.mimeType)) {
            request.overrideMimeType(settings.mimeType);
        }
        // Set headers
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        if (isSet(settings.headers)) {
            each(settings.headers, (header, value) => {
                request.setRequestHeader(header, value);
            });
        }
        if (settings.contentType !== false) {
            request.setRequestHeader('Content-Type', settings.contentType);
        }
        if (settings.async) {
            // Set timeout in ms
            request.timeout = settings.timeout;
        }
        else {
            console.warn("[Deprecation] Synchronous XMLHttpRequest on the main thread " +
                "is deprecated because of its detrimental effects to the end " +
                "user's experience. For more help, check https://xhr.spec.whatwg.org/.");
        }
        // Listeners
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            }
            else {
                reject(null, request.statusText);
            }
        };
        request.onerror = () => { reject('error', 'Connection error.'); };
        request.ontimeout = () => { reject('timeout', 'Request timed out.'); };
        request.onabort = () => { reject('abort', 'Request aborted.'); };
        // Proccess data
        if (settings.method === HTTP.POST || settings.method === HTTP.PUT) {
            request.send(param(settings.data));
        }
        else {
            request.send();
        }
        return deferred.promise();
    }
    m$.ajax = ajax;
    /**
     * Transform Array-like objects into encodedURI.
     */
    function buildParam(obj, prefix, forceString) {
        let uri = [], name, isArr = typeOf(obj, 'array'), e = encodeURIComponent;
        each(obj, (key, value) => {
            // If array, dont use key
            isArr && (key = '');
            // Get name 
            name = (prefix || isArr) ? `${prefix}[${key}]` : key;
            // If string or number, set uri
            uri.push(forceString || typeOf(value, 'string number') ?
                `${e(name)}=${e(value)}` :
                buildParam(value, name));
        });
        return uri.join('&');
    }
    /**
     * Build default requests
     */
    function requestBuilder(method, urlOrSettings, dataOrSuccess, success) {
        let settings, data;
        if (typeOf(urlOrSettings, 'string')) {
            settings = { url: urlOrSettings };
        }
        else {
            settings = urlOrSettings;
        }
        if (typeOf(dataOrSuccess, 'function')) {
            success = dataOrSuccess;
        }
        else {
            data = dataOrSuccess;
        }
        settings.method = method;
        settings.data = data;
        settings.success = success;
        return ajax(settings);
    }
    function get(urlOrSettings, dataOrSuccess, success) {
        return requestBuilder(HTTP.GET, urlOrSettings, dataOrSuccess, success);
    }
    m$.get = get;
    function post(urlOrSettings, dataOrSuccess, success) {
        return requestBuilder(HTTP.POST, urlOrSettings, dataOrSuccess, success);
    }
    m$.post = post;
    function param(obj, tradicional = false) {
        return buildParam(obj, '', tradicional);
    }
    m$.param = param;
    /**
     * Set event shorthand methods.
     * @param events string[] Ex.: ['click', 'focus', 'mouseenter'] enable this shorthand methods.
     */
    function shorthands(events) {
        events.forEach((event) => {
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
    const EMPTY = m$();
    const ROOT = m$(DOC);
    m$.ready = ROOT.ready;
})(m$ = exports.m$ || (exports.m$ = {}));
(function (m$) {
    var Promise;
    (function (Promise) {
        let State;
        (function (State) {
            State["Pending"] = "pending";
            State["Resolved"] = "resolved";
            State["Rejected"] = "rejected";
        })(State = Promise.State || (Promise.State = {}));
        function call(fns, context = this, args) {
            let fnReturn;
            fns.forEach((fn) => {
                fnReturn = fn.apply(context, args);
                fnReturn !== undefined && (args = fnReturn);
            });
        }
        /**
         * Chainable utility
         */
        class Deferred {
            constructor(beforeStart) {
                this._state = State.Pending;
                this.pipeline = { done: [], fail: [] };
                beforeStart && beforeStart(this);
            }
            changeState(newState, context, args) {
                if (this._state !== State.Pending) {
                    return false;
                }
                this._state = newState;
                this.pipeline.context = context;
                this.pipeline.args = args;
                return true;
            }
            resolve(...args) {
                args.unshift(this);
                return this.resolveWith.apply(this, args);
            }
            reject(...args) {
                args.unshift(this);
                return this.rejectWith.apply(this, args);
            }
            resolveWith(context, ...args) {
                if (this.changeState(State.Resolved, context, args)) {
                    call(this.pipeline.done, context, args);
                }
                return this;
            }
            rejectWith(context, ...args) {
                if (this.changeState(State.Rejected, context, args)) {
                    call(this.pipeline.fail, context, args);
                }
                return this;
            }
            state() {
                return this._state;
            }
            promise() {
                return this;
            }
            done(callback) {
                if (!callback) {
                    return this;
                }
                if (this.state() === State.Resolved) {
                    callback.apply(this.pipeline.context, this.pipeline.args);
                }
                this.pipeline.done.push(callback);
                return this;
            }
            fail(callback) {
                if (!callback) {
                    return this;
                }
                if (this.state() === State.Rejected) {
                    callback.apply(this.pipeline.context, this.pipeline.args);
                }
                this.pipeline.fail.push(callback);
                return this;
            }
            then(successFilter, errorFilter, progressFilter) {
                return this.done(successFilter).fail(errorFilter);
            }
            allways(callback) {
                return this.then(callback, callback);
            }
        }
        Promise.Deferred = Deferred;
    })(Promise = m$.Promise || (m$.Promise = {}));
})(m$ = exports.m$ || (exports.m$ = {}));
