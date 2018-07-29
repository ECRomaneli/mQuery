export declare type mQuery = m$.Class;
export declare type m$ = m$.Class;
/**
 * Binds a function to be executed when the DOM has finished loading.
 * @param onReady The function to execute when the DOM is ready.
 */
export declare function m$(onReady: Function): mQuery;
/**
 * Return a collection of matched elements.
 * @param selector A selector, DOM Element, Document, or mQuery to create instance.
 * @param context A DOM Element, Document, or mQuery to use as context.
 */
export declare function m$(selector?: mQuery | NodeList | Node | Node[] | string, context?: mQuery | NodeList | Node | Node[] | string): mQuery;
export declare const mQuery: typeof m$;
export declare namespace m$ {
    type Class = mQuery;
    type Deferred = m$.Promise.Deferred;
    type ForEachIterator<T> = (keyOrIndex: any, value: T) => boolean | void;
    type EachIterator = ForEachIterator<HTMLElement>;
    type ArrayLikeObject = PlainObject | ArrayLike<any>;
    type PlainObject = {
        [key: string]: any;
        length?: number;
    };
    type AJAXSuccess = (data?: any, textStatus?: string, XHR?: XMLHttpRequest) => void;
    type AJAXDetails = (XHR?: XMLHttpRequest, settingsOrStatus?: PlainObject | string, errorThrown?: string) => void;
    type AJAXSettings = {
        method?: string;
        beforeSend?: AJAXDetails;
        complete?: AJAXDetails;
        success?: AJAXSuccess;
        error?: AJAXDetails;
        contentType?: false | string;
        context?: Object;
        data?: PlainObject | string | any[];
        dataFilter?: (data: string, type: string) => any;
        headers?: PlainObject;
        type?: string;
        url?: string;
        mimeType?: string;
        username?: string;
        password?: string;
        async?: boolean;
        statusCode?: PlainObject;
        timeout?: number;
        xhr?: () => XMLHttpRequest;
    };
    enum HTTP {
        GET = "GET",
        HEAD = "HEAD",
        POST = "POST",
        PUT = "PUT",
        DELETE = "DELETE",
        CONNECT = "CONNECT",
        OPTIONS = "OPTIONS",
        TRACE = "TRACE",
        PATCH = "PATCH"
    }
    const APP_NAME = "mQuery";
    const AUX_ELEM: HTMLElement;
    /**
     * mQuery Core.
     */
    class mQuery implements ArrayLike<HTMLElement> {
        [index: number]: HTMLElement;
        prevObject?: mQuery;
        length: number;
        /**
         * Constructor.
         * @param selector mQuery | NodeList | Node | Node[] | QuerySelector | HTML String
         */
        constructor(selector?: any, context?: any);
        /**
         * Insert element without repeat.
         */
        private push;
        /**
         * Concat array-like elements inside current object.
         */
        private concat;
        /**
         * [ONLY MQUERY] Return all leaf elements (elements without child).
         */
        leaves(): mQuery;
        /**
         * Specify a function to execute when the DOM is fully loaded.
         * @param handler A function to execute after the DOM is ready.
         */
        ready(handler: Function): this;
        /**
         * Iterate over a mQuery object, executing a function for each matched element.
         * @param handler A function to execute for each matched element.
         */
        each(handler: EachIterator): this;
        /**
         * Attach an event handler function for one or more events to the selected elements.
         * @param events One or more space-separated event types.
         * @param selector A selector string to filter the descendants of the selected elements that trigger the event.
         * @param handler A function to execute when the event is triggered.
         */
        on(events: string, selector: string, handler: EventListener): this;
        /**
         * Attach an event handler function for one or more events to the selected elements.
         * @param events One or more space-separated event types.
         * @param handler A function to execute when the event is triggered.
         */
        on(events: string, handler: EventListener): this;
        /**
         * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
         * @param events One or more space-separated event types.
         * @param selector A selector string to filter the descendants of the selected elements that trigger the event.
         * @param handler A function to execute when the event is triggered.
         */
        one(events: string, selector: string, handler: EventListener): this;
        /**
         * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
         * @param events One or more space-separated event types.
         * @param handler A function to execute when the event is triggered.
         */
        one(events: string, handler: EventListener): this;
        /**
         * Remove an event handler.
         * @param events One or more space-separated event types.
         * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
         * @param handler A handler function previously attached for the event(s).
         */
        off(events: string, selector: string, handler: EventListener): this;
        /**
         * Remove an event handler.
         * @param events One or more space-separated event types.
         * @param handler A handler function previously attached for the event(s).
         */
        off(events: string, handler: EventListener): this;
        /**
         * Check the current matched set of elements against a selector or function.
         * @param is (i, elem) => boolean A function used as a test for every element in the set. Within the function, "this" refers to the current DOM element.
         */
        is(filter: (i: any, elem: any) => boolean): boolean;
        /**
         * Check the current matched set of elements against a selector or function.
         * @param selector A string containing a selector expression to match elements against.
         */
        is(selector: string): boolean;
        /**
         * Reduce the set of matched elements to those that match the selector or pass the function's test.
         * @param filter A function used as a test for each element in the set. 'this' is the current DOM element.
         */
        filter(filter: Function): mQuery;
        /**
         * Reduce the set of matched elements to those that match the selector or pass the function's test.
         * @param selector A string containing a selector expression to match the current set of elements against.
         */
        filter(selector: string): mQuery;
        /**
         * Remove elements from the set of matched elements.
         * @param filter A function used as a test for each element in the set.
         */
        not(filter: Function): mQuery;
        /**
         * Remove elements from the set of matched elements.
         * @param selector A string containing a selector expression to match elements against.
         */
        not(selector: string): mQuery;
        /**
         * Reduce the set of matched elements to those that have a descendant that matches the selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        has(selector: string): mQuery;
        /**
         * Reduce the set of matched elements to those that have a descendant that matches the element.
         * @param elem A DOM element child to match.
         */
        has(elem: Node): mQuery;
        /**
         * Get the descendants of each element in the current set of matched elements, filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        find(selector: string): mQuery;
        /**
         * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        parent(selector?: string): mQuery;
        /**
         * Get the ancestors of each element in the current set of matched elements.
         * @param selector A string containing a selector expression to match elements against.
         */
        parents(selector?: string): mQuery;
        /**
         * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
         */
        end(): mQuery;
        /**
         * Execute all handlers and behaviors attached to the matched elements for the given event type.
         * @param event A string containing a JavaScript event type, such as click or submit.
         * @param params Additional parameters to pass along to the event handler.
         */
        trigger(event: string, params?: PlainObject): mQuery;
        /**
         * Get the value of an attribute for the first element in the set of matched elements.
         * @param attrName The name of the attribute to get.
         */
        attr(attrName: string): string;
        /**
         * Set one or more attributes for the set of matched elements.
         * @param attrs An object of attribute-value pairs to set.
         */
        attr(attrs: PlainObject): this;
        /**
         * Set one or more attributes for the set of matched elements.
         * @param attrName The name of the attribute to set.
         * @param value A value to set for the attribute. If null, the specified attribute will be removed (as in .removeAttr()).
         */
        attr(attrName: string, value: string | null): this;
        /**
         * Remove an attribute from each element in the set of matched elements.
         * @param attrNames An attribute to remove, it can be a space-separated list of attributes.
         */
        removeAttr(attrNames: string): this;
        /**
         * Get the value of a property for the first element in the set of matched elements.
         * @param propName The name of the property to get.
         */
        prop(propName: string): any;
        /**
         * Set one or more properties for the set of matched elements.
         * @param props An object of property-value pairs to set.
         */
        prop(props: PlainObject): this;
        /**
         * Set one or more properties for the set of matched elements.
         * @param propName The name of the property to set.
         * @param value A value to set for the property.
         */
        prop(propName: string, value: string): this;
        /**
         * Remove a property for the set of matched elements.
         * @param propNames An property to remove, it can be a space-separated list of attributes
         */
        removeProp(propNames: string): this;
        /**
         * Get the computed style properties for the first element in the set of matched elements.
         * @param styleName A CSS property.
         */
        css(styleName: string): string;
        /**
         * Set one or more CSS properties for the set of matched elements.
         * @param properties An object of property-value pairs to set.
         */
        css(properties: PlainObject): this;
        /**
         * Set one or more CSS properties for the set of matched elements.
         * @param styleName A CSS property name.
         * @param value A value to set for the property.
         */
        css(styleName: string, value: string | number): this;
        /**
         * Get the combined text contents of each element in the set of matched elements, including their descendants.
         */
        text(): string;
        /**
         * Set the content of each element in the set of matched elements to the specified text.
         * @param text The text to set as the content of each matched element.
         */
        text(text: string): this;
        /**
         * Get the HTML contents of the first element in the set of matched elements.
         */
        html(): string;
        /**
         * Set the HTML contents of each element in the set of matched elements.
         * @param htmlString A string of HTML to set as the content of each matched element.
         */
        html(htmlString: string): this;
        /**
         * Get the children of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        children(selector?: string): mQuery;
        /**
         * Reduce the set of matched elements to the first in the set.
         */
        first(): mQuery;
        /**
         * Reduce the set of matched elements to the final one in the set.
         */
        last(): mQuery;
        /**
         * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        siblings(selector?: string): mQuery;
        /**
         * Get the immediately preceding sibling of each element in the set of matched elements. If a selector is provided, it retrieves the previous sibling only if it matches that selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        prev(selector?: string): mQuery;
        /**
         * Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        next(selector?: string): mQuery;
        /**
         * Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
         * @param contents DOM element, text node, array of elements and text nodes, HTML string, or mQuery object to insert at the beginning of each element in the set of matched elements.
         */
        prepend(...contents: any[]): this;
        prependTo(selector?: any): this;
        /**
         * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
         * @param contents DOM element, text node, array of elements and text nodes, HTML string, or mQuery object to insert at the end of each element in the set of matched elements.
         */
        append(...contents: any[]): this;
        appendTo(selector?: any): this;
        /**
         * Return the values store for the first element in the collection.
         * @param key A string naming the piece of data to set.
         * @param value The new data value; this can be any Javascript type except undefined.
         */
        data(): any;
        /**
         * Store arbitrary data associated with the matched elements.
         * @param obj An object of key-value pairs of data to update.
         */
        data(obj: PlainObject): this;
        /**
         * Return the value at the named data store for the first element in the collection, as set by data(name, value) or by an HTML5 data-* attribute.
         * @param key Name of the data stored.
         */
        data(key: string | number): any;
        /**
         * Store arbitrary data associated with the matched elements.
         * @param key A string naming the piece of data to set.
         * @param value The new data value; this can be any Javascript type except undefined.
         */
        data(key: string | number, value: any): this;
        /**
         * Get the current value of the first element in the set of matched elements.
         */
        val(): string;
        /**
         * Set the value of each element in the set of matched elements.
         * @param value A string of text or a number corresponding to the value of each matched element to set as selected/checked.
         */
        val(value: string): this;
        /**
         * Adds the specified class(es) to each element in the set of matched elements.
         * @param className One or more space-separated classes to be added to the class attribute of each matched element.
         */
        addClass(className: string): this;
        /**
         * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
         * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
         */
        removeClass(className: string): this;
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param className The class name to search for.
         */
        hasClass(className: string): boolean;
        /**
         * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
         * @param className One or more class names (separated by spaces) to be toggled for each element in the matched set.
         */
        toggleClass(className: string): this;
        /**
         * Remove the set of matched elements from the DOM.
         * @param selector A selector expression that filters the set of matched elements to be removed.
         */
        remove(selector?: string): mQuery;
        /**
         * Remove all child nodes of the set of matched elements from the DOM.
         */
        empty(): this;
        /**
         * Pass each element in the current matched set through a function, producing a new mQuery object containing the return values.
         * @param beforePush The function to process each item.
         */
        map(beforePush: (element: any, index: any) => any): mQuery;
        /**
         * Retrieve one of the elements matched. If index was not passed, return an array with all elements.
         * @param index A zero-based integer indicating which element to retrieve.
         */
        get(index?: number): HTMLElement[] | HTMLElement;
        width(): number;
        height(): number;
        load(url: string): this;
        load(url: string, complete: AJAXSuccess): this;
        load(url: string, data: any, complete: AJAXSuccess): this;
        /**
         * Merge the contents of an object onto the mQuery prototype to provide new mQuery instance methods.
         * @param obj An object to merge onto the jQuery prototype.
         */
        extend(obj: Object): void;
    }
    const Class: typeof mQuery;
    const fn: mQuery;
    const prototype: mQuery;
    /**
     * [ONLY MQUERY] Verify if parameter is false ([], false, null, undefined, empty array-like objects).
     * @param param Parameter to be verified.
     */
    function isFalse(param: any): boolean;
    function instanceOf(obj: any, ...classes: any[]): boolean;
    /**
     * Verify the type of object passed and compare.
     */
    function typeOf(obj: any, types: string | string[]): boolean;
    /**
     * [MQUERY ONLY] Verify if object is array-like.
     * @param obj Object to be verified.
     */
    function isArrayLike(obj: any): boolean;
    /**
     * Merge the contents of two arrays together into the first array.
     * @param first The first array-like object to merge, the elements of second added.
     * @param second The second array-like object to merge into the first, unaltered.
     */
    function merge(first: any, second: any): ArrayLike<any>;
    /**
     * Convert an array-like object into a true JavaScript array.
     * @param obj Any object to turn into a native Array.
     */
    function makeArray(obj: ArrayLike<any>): any[];
    /**
     * Takes a function and returns a new one that will always have a particular context.
     * @param target The function whose context will be changed.
     * @param context The object to which the context (this) of the function should be set.
     */
    function proxy(target: Function, context: any): Function;
    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays.
     * @param arr The array or array-like object to iterate over.
     * @param it The function that will be executed on every value.
     */
    function each(arr: ArrayLikeObject, it: ForEachIterator<any>): ArrayLikeObject;
    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * @param arr The array-like object to search through.
     * @param filter The function to process each item against.
     * @param invert If true, the filter gonna return false to add element. Default false.
     * @param newArr [ONLY MQUERY] Optional: List to add elements.
     */
    function grep(arr: ArrayLike<any>, filter: (value: any, index: any) => boolean, invert?: boolean, newArr?: any): ArrayLike<any>;
    /**
     * Translate all items in an array or object to new array of items.
     * @param arr The Array or object to translate.
     * @param beforePush The function to process each item.
     * @param newArr [ONLY MQUERY] List to add elements.
     */
    function map(arr: ArrayLikeObject, beforePush: (value: any, index: any) => any, newArr?: any): ArrayLike<any>;
    /**
     * Determine the internal JavaScript [[Class]] of an object.
     * @param obj Object to get the internal JavaScript [[Class]] of.
     */
    function type(obj: any): string;
    /**
     * Check to see if an object is empty (contains no enumerable properties)
     * @param obj The object that will be checked to see if it's empty.
     */
    function isEmptyObject(obj: any): boolean;
    /**
     * Execute some JavaScript code globally.
     * @param code The JavaScript code to execute.
     */
    function globalEval(code: string): void;
    /**
     * Transform HTML/XML code to list of elements.
     * @param htmlString HTML/XML code.
     */
    function parseHTML(htmlString: string): any[];
    /**
     * [ONLY MQUERY] Transforms object into string and string into object.
     * @param objOrText Object or string.
     * @param ignoreErr If the parse thrown an error, ignore. If 'true' objOrText will be returned.
     * @param forceStringify Force transform any parameter (Object or string) to string.
     */
    function json(objOrText: Object | string, ignoreErr: boolean, forceStringify?: boolean): Object | string;
    /**
     * [ONLY MQUERY] Get cookie by key.
     * @param key Cookie key.
     */
    function cookie(key: string): any;
    /**
     * [ONLY MQUERY] Set cookie by key.
     * @param key Cookie key.
     * @param value Cookie value.
     */
    function cookie(key: string, value: any): void;
    /**
     * [ONLY MQUERY] Set cookie by key with options.
     * @param key Cookie key.
     * @param value Cookie value.
     * @param options {timeout?, path?} Set timeout in seconds and path of your new cookie.
     */
    function cookie(key: string, value: any, options: {
        timeout?: number;
        path?: string;
    }): void;
    /**
     * Perform an asynchronous HTTP (Ajax) request.
     * @param url A string containing the URL to which the request is sent.
     */
    function ajax(url: string): Deferred;
    /**
     * @param settings AJAX options.
     */
    function ajax(settings: AJAXSettings): Deferred;
    /**
     * @param url A string containing the URL to which the request is sent.
     * @param settings AJAX options.
     */
    function ajax(url: string, settings: AJAXSettings): Deferred;
    /**
     * Load data from the server using a HTTP GET request.
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    function get(url: string, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP GET request.
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     */
    function get(url: string, data: any, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP GET request.
     * @param settings A set of key/value pairs that configure the Ajax request.
     */
    function get(settings: AJAXSettings): Deferred;
    /**
     * Load data from the server using a HTTP POST request.
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    function post(url: string, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP POST request.
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     */
    function post(url: string, data: any, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP POST request.
     * @param settings A set of key/value pairs that configure the Ajax request.
     */
    function post(settings: AJAXSettings): Deferred;
    function param(obj: ArrayLikeObject, tradicional?: boolean): string;
    /**
     * Set event shorthand methods.
     * @param events string[] Ex.: ['click', 'focus', 'mouseenter'] enable this shorthand methods.
     */
    function shorthands(events: string[]): void;
    /**
     * A factory function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.
     * @param beforeStart A function that is called just before the constructor returns.
     */
    function Deferred(beforeStart?: Function): Deferred;
    const ready: (handler: Function) => mQuery;
}
export declare namespace m$.Promise {
    enum State {
        Pending = "pending",
        Resolved = "resolved",
        Rejected = "rejected"
    }
    /**
     * Chainable utility
     */
    class Deferred {
        private _state;
        private pipeline;
        constructor(beforeStart?: Function);
        private changeState;
        resolve(...args: any[]): this;
        reject(...args: any[]): this;
        resolveWith(context: any, ...args: any[]): this;
        rejectWith(context: any, ...args: any[]): this;
        state(): string;
        promise(): Deferred;
        done(callback: (...args: any[]) => void): Deferred;
        fail(callback: (...args: any[]) => void): Deferred;
        then(successFilter: (...args: any[]) => any, errorFilter?: (...args: any[]) => any): Deferred;
        allways(callback: (...args: any[]) => void): Deferred;
    }
}
