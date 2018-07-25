// DEFINE GLOBAL TYPES
export type mQuery = m$.Class;
export type m$ = m$.Class;

/**
 * Binds a function to be executed when the DOM has finished loading.
 * @param onReady The function to execute when the DOM is ready.
 */
export function m$(onReady: Function): mQuery;
/**
 * Return a collection of matched elements.
 * @param selector A selector, DOM Element, Document, or mQuery to create instance.
 * @param context A DOM Element, Document, or mQuery to use as context.
 */
export function m$(selector?: mQuery | NodeList | Node | Node[] | string | void, context?: mQuery | NodeList | Node | Node[] | string | void): mQuery;

export function m$(selector?, context?): mQuery {
    return new mQuery.Class(selector, context);
}

export const mQuery = m$;

export namespace m$ {
    // Types
    export type Class = mQuery;
    export type Deferred = m$.Promise.Deferred;
    export type ForEachIterator<T> = (keyOrIndex: any, value: T) => boolean | void;
    export type EachIterator = ForEachIterator<HTMLElement>;
    export type ArrayLikeObject = PlainObject | ArrayLike<any>;
    export type PlainObject = {[key: string]: any, length?: number};
    export type AJAXSuccess = (data?: any, textStatus?: string, XHR?: XMLHttpRequest) => void;
    export type AJAXDetails = (XHR?: XMLHttpRequest, settingsOrStatus?: PlainObject | string, errorThrown?: string) => void;
    export type AJAXSettings = {
        method?: string,
        beforeSend?: AJAXDetails,
        complete?: AJAXDetails,
        success?: AJAXSuccess,
        error?: AJAXDetails,
        contentType?: false | string,
        context?: Object,
        data?: PlainObject | string | any[],
        dataFilter?: (data: string, type: string) => any,
        headers?: PlainObject,
        type?: string,
        url?: string,
        mimeType?: string,
        username?: string,
        password?: string,
        async?: boolean,
        //? ifModified TODO
        statusCode?: PlainObject,
        timeout?: number,
        xhr?: () => XMLHttpRequest
    };

    export enum HTTP {
        GET = 'GET',
        HEAD = 'HEAD',
        POST = 'POST',
        PUT = 'PUT',
        DELETE = 'DELETE',
        CONNECT = 'CONNECT',
        OPTIONS = 'OPTIONS',
        TRACE = 'TRACE',
        PATCH = 'PATCH'
    }

    // init constants
    const DOC = document;
    const WIN = window || DOC.defaultView;
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
    export const APP_NAME = 'mQuery';
    export const AUX_ELEM = DOC.createElement(`_${APP_NAME}_`);

    /**
     * mQuery Core.
     */
    export class mQuery implements ArrayLike<HTMLElement> {
        [index: number]: HTMLElement;
        public prevObject?: mQuery;
        public length: number = 0;

        /**
         * Constructor.
         * @param selector mQuery | NodeList | Node | Node[] | QuerySelector | HTML String
         */
        constructor(selector?, context?) {
            // If selector is a false value with no context or is document
            let empty = isFalse(selector);
            if ((empty && !context) || typeOf(selector, ['document', 'window'])) {
                // If has selector, then add selector into mQuery list
                !empty && this.push(selector);
                // Return mQuery instance
                return this;
            }

            // If selector is a function
            if (typeOf(selector, 'function')) {return ROOT.ready(selector); }

            return <mQuery>merge(this, generateNodeArray(selector, getContext(context)));
        }

        // =================== ARRAY PROPERTIES =================== //

        /**
         * Insert element without repeat.
         */
        private push(elem: Node): this {
            if (!isSet(elem)) {return this; }

            if (!elem[APP_NAME]) {

                // Set APP_NAME property into Node
                elem[APP_NAME] = {$ref: this};

            } else {

                // Get APP_NAME property
                let prop = elem[APP_NAME];

                // Verify if elem has been inserted inside this list before (last)
                if (prop.$ref === this) {return this; }

                // Add list reference to the element
                prop.$ref = this;

            }

            // Add element increasing length
            this[this.length++] = <HTMLElement>elem;

            // Return this
            return this;
        }

        /**
         * Concat array-like elements inside current object.
         */
        private concat(elems: any): this {
            return <this>merge(this, elems);
        }

        // ================== MQUERY PROPERTIES =================== //

        /**
         * [ONLY MQUERY] Return all leaf elements (elements without child).
         */
        public leaves(): mQuery {
            return this.find('*').filter((_, elem) => !elem.firstElementChild);
        }

        /**
         * Specify a function to execute when the DOM is fully loaded.
         * @param handler A function to execute after the DOM is ready.
         */
        public ready(handler: EventListener): this {
            if (DOC.readyState !== 'loading') {
                handler(void 0);
            } else {
                DOC.addEventListener('DOMContentLoaded', handler);
            }
            return this;
        }

        /**
         * Iterate over a mQuery object, executing a function for each matched element.
         * @param handler A function to execute for each matched element.
         */
        public each(handler: EachIterator): this {
            return <this>each(this, handler);
        }

        /**
         * Attach an event handler function for one or more events to the selected elements.
         * @param events One or more space-separated event types.
         * @param selector A selector string to filter the descendants of the selected elements that trigger the event.
         * @param handler A function to execute when the event is triggered.
         */
        public on(events: string, selector: string, handler: EventListener): this;
        /**
         * Attach an event handler function for one or more events to the selected elements.
         * @param events One or more space-separated event types.
         * @param handler A function to execute when the event is triggered.
         */
        public on(events: string, handler: EventListener): this;

        public on(events: string, selector: string | EventListener, handler?: EventListener): this {
            let $elems: mQuery = this;

            if (isSet(handler)) {
                $elems = this.find(<string>selector);
            } else {
                handler = <EventListener>selector;
            }

            $elems.each((_, elem) => {
                events.split(' ').forEach((event) => {
                    elem.addEventListener(event, handler, true);
                });
            });
            return this;
        }

        /**
         * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
         * @param events One or more space-separated event types.
         * @param selector A selector string to filter the descendants of the selected elements that trigger the event.
         * @param handler A function to execute when the event is triggered.
         */
        public one(events: string, selector: string, handler: EventListener): this;
        /**
         * Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
         * @param events One or more space-separated event types.
         * @param handler A function to execute when the event is triggered.
         */
        public one(events: string, handler: EventListener): this;

        public one(events: string, selector: string | EventListener, handler?: EventListener): this {
            let $elems: mQuery = this, oneHandler: EventListener;

            if (isSet(handler)) {
                $elems = this.find(<string>selector);
            } else {
                handler = <EventListener>selector;
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

        /**
         * Remove an event handler.
         * @param events One or more space-separated event types.
         * @param selector A selector which should match the one originally passed to .on() when attaching event handlers.
         * @param handler A handler function previously attached for the event(s).
         */
        public off(events: string, selector: string, handler: EventListener): this;
        /**
         * Remove an event handler.
         * @param events One or more space-separated event types.
         * @param handler A handler function previously attached for the event(s).
         */
        public off(events: string, handler: EventListener): this;

        public off(events: string, selector?: string | EventListener, handler?: EventListener): this {
            let $elems: mQuery = this;

            if (isSet(handler)) {
                $elems = this.find(<string>selector);
            } else {
                handler = <EventListener>selector;
            }

            $elems.each((_, elem) => {
                events.split(' ').forEach((event) => {elem.removeEventListener(event, handler, true)});
            });

            return this;
        }

        /**
         * Check the current matched set of elements against a selector or function.
         * @param is (i, elem) => boolean A function used as a test for every element in the set. Within the function, "this" refers to the current DOM element.
         */
        public is(filter: (i, elem) => boolean): boolean;
        /**
         * Check the current matched set of elements against a selector or function.
         * @param selector A string containing a selector expression to match elements against.
         */
        public is(selector: string): boolean;

        public is(filter: any): boolean {
            let isStr = typeOf(filter, 'string');
            return some(this, (i, elem) => 
                isStr ? matches(elem, filter) : filter.call(elem, i, elem)
            );
        }

        /**
         * Reduce the set of matched elements to those that match the selector or pass the function's test.
         * @param filter A function used as a test for each element in the set. 'this' is the current DOM element.
         */
        public filter(filter: Function, context?: mQuery): mQuery;
        /**
         * Reduce the set of matched elements to those that match the selector or pass the function's test.
         * @param selector A string containing a selector expression to match the current set of elements against.
         */
        public filter(selector: string, context?: mQuery): mQuery;

        public filter(filter, context?): mQuery {
            let elems = m$([], context || this), isStr = typeOf(filter, 'string');
            this.each((i, elem) => {
                if (isStr) {
                    if (matches(elem, filter)) {
                        elems.push(elem);
                    }
                } else if (filter.call(elem, i, elem)) {
                    elems.push(elem);
                }
            });
            return elems;
        }

        /**
         * Remove elements from the set of matched elements.
         * @param filter A function used as a test for each element in the set.
         */
        public not(filter: Function): mQuery;
        /**
         * Remove elements from the set of matched elements.
         * @param selector A string containing a selector expression to match elements against.
         */
        public not(selector: string): mQuery;

        public not(filter): mQuery {
            return this.filter(typeOf(filter, 'string') ? 
                (_, elem) => !matches(elem, filter) : 
                (i, elem) => !filter.call(elem, i, elem)
            );
        }

        /**
         * Reduce the set of matched elements to those that have a descendant that matches the selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        public has(selector: string): mQuery;
        /**
         * Reduce the set of matched elements to those that have a descendant that matches the element.
         * @param elem A DOM element child to match.
         */
        public has(elem: Node): mQuery;

        public has(selector): mQuery {
            let elems = m$(void 0, this), isStr = typeOf(selector, 'string');

            this.each((_, elem) => {
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
        public find(selector: string): mQuery {
            let elems = m$(void 0, this);

            try {
                this.each((_, elem) => {
                    if (!elem.querySelectorAll) {return; }
                    elems.concat(elem.querySelectorAll(selector));
                });
            } catch (e) {
                throw new Error(`Syntax error, unrecognized expression: ${selector.trim()}`);
            }

            return elems;
        }

        /**
         * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        public parent(selector?: string): mQuery {
            let parents = m$(void 0, this);

            this.each((_, elem) => {
                if (!hasParent(elem)) {return; }
                elem = elem.parentElement;

                if (!matches(elem, selector)) {return; }

                parents.push(elem);
            });

            return parents;
        }

        /**
         * Get the ancestors of each element in the current set of matched elements.
         * @param selector A string containing a selector expression to match elements against.
         */
        public parents(selector?: string): mQuery {
            let parents = m$(void 0), newParents = this.parent();

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
        public end(): mQuery {
            return this.prevObject || EMPTY;
        }

        /**
         * Execute all handlers and behaviors attached to the matched elements for the given event type.
         * @param event A string containing a JavaScript event type, such as click or submit.
         * @param params Additional parameters to pass along to the event handler.
         */
        public trigger(event: string, params?: PlainObject): mQuery {
            return this.each((_, elem) => {
                if (event === 'focus') {
                    elem.focus();
                    return;
                }
                let customEvent;
                if (WIN && WIN['CustomEvent']) {
                    customEvent = new CustomEvent(event, <Object>params);
                } else {
                    customEvent = DOC.createEvent(snakeToCamelCase(event));
                    customEvent.initCustomEvent(event, true, true, params);
                }
                elem.dispatchEvent(customEvent);
            });
        }

        /**
         * Get the value of an attribute for the first element in the set of matched elements.
         * @param attrName The name of the attribute to get.
         */
        public attr(attrName: string): string | void;
        /**
         * Set one or more attributes for the set of matched elements.
         * @param attrs An object of attribute-value pairs to set.
         */
        public attr(attrs: PlainObject): this;
        /**
         * Set one or more attributes for the set of matched elements.
         * @param attrName The name of the attribute to set.
         * @param value A value to set for the attribute. If null, the specified attribute will be removed (as in .removeAttr()).
         */
        public attr(attrName: string, value: string | null): this;

        public attr(attrs: PlainObject | string, value?: string | null): this | string | void {
            // attr(attrName: string, value: string | null): this;
            if (isSet(value)) {
                return this.each((_, elem) => {
                    if (value === null) { this.removeAttr(<string>attrs); }
                    elem.setAttribute(<string>attrs, value);
                });
            }

            // attr(attrs: PlainObject): this;
            if (!typeOf(attrs, 'string')) {
                each(<PlainObject>attrs, (attr, value) => {
                    this.attr(attr, value);
                });
                return this;
            }

            // attr(attrName: string): string;
            return isEmpty(this) ? void 0 : (this[0].getAttribute(<string>attrs) || void 0);
        }

        /**
         * Remove an attribute from each element in the set of matched elements.
         * @param attrNames An attribute to remove, it can be a space-separated list of attributes. 
         */
        public removeAttr(attrNames: string): this {
            return this.each((_, elem) => {
                attrNames.split(' ').forEach((attrName) => {
                    elem.removeAttribute(attrName);
                });
            });
        }

        /**
         * Get the value of a property for the first element in the set of matched elements.
         * @param propName The name of the property to get.
         */
        public prop(propName: string): any;
        /**
         * Set one or more properties for the set of matched elements.
         * @param props An object of property-value pairs to set.
         */
        public prop(props: PlainObject): this;
        /**
         * Set one or more properties for the set of matched elements.
         * @param propName The name of the property to set.
         * @param value A value to set for the property.
         */
        public prop(propName: string, value: string): this;

        public prop(props, value?: string) {
            // prop(propName: string, value: string): this;
            if (isSet(value)) {
                return this.each((_, elem) => {
                    if (isSet(elem[props])) {
                        elem[props] = value;
                        return;
                    }
                    elem.setAttribute(props, value);
                });
            }

            // prop(props: PlainObject): this;
            if (!typeOf(props, 'string')) {
                each(<PlainObject>props, (prop, value) => {
                    this.prop(prop, value);
                });
                return this;
            }

            // prop(propName: string): any;
            if (isEmpty(this)) {return void 0; }
            if (isSet(this[0][props])) {
                return this[0][props];
            }
            return this[0].getAttribute(props) || void 0;
        }

        /**
         * Remove a property for the set of matched elements.
         * @param propNames An property to remove, it can be a space-separated list of attributes
         */
        public removeProp(propNames: string): this {
            return this.each((_, elem) => {
                propNames.split(' ').forEach((propName) => {
                    if (isSet(elem[propName])) {
                        delete elem[propName];
                        return;
                    }
                    elem.removeAttribute(propName);
                });
            });
        }

        /**
         * Get the computed style properties for the first element in the set of matched elements.
         * @param styleName A CSS property.
         */
        public css(styleName: string): string;
        /**
         * Set one or more CSS properties for the set of matched elements.
         * @param properties An object of property-value pairs to set.
         */
        public css(properties: PlainObject): this;
        /**
         * Set one or more CSS properties for the set of matched elements.
         * @param styleName A CSS property name.
         * @param value A value to set for the property.
         */
        public css(styleName: string, value: string | number): this;

        public css(styleName, value?): this | string {
            if (!typeOf(styleName, 'string')) {
                each(styleName, (key, value) => {this.css(key, value)});
                return this;
            }

            if (isSet(value)) {
                if (typeOf(value, 'number')) {value += 'px'; }
                return this.each((_, elem) => {elem.style[styleName] = value});
            }

            if (isEmpty(this)) {return void 0; }

            let elem: any = this[0],
                view = elem.ownerDocument.defaultView;

            if (view && view.getComputedStyle) {
                return view.getComputedStyle(elem, void 0).getPropertyValue(styleName);
            }

            styleName = snakeToCamelCase(styleName);

            if (elem.currentStyle) {
                return elem.currentStyle[styleName];
            }

            console.warn('Returning HTMLElement.style, this may not corresponding to the current style.');
            return elem.style[styleName];
        }

        /**
         * Get the combined text contents of each element in the set of matched elements, including their descendants.
         */
        public text(): string;
        /**
         * Set the content of each element in the set of matched elements to the specified text.
         * @param text The text to set as the content of each matched element.
         */
        public text(text: string): this;

        public text(text?: string): this | string {
            if (isSet(text)) {
                return this.each((_, elem) => {
                    elem.textContent = text;
                });
            }
            let value = '';
            this.each((_, elem) => {
                value += elem.textContent;
            });
            return value.trim() || void 0;
        }

        /**
         * Get the HTML contents of the first element in the set of matched elements.
         */
        public html(): string;
        /**
         * Set the HTML contents of each element in the set of matched elements.
         * @param htmlString A string of HTML to set as the content of each matched element.
         */
        public html(htmlString: string): this;

        public html(htmlString?: string): this | string {
            if (isSet(htmlString)) {
                return this.each((_, elem) => {
                    elem.innerHTML = htmlString;
                });
            }
            return isEmpty(this) ? void 0 : this[0].innerHTML;
        }

        /**
         * Get the children of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        public children(selector?: string): mQuery {
            let elems = m$();
            this.each((_, elem) => {elems.concat(elem.children)});
            return selector ? elems.filter(selector, this) : elems;
        }

        /**
         * Reduce the set of matched elements to the first in the set.
         */
        public first(): mQuery {
            return m$(this.get(0));
        }

        /**
         * Reduce the set of matched elements to the final one in the set.
         */
        public last(): mQuery {
            return m$(this.get(-1));
        }

        /**
         * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        public siblings(selector?: string): mQuery {
            let siblings = m$([], this);
            this.each((_, elem) => {
                each(elem.parentElement.children, (_, child) => {
                    if (child === elem) { return; }
                    if (!matches(child, selector)) { return; }
                    siblings.push(child);
                });
            });
            return siblings;
        }

        /**
         * Get the immediately preceding sibling of each element in the set of matched elements. If a selector is provided, it retrieves the previous sibling only if it matches that selector.
         * @param selector A string containing a selector expression to match elements against.
         */
        public prev(selector?: string): mQuery {
            let prev = m$([], this);
            this.each((_, elem) => {
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
        public next(selector?: string): mQuery {
            let next = m$([], this);
            this.each((_, elem) => {
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
        public prepend(...contents): this {
            let rawChildren = contents.reverse();
            return this.each((_, parent) => {
                setChildren(rawChildren,
                    (child) => {parent.insertBefore(child, parent.firstChild)},
                    (str) => {parent.insertAdjacentHTML('afterbegin', str)});
            });
        }

        public prependTo(selector?): this {
            m$(selector).prepend(this);
            return this;
        }

        /**
         * Insert content, specified by the parameter, to the end of each element in the set of matched elements.
         * @param contents DOM element, text node, array of elements and text nodes, HTML string, or mQuery object to insert at the end of each element in the set of matched elements.
         */
        public append(...contents): this {
            return this.each((_, parent) => {
                setChildren(contents,
                    (child) => {parent.appendChild(child)},
                    (str) => {parent.insertAdjacentHTML('beforeend', str)});
            });
        }

        public appendTo(selector?): this {
            m$(selector).append(this);
            return this;
        }

        /**
         * Return the values store for the first element in the collection.
         * @param key A string naming the piece of data to set.
         * @param value The new data value; this can be any Javascript type except undefined.
         */
        public data(): any;
        /**
         * Store arbitrary data associated with the matched elements.
         * @param obj An object of key-value pairs of data to update.
         */
        public data(obj: PlainObject): this;
        /**
         * Return the value at the named data store for the first element in the collection, as set by data(name, value) or by an HTML5 data-* attribute.
         * @param key Name of the data stored.
         */
        public data(key: string | number): any;
        /**
         * Store arbitrary data associated with the matched elements.
         * @param key A string naming the piece of data to set.
         * @param value The new data value; this can be any Javascript type except undefined.
         */
        public data(key: string | number, value: any): this;

        public data(keyOrObj?: any, value?: any): this | any {
            if (isEmpty(this)) {return void 0; }

            // data(): any;
            if (!isSet(keyOrObj)) {
                return dataRef(this[0]);
            }

            // data(key: string | number, value: any): this;
            if (isSet(value)) {
                return this.each((_, elem) => {
                    dataRef(elem, false)[keyOrObj] = value;
                });
            }

            // data(key: string | number): any;
            if (typeOf(keyOrObj, ['string', 'number'])) {
                return dataRef(this[0], keyOrObj);
            }
            
            // data(obj: Object): this;
            each(keyOrObj, (key, value) => {
                this.data(key, value);
            });

            return this;
        }

        /**
         * Get the current value of the first element in the set of matched elements.
         */
        public val(): string;
        /**
         * Set the value of each element in the set of matched elements.
         * @param value A string of text or a number corresponding to the value of each matched element to set as selected/checked.
         */
        public val(value: string): this;

        public val(value?: string): this | string {
            if (!isSet(value)) {
                return this.prop('value');
            }
            return this.prop('value', value);
        }

        /**
         * Adds the specified class(es) to each element in the set of matched elements.
         * @param className One or more space-separated classes to be added to the class attribute of each matched element.
         */
        public addClass(className: string): this {
            return this.each((_, elem) => {
                className.split(' ').forEach((addClass) => {
                    elem.classList.add(addClass);
                });
            });
        }

        /**
         * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
         * @param className One or more space-separated classes to be removed from the class attribute of each matched element.
         */
        public removeClass(className: string): this {
            return this.each((_, elem) => {
                className.split(' ').forEach((rmClass) => {
                    elem.classList.remove(rmClass);
                });
            });
        }

        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param className The class name to search for.
         */
        public hasClass(className: string): boolean {
            return some(this, (_, elem) => elem.classList.contains(className));
        }

        /**
         * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
         * @param className One or more class names (separated by spaces) to be toggled for each element in the matched set.
         */
        public toggleClass(className: string): this {
            return this.each((_, elem) => { elem.classList.toggle(className) });
        }

        /**
         * Remove the set of matched elements from the DOM.
         * @param selector A selector expression that filters the set of matched elements to be removed.
         */
        public remove(selector?: string): mQuery {
            let elems = m$([], this);
            this.each((_, elem) => {
                if (matches(elem, selector)) {
                    if (elem.remove) {
                        elem.remove();
                    } else if (elem['removeNode']) {
                        elem['removeNode']();
                    } else {
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
        public empty(): this {
            return this.each((_, elem) => {emptyElement(elem)});
        }

        /**
         * Pass each element in the current matched set through a function, producing a new mQuery object containing the return values.
         * @param beforePush The function to process each item.
         */
        public map(beforePush: (element, index) => any): mQuery {
            return <mQuery>map(this, beforePush, m$(void 0, this));
        }

        /**
         * Retrieve one of the elements matched. If index was not passed, return an array with all elements.
         * @param index A zero-based integer indicating which element to retrieve.
         */
        public get(index?: number): HTMLElement[] | HTMLElement | void {
            if (!isSet(index)) {return makeArray(this); }
            if (index < 0) {index = this.length + index; }
            return index >= 0 && index < this.length ? this[index] : void 0;
        }

        public width(value?): mQuery | number {
            return size(this, 'Width', value);
        }

        public height(value?): mQuery | number {
            return size(this, 'Height', value);
        }

        /**
         * Merge the contents of an object onto the mQuery prototype to provide new mQuery instance methods.
         * @param obj An object to merge onto the jQuery prototype.
         */
        public extend(obj: Object): void {
            each(obj, (key, value) => {fn[key] = value});
        }
    }

    
    export const Class = mQuery;
    export const fn = mQuery.prototype;
    export const prototype = fn;

    (<any>fn).splice = Array.prototype.splice;

    /* *** ============================  Utils  ============================ *** */

    /**
     * Verify if parameter is set (comparing with undefined).
     * NOTE: [], 0 and "" will return true.
     */
    function isSet(param: any): boolean {
        return param !== void 0;
    }

    /**
     * [ONLY MQUERY] Verify if parameter is false ([], false, null, undefined, empty array-like objects).
     * @param param Parameter to be verified.
     */
    export function isFalse(param: any): boolean {
        if (isArrayLike(param)) {return !param.length; }
        return !param || (param == false && param !== '0');
    }

    /**
     * Verify if array-like object is empty
     */
    function isEmpty(arr: ArrayLike<any>): boolean {
        return !arr || !arr.length;
    }

    function emptyElement(elem: Node): void {
        while (elem.lastChild) {elem.removeChild(elem.lastChild)}
    }

    export function instanceOf(obj: any, ...classes): boolean {
        return some(classes, (_, cl) => obj instanceof cl);
    }

    /**
     * Verify the type of object passed and compare.
     */
    export function typeOf(obj: any, types: string | string[]): boolean {
        let matched = (typeof obj).toLowerCase(),
            some = (type) => {
                if (matched === 'object') {
                    if (type === 'document')    {return obj instanceof Document; }
                    if (type === 'element')     {return obj instanceof Element; }
                    if (type === 'mquery')      {return obj instanceof mQuery; }
                    if (type === 'window')      {return obj instanceof Window; }
                }
                return matched === type;
            };

        if (Array.isArray(types)) {return types.some(some); }
        return some(types);
    }

    /**
     * Transform snake case string to camel case.
     */
    function snakeToCamelCase(s: string | number): string {
        return (s+'').replace(/(\-\w)/g, (m) => m[1].toUpperCase());
    }

    /**
     * Return size of first element on list.
     */
    function size(inst: mQuery, dim: string, value?): mQuery | number {
        if (isSet(value)) {
            if (isEmpty(inst) || !typeOf(inst[0], 'element')) {return inst; }
            return inst.css(dim.toLowerCase(), value);
        }

        if (isEmpty(inst)) {return void 0; }

        const obj: any = inst[0];
        if (typeOf(obj, 'document')) {
            const   html = obj.documentElement,
                    body = obj.body;
            return Math.max(
                html[`client${dim}`],
                html[`offset${dim}`],
                html[`scroll${dim}`],
                body[`offset${dim}`],
                body[`scroll${dim}`]
            );
        }

        if (typeOf(obj, 'window')) {
            return obj[`inner${dim}`];
        }

        return parseFloat(inst.css(dim.toLowerCase()));
    }

    /**
     * Each matched elements in descending order until found a positive return.
    */
    function some(arr: ArrayLike<any>, it: ForEachIterator<any>): boolean {
        for (let i = arr.length - 1; i >= 0; --i) {
            if (it(i, arr[i])) {return true; }
        }
        return false;
    }

    /**
     * Verify if element matches selector.
     */
    function matches(elem: Element, selector: string): boolean {
        if (!isSet(selector)) {return true; }
        if (elem.matches) {return elem.matches(selector); }
        emptyElement(AUX_ELEM);
        AUX_ELEM.appendChild(elem);
        return !!AUX_ELEM.querySelector(selector);
    }

    /**
     * Verify if element has parent.
     */
    function hasParent(elem: Node): boolean {
        return !!elem.parentNode;
    }

    /**
     * Generate list of elements to concat.
     */
    function generateNodeArray(selector: any, context: mQuery): HTMLElement[] | mQuery {
        if (typeOf(selector, 'string')) {
            if (selector.indexOf('<') !== -1) {
                let elems = parseHTML(selector);
                if (elems.length) {return elems; }
            }
            this.prevObject = context;
            return context.find(selector);
        }

        if (isArrayLike(selector)) {
            return selector;
        }

        return [selector];
    }

    function getContext(selector: any): mQuery {
        if (!selector) {return ROOT; }

        // If mQuery was passed, then return this mQuery
        if (selector instanceof mQuery) {return selector; }

        // Create new instance
        return m$(selector, selector.prevObject || ROOT);
    }

    /**
     * Generic child insertion.
     */
    function setChildren(children: ArrayLike<string | number | ArrayLike<any>>, elemInsertFn: Function, stringInsertFn: Function): void {
        each(children, (_, child) => {
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
    function dataRef(elem: HTMLElement, key?: any): Object {
        let data = elem[APP_NAME]['data'], hasAttr = elem[APP_NAME]['hasAttr'];
        !data && (data = elem[APP_NAME]['data'] = {});

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
            elem[APP_NAME]['hasAttr'] = true;
        }
        return data;
    }

    /**
     * [MQUERY ONLY] Verify if object is array-like.
     * @param obj Object to be verified.
     */
    export function isArrayLike(obj): boolean {
        if (Array.isArray(obj)) {return true; }
        if (!obj || typeOf(obj, ['function', 'string', 'window'])) {return false; }

        let length = obj.length;
        return typeof length === "number" && (length === 0 || (length > 0  && (length - 1) in obj));
    }

    /**
     * Merge the contents of two arrays together into the first array.
     * @param first The first array-like object to merge, the elements of second added.
     * @param second The second array-like object to merge into the first, unaltered.
     */
    export function merge(first: any, second: any): ArrayLike<any> {
        each(second, (_, elem) => {first.push(elem)});
        return first;
    }

    /**
     * Convert an array-like object into a true JavaScript array.
     * @param obj Any object to turn into a native Array.
     */
    export function makeArray(obj: ArrayLike<any>): any[] {
        return obj.length === 1 ? [obj[0]] : Array.apply(null, obj);
    }

    /**
     * Takes a function and returns a new one that will always have a particular context.
     * @param target The function whose context will be changed.
     * @param context The object to which the context (this) of the function should be set.
     */
    export function proxy(target: Function, context: any): Function {
        return target.bind(context);
    }

    /**
     * A generic iterator function, which can be used to seamlessly iterate over both objects and arrays.
     * @param arr The array or array-like object to iterate over.
     * @param it The function that will be executed on every value.
     */
    export function each(arr: ArrayLikeObject, it: ForEachIterator<any>): ArrayLikeObject {
        if (isArrayLike(arr)) {
            let length = arr.length;
            for (let i = 0; i < length; i++) {
                if (it.call(arr[i], i, arr[i]) === false) {break; }
            }
        } else {
            for (let key in arr) {
                if (it.call(arr[key], key, arr[key]) === false) {break; }
            }
        }
        return arr;
    }

    /**
     * Finds the elements of an array which satisfy a filter function. The original array is not affected.
     * @param arr The array-like object to search through.
     * @param filter The function to process each item against.
     * @param invert If true, the filter gonna return false to add element. Default false.
     * @param newArr [ONLY MQUERY] Optional: List to add elements.
     */
    export function grep(arr: ArrayLike<any>, filter: (value, index) => boolean | void, invert = false, newArr: any = []): ArrayLike<any> {
        each(arr, (i, value) => {
            if (filter(value, i) == invert) {return; }
            newArr.push(value);
        });
        return newArr;
    }

    /**
     * Translate all items in an array or object to new array of items.
     * @param arr The Array or object to translate.
     * @param beforePush The function to process each item.
     * @param newArr [ONLY MQUERY] List to add elements.
     */
    export function map(arr: ArrayLikeObject, beforePush: (value, index) => any, newArr: any = []): ArrayLike<any> {
        each(arr, (i, value) => {newArr.push(beforePush.call(value, value, i))});
        return newArr;
    }

    /**
     * Determine the internal JavaScript [[Class]] of an object.
     * @param obj Object to get the internal JavaScript [[Class]] of.
     */
    export function type(obj: any): string {
        if (Array.isArray(obj)) {return 'array'; }
        return (typeof obj).toLowerCase();
    }

    /**
     * Check to see if an object is empty (contains no enumerable properties)
     * @param obj The object that will be checked to see if it's empty.
     */
    export function isEmptyObject(obj): boolean {
		for (let _ in obj) {return false; }
		return true;
    }

    /**
     * Execute some JavaScript code globally.
     * @param code The JavaScript code to execute.
     */
    export function globalEval(code: string): void {
        const script = DOC.createElement('script');
        script.text = code;
        DOC.head.appendChild(script).parentNode.removeChild(script);
    }

    /**
     * Transform HTML/XML code to list of elements.
     * @param htmlString HTML/XML code.
     */
    export function parseHTML(htmlString: string): any[] {
        AUX_ELEM.innerHTML = htmlString;
        let returnArr = makeArray(AUX_ELEM.childNodes);
        emptyElement(AUX_ELEM);
        return returnArr;
    }

    /**
     * [ONLY MQUERY] Transforms object into string and string into object. 
     * @param objOrText Object or string.
     * @param ignoreErr If the parse thrown an error, ignore. If 'true' objOrText will be returned.
     * @param forceStringify Force transform any parameter (Object or string) to string.
     */
    export function json(objOrText: Object | string, ignoreErr: boolean, forceStringify?: boolean): Object | string {
        try {
            if (typeOf(objOrText, 'string') && !forceStringify) {
                return JSON.parse(<string>objOrText);
            }
            return JSON.stringify(objOrText);
        } catch (e) {
            if (!ignoreErr) {throw e; }
            return objOrText;
        }
    }

    /**
     * [ONLY MQUERY] Get cookie by key.
     * @param key Cookie key.
     */
    export function cookie(key: string): any;
    /**
     * [ONLY MQUERY] Set cookie by key.
     * @param key Cookie key.
     * @param value Cookie value.
     */
    export function cookie(key: string, value: any): void;
    /**
     * [ONLY MQUERY] Set cookie by key with options.
     * @param key Cookie key.
     * @param value Cookie value.
     * @param options {timeout?, path?} Set timeout in seconds and path of your new cookie.
     */
    export function cookie(key: string, value: any, options: {timeout?: number, path?: string}): void;

    export function cookie(key: string, value?: any, options: any = {}): any {
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
        each(rawCookies, (_, cookie) => {
            cookie = cookie.trim();
            if (cookie.indexOf(name) !== 0) {return true; }

            // When find name, get data and stop each
            data = cookie.substring(name.length, cookie.length);
            return false;
        });

        // Return json or string
        return json(data, true);
    }

    /* *** ============================ mQuery ============================ *** */

    /**
     * Perform an asynchronous HTTP (Ajax) request.
     * @param url A string containing the URL to which the request is sent.
     */
    export function ajax(url: string): Deferred;
    /**
     * @param settings AJAX options.
     */
    export function ajax(settings: AJAXSettings): Deferred;
    /**
     * @param url A string containing the URL to which the request is sent.
     * @param settings AJAX options.
     */
    export function ajax(url: string, settings: AJAXSettings): Deferred;

    export function ajax(url: string | AJAXSettings, settings: AJAXSettings = {}): Deferred {
        let deferred = m$.Deferred(), request;

        if (typeOf(url, 'string')) {
            settings.url = <string>url;
        } else {
            settings = <AJAXSettings>url;
        }

        each(AJAX_CONFIG, (key, value) => {
            if (isSet(settings[key])) {return; }
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
            reject = (textStatus, _e) => {
                let errorThrown = request.statusText.replace(/^[\d*\s]/g, '');
                deferred.rejectWith(context, request, textStatus, errorThrown);
            };

        // Set ajax default callbacks (success, error and complete)
        deferred.then(settings.success, settings.error);
        if (isSet(settings.complete)) {
            deferred.done((_d, _s, request) => {
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
        } else {
            console.warn(
                "[Deprecation] Synchronous XMLHttpRequest on the main thread " +
                "is deprecated because of its detrimental effects to the end " +
                "user's experience. For more help, check https://xhr.spec.whatwg.org/.");
        }

        // Listeners
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(null, request.statusText);
            }
        };
        request.onerror = () => {reject('error', 'Connection error.')};
        request.ontimeout = () => {reject('timeout', 'Request timed out.')};
        request.onabort = () => {reject('abort', 'Request aborted.')};

        // Proccess data
        if (settings.method === HTTP.POST || settings.method === HTTP.PUT) {
            request.send(param(settings.data));
        } else {
            request.send();
        }

        return deferred.promise();
    }

    /**
     * Transform Array-like objects into encodedURI.
     */
    function buildParam(obj: ArrayLikeObject, prefix, forceString?: boolean): string {
        let uri = [], name, isArr = typeOf(obj, 'array'), e = encodeURIComponent;
        each(obj, (key, value) => {
            // If array, dont use key
            isArr && (key = '');

            // Get name 
            name = (prefix || isArr) ? `${prefix}[${key}]` : key;

            // If string or number, set uri
            uri.push(forceString || typeOf(value, ['string', 'number']) ? 
                `${e(name)}=${e(value)}` :
                buildParam(value, name));
        });
        return uri.join('&');
    }

    /**
     * Build default requests
     */
    function requestBuilder(method, urlOrSettings, dataOrSuccess?, success?): Deferred {
        let settings: AJAXSettings, data;

        if (typeOf(urlOrSettings, 'string')) {
            settings = <AJAXSettings>{url: urlOrSettings};
        } else {
            settings = <AJAXSettings>urlOrSettings;
        }

        if (typeOf(dataOrSuccess, 'function')) {
            success = dataOrSuccess;
        } else {
            data = dataOrSuccess;
        }

        settings.method = method;
        settings.data = data;
        settings.success = success;

        return ajax(settings);
    }

    /**
     * Load data from the server using a HTTP GET request.
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    export function get(url: string, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP GET request.
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     */
    export function get(url: string, data: any, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP GET request.
     * @param settings A set of key/value pairs that configure the Ajax request.
     */
    export function get(settings: AJAXSettings): Deferred;

    export function get(urlOrSettings: AJAXSettings | string, dataOrSuccess?: AJAXSuccess | any, success?: AJAXSuccess): Deferred {
        return requestBuilder(HTTP.GET, urlOrSettings, dataOrSuccess, success);
    }

    /**
     * Load data from the server using a HTTP POST request.
     * @param url A string containing the URL to which the request is sent.
     * @param success A callback function that is executed if the request succeeds.
     */
    export function post(url: string, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP POST request.
     * @param url A string containing the URL to which the request is sent.
     * @param data A plain object or string that is sent to the server with the request.
     * @param success A callback function that is executed if the request succeeds.
     */
    export function post(url: string, data: any, success: AJAXSuccess): Deferred;
    /**
     * Load data from the server using a HTTP POST request.
     * @param settings A set of key/value pairs that configure the Ajax request.
     */
    export function post(settings: AJAXSettings): Deferred;

    export function post(urlOrSettings: AJAXSettings | string, dataOrSuccess?: AJAXSuccess | any, success?: AJAXSuccess): Deferred {
        return requestBuilder(HTTP.POST, urlOrSettings, dataOrSuccess, success);
    }

    export function param(obj: ArrayLikeObject, tradicional = false): string {
        return buildParam(obj, '', tradicional);
    }

    /**
     * Set event shorthand methods.
     * @param events string[] Ex.: ['click', 'focus', 'mouseenter'] enable this shorthand methods.
     */
    export function shorthands(events: string[]): void {
        events.forEach((event) => {
            fn[event] = function (handler) {
                if (!isSet(handler)) {
                    return this.trigger(event);
                }
                return this.on(event, handler);
            }
        });
    }

    /**
     * A factory function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.
     * @param beforeStart A function that is called just before the constructor returns.
     */
    export function Deferred(beforeStart?: Function): Deferred {
        return new m$.Promise.Deferred(beforeStart);
    }

    const EMPTY = m$();
    const ROOT = m$(DOC);
    export const ready = ROOT.ready;
}

export namespace m$.Promise {

    type Pipeline = {
        done: Function[],
        fail: Function[],
        context?: any,
        args?: any
    }

    export enum State {
        Pending = 'pending',
        Resolved = 'resolved',
        Rejected = 'rejected'
    }

    function call(fns, context = this, args?: any[]) {
        let fnReturn;
        fns.forEach((fn) => {
            fnReturn = fn.apply(context, args);
            fnReturn !== undefined && (args = fnReturn);
        })
    }

    /**
     * Chainable utility
     */
    export class Deferred {
        private _state: State;
        private pipeline: Pipeline;

        constructor (beforeStart?: Function) {
            this._state = State.Pending;
            this.pipeline = {done: [], fail: []};
            beforeStart && beforeStart(this);
        }

        private changeState(newState: State, context, args): boolean {
            if (this._state !== State.Pending) {return false; }
            this._state = newState;
            this.pipeline.context = context;
            this.pipeline.args = args;
            return true;
        }


        public resolve(...args): this {
            args.unshift(this);
            return this.resolveWith.apply(this, args);
        }

        public reject(...args): this {
            args.unshift(this);
            return this.rejectWith.apply(this, args);
        }

        public resolveWith(context, ...args): this {
            if (this.changeState(State.Resolved, context, args)) {
                call(this.pipeline.done, context, args);
            }
            return this;
        }

        public rejectWith(context, ...args): this {
            if (this.changeState(State.Rejected, context, args)) {
                call(this.pipeline.fail, context, args);
            }
            return this;
        }

        public state(): string {
            return this._state;
        }

        public promise(): Deferred {
            return this;
        }

        public done(callback: (...args) => void): Deferred {
            if (!callback) {return this; }
            if (this.state() === State.Resolved) {
                callback.apply(this.pipeline.context, this.pipeline.args);
            }
            this.pipeline.done.push(callback);
            return this;
        }

        public fail(callback: (...args) => void): Deferred {
            if (!callback) {return this; }
            if (this.state() === State.Rejected) {
                callback.apply(this.pipeline.context, this.pipeline.args);
            }
            this.pipeline.fail.push(callback);
            return this;
        }

        public then(successFilter: (...args) => any, errorFilter?: (...args: any[]) => any): Deferred {
            return this.done(successFilter).fail(errorFilter);
        }

        public allways(callback: (...args) => void): Deferred {
            return this.then(callback, callback);
        }
    }
}
