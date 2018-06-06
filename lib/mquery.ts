type ForIterator = (value?: any, index?: number, arr?: any) => void;
export type EachIterator = (index?: number, element?: HTMLElement) => boolean | void;
export type ForEachIterator = (key: string, value: any) => void;
export type StringArray = Object;

/**
 * MQuery, a jQuery-like lightweight framework.
 */
export class MQuery {
    [index: string]: any;
    [index: number]: HTMLElement;
    /**
     * CONSTANTS AND PROPERTIES
     */

    private static readonly APP_NAME = 'mQuery';
    private static readonly DOC = document;
    private static readonly AUX_ELEM = MQuery.DOC.createElement(`_${MQuery.APP_NAME}_`);
    public static readonly fn = MQuery.prototype;
    public length = 0;
    
    /**
     * Default constructor.
     * @param selector MQuery | NodeList | HTMLElement | QuerySelector | HTML String
     */
    constructor(selector?: any) {
        let elems: Array<HTMLElement> | MQuery;

        if (MQuery.typeOf(selector, 'function')) {
            elems = MQuery.generateNodeArray();
            this.ready(selector);
        } else {
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
    private static toArray(obj: any): Array<any> {
        return [].slice.call(obj || []);
    }

    /**
     * Insert element on internal list.
     * @param elem element
     * @return MQuery instance
     */
    private push(elem: any): MQuery {
        // Verify if elem has been inserted inside this list before
        if (!elem || elem[MQuery.APP_NAME] === this) {return this; }
        this[this.length++] = elem;
        // Add list reference to the elem
        elem[MQuery.APP_NAME] = this;
        return this;
    }

    /**
     * Each listed elements on position ascendant order.
     * @param fn {elem, index, list} Callback for each elements
     * @return void
     */
    private forEach(fn: ForIterator): void {
        for (let i = 0; i < this.length; ++i) {
            fn(this[i], i, this);
        }
    }

    /**
     * Each listed elements on position descendant order at found a positive return.
     * @param fn {elem, index, list} Callback for each elements
     * @return true if some iteration return true, or false if not
     */
    private some(fn: ForIterator): boolean { 
        for (let i = this.length - 1; i >= 0; --i) { 
            if (fn(this[i], i, this)) {return true; } 
        } 
        return false; 
    } 

    /**
     * Concat array-like elements inside current object.
     * @param elems MQuery | Array[HTMLElement]
     * @return MQuery instance
     */
    private concat(elems: any): MQuery {
        elems.forEach((elem) => {this.push(elem)});
        return this;
    }

    // ====================== UTILITIES ======================= //

    /**
     * Verify if parameter is set (comparing with undefined).
     * NOTE: [], 0 and "" will return true.
     * @param param parameter to be verified
     * @return if object is setted or not
     */
    public static isSet(param: any): boolean {
        return param !== undefined;
    }

    /**
     * Verify the type of object passed and compare.
     * @param object object to be verified
     * @param type type of object
     * @return if object is of passed type or not
     */
    public static typeOf(object: any, types: string): boolean {
        return types.split(' ').some((type) => {
            if (type === 'array') {return Array.isArray(object); }
            return type === (typeof object).toLowerCase();
        });
    }

    /**
     * Verify if object is instance of type passed.
     * @param object object to be verified
     * @param type type of object
     * @return if object is instance of type or not
     */
    public static instanceOf(object: any, type: any): boolean {
        return object instanceof type;
    }
    
    /**
     * Get the value or, if not exists, the default value.
     * @param value value
     * @param defaultValue default value
     * @return value if exists or default value if not
     */
    public static getOrDefault(value: any, defaultValue: any): any {
        return MQuery.isSet(value) ? value : defaultValue;
    }

    /**
     * Transform snake case string to camel case.
     * @param s snake case string
     * @return camel case string
     */
    public static snakeToCamelCase(s: string): string {
        return s.replace(/(\-\w)/g, (m) => m[1].toUpperCase());
    }

    /**
     * Transform camel case string to snake case.
     * @param c camel case string
     * @return snake case string
     */
    public static camelToSnakeCase(c: string): string {
        return c.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
    }

    /**
     * Each elements of the list calling forEach Array Function.
     * @param list List of elements
     * @param fn (elem, index, array) Callback for each elements
     * @return void
     */
    public static forEach(list: any, fn: any): void { 
        [].forEach.call(list, fn); 
    } 

    /**
     * [HEAVY] Each object attributes and values.
     * @param obj Object to each
     * @param fn ForEachIterator Callback for each elements
     * @return void
     */
    public static forEachObj(obj: StringArray, fn: ForEachIterator): void {
        for (let key in obj) {fn(key, obj[key]); }
    }

    // ================== MQUERY PROPERTIES =================== //

    /**
     * Transform HTML/XML code to list of elements.
     * @param code HTML/XML code
     * @return NodeList
     */
    private static codeToNodeList(code: string): NodeList {
        MQuery.AUX_ELEM.innerHTML = code;
        return MQuery.AUX_ELEM.childNodes;
    }

    /**
     * Verify if element matches selector.
     * @param elem element to be verified
     * @param querySelector querySelector
     * @return true if element matches selector, or false if not
     */
    private static matches(elem: Element, querySelector: string): boolean {
        if (!MQuery.isSet(querySelector)) {return true; }
        if (elem.matches) {return elem.matches(querySelector); }
        MQuery.AUX_ELEM.innerHTML = '';
        MQuery.AUX_ELEM.appendChild(elem);
        return !!MQuery.AUX_ELEM.querySelector(querySelector);
    }

    /**
     * Verify if element has parent.
     * @param elem element to be verified
     * @return true if has parent, or false if not 
     */
    private static hasParent(elem: Node): boolean {
        return !!elem.parentNode && elem.parentNode !== MQuery.AUX_ELEM;
    }

    /**
     * Generate list of elements to concat.
     * @param selector MQuery | NodeList | HTMLElement | QuerySelector | HTML String
     * @return Array<HTMLElement>|MQuery
     */
    private static generateNodeArray(selector?: any): Array<HTMLElement> | MQuery {
        if (!MQuery.isSet(selector)) {return []; }

        if (MQuery.typeOf(selector, 'string')) {
            try {
                return MQuery.toArray(MQuery.DOC.querySelectorAll(selector));
            } catch (e) {
                return MQuery.toArray(MQuery.codeToNodeList(selector));
            }
        }

        if (MQuery.typeOf(selector, 'array') || MQuery.instanceOf(selector, MQuery)) {
            return selector;
        }

        return [selector];
    }

    /**
     * Set event shorthand methods.
     * @param events Array<string> Example: ['click', 'focus', 'mouseenter'] enable this shorthand methods.
     * @return void
     */
    public static setEventsShorthand(events: Array<string>): void {
        events.forEach((event) => {
            MQuery.fn[event] = function (handler) {
                if (!MQuery.isSet(handler)) {
                    return this.trigger(event);
                }
                return this.on(event, handler);
            }
        });
    }

    /**
     * Export automatic mQuery instance methods to objects.
     * Ex.: MQuery.(foo, ['click'], 'button') enables foo.click() trigger click on button tags
     * @param target object will be receive the method
     * @param fns array of functions will be ed
     * @param selector selector for mQuery instance
     * @return void
     */
    public static export(target: any, fns: Array<string>, selector: any = []): void {
        fns.forEach((fn) => {target[fn] = function () {
            let mQuery = new MQuery(selector);
            mQuery[fn].apply(mQuery, arguments);
        }});
    }

    /**
     * Generic child insertion.
     * @param rawChildren array<MQuery|HTMLElement|string> children array
     * @param elemInsertFn function responsible to add elem child
     * @param stringInsertFn function responsible to add string child
     * @return void
     */
    private static setChildren(rawChildren: any, elemInsertFn: Function, stringInsertFn: Function): void {
        rawChildren.forEach((children) => {
            if (MQuery.instanceOf(children, MQuery)) {
                children.each((i, child) => {
                    if (MQuery.hasParent(child)) {
                        return stringInsertFn(child.outerHTML);
                    }
                    elemInsertFn(child);
                });
                return;
            }
            if (MQuery.typeOf(children, 'array')) {
                return this.setChildren(children, elemInsertFn, stringInsertFn);
            }
            if (MQuery.typeOf(children, 'string')) {
                return stringInsertFn(children);
            }
            return elemInsertFn(children);
        });
    }

    /**
     * Shorthand to concat all elements quered values with space between them.
     * @param fnVal function responsible to generate value
     * @return string with values concated
     */
    private eachConcat(fnVal: Function): string {
        let value = '';
        this.each((i, elem) => {
            value += `${fnVal.apply(elem, [i, elem])} `;
        });
        return value.trim() || void 0;
    }

    /**
     * Return all leaf elements (elements without child).
     * @return MQuery instance
     */
    public leaves(): MQuery {
        let leaves = new MQuery([]);
        this.each((i, elem) => {
            if (!elem.firstChild) {
                leaves.push(elem);
                return;
            }
            MQuery.forEach(elem.getElementsByTagName("*"), (child) => {
                if (!child.firstElementChild) {leaves.push(child); }
            });
        });
        return leaves;
    }

    /**
     * Called after DOM content finish load.
     * @param handler event listener
     * @return MQuery instance
     */
    public ready(handler: EventListener): MQuery {
        MQuery.DOC.addEventListener('DOMContentLoaded', handler, true);
        return this;
    }

    /**
     * Each quered elements.
     * @param handler callback to iterate elements
     * @return MQuery instance
     */
    public each(handler: EachIterator): MQuery {
        let count = 0;
        this.forEach(elem => {handler.apply(elem, [count++, elem])});
        return this;
    }

    /**
     * Attach listeners on events passed by paramenter.
     * @param event events separated by space
     * @param selectOrHandler [OPTIONAL] selector to query before attach
     * @param handler event listener
     * @return MQuery instance
     */
    public on(event: string, selectOrHandler: any, handler?: EventListener): MQuery {
        if (arguments.length === 2) {handler = selectOrHandler; }

        let events = event.split(' '),
            elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each((i, elem) => {
            events.forEach((event) => {elem.addEventListener(event, handler, true)});
        });
        return this;
    }

    /**
     * Detach listeners on events passed by paramenter.
     * @param event events separated by space
     * @param selectOrHandler [OPTIONAL] selector to query before detach
     * @param handler event listener
     * @return MQuery instance
     */
    public off(event: string, selectOrHandler: any, handler: EventListener): MQuery {
        if (arguments.length === 2) {let handler = selectOrHandler; }

        let events = event.split(' '),
            elems = arguments.length === 3 ? this.find(selectOrHandler) : this;
        elems.each((i, elem) => {
            events.forEach((event) => {elem.removeEventListener(event, handler, true)});
        });
        return this;
    }

    public is(selector: string): MQuery {
        let elems = new MQuery([]);
        this.each((i, elem) => {
            if (MQuery.matches(elem, selector)) {elems.push(elem); }
        });
        return elems;
    }

    /**
     * Find children elements by selector.
     * @param selector query selector
     * @return MQuery instance
     */
    public find(selector: string): MQuery {
        let elems = new MQuery([]), concat;

        this.each((i, elem) => {
            try {
                concat = elem.querySelectorAll(selector);
                elems.concat(concat);
            } catch (e) {}
        });

        return elems;
    }
    
    /**
     * Get parent element.
     * @param selector [OPTIONAL] parent's selector
     * @return MQuery instance
     */
	public parent(selector?: string): MQuery {
        let parents = new MQuery([]);

        this.each((i, elem) => {
            if (!MQuery.hasParent(elem)) {return false; }
            elem = elem.parentElement;

            if (!MQuery.matches(elem, selector)) {return false; }

            parents.push(elem);
            return true;
        });

        return parents;
    }

    /**
     * [EXPERIMENTAL] Load data inside quered elements.
     */
    public load(url: string, complete?: any, error?: any): MQuery {
        let fetchURL = fetch(url).then((data) => data.text());
        fetchURL.then((text) => {this.html(text); });
        MQuery.isSet(complete) && fetchURL.then(complete);
        MQuery.isSet(error) && fetchURL.catch(error);
        return this;
    }

    /**
     * Trigger events.
     * @param event event name
     * @param data data to be passed to event
     * @return MQuery instance
     */
    public trigger(event: string, data?: StringArray): MQuery {
        return this.each((i, elem) => {
            if (event === 'focus') {
                elem.focus();
                return;
            }
            let customEvent;
            if (window && window['CustomEvent']) {
                customEvent = new CustomEvent(event, data);
            } else {
                customEvent = document.createEvent(MQuery.snakeToCamelCase(event));
                customEvent.initCustomEvent(event, true, true, data);
            }
            elem.dispatchEvent(customEvent);
        });
    }

    /**
     * Get/Set attribute on quered elements.
     * @param attr attribute name
     * @param value [ONLY TO SET] attribute value
     * @return MQuery instance if setting a value, or string if getting
     */
    public attr(attr: string, value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                if (MQuery.isSet(elem[attr])) {
                    elem[attr] = value;
                    return;
                }
                elem.setAttribute(attr, value);
            });
        }

        return this.eachConcat((i, elem) => {
            if (MQuery.isSet(elem[attr])) {
                return elem[attr];
            }
            return elem.getAttribute(attr);
        });
    }

    public removeAttr(attr: string): MQuery {
        return this.each((i, elem) => {
            elem.removeAttribute(attr);
        });
    }

    /**
     * Get/Set style on quered elements.
     * @param nameOrJSON name of the style or [ONLY TO SET] JSON with styles and values
     * @param value [ONLY TO SET] value of the style
     * @return MQuery instance if setting a value, or string if getting
     */
    public css(nameOrJSON: any, value?: string): MQuery | string {
        if (!MQuery.typeOf(nameOrJSON, 'string')) {
            MQuery.forEachObj(nameOrJSON, (key, value) => {this.css(key, value)});
            return this;
        }

        let name = MQuery.snakeToCamelCase(nameOrJSON);

        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.style[name] = value;
            });
        }

        return this.eachConcat((i, elem) => {
            return elem.style[name];
        });
    }

    /**
     * Get/Set inner text on quered elements (for active HTML code, use .html()).
     * @param value text to be added
     * @return MQuery instance if setting a value, or string if getting
     */
    public text(value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.textContent = value;
            });
        }
        return this.eachConcat((i, elem) => elem.textContent);
    }

    /**
     * Get/Set inner html on quered elements.
     * @param value [ONLY TO SET] html code to be added
     * @return MQuery instance if setting a value, or string if getting
     */
    public html(value?: any): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.innerHTML = value;
            });
        }
        return this.eachConcat((i, elem) => elem.innerHTML);
    }

    /**
     * Get/Set outer html on quered elements.
     * @param value [ONLY TO SET] html code to replace
     * @return MQuery instance if setting a value, or string if getting
     */
    public outerHtml(value?: string): MQuery | string {
        if (MQuery.isSet(value)) {
            return this.each((i, elem) => {
                elem.outerHTML = value;
            });
        }
        return this.eachConcat((i, elem) => elem.outerHTML);
    }

    /**
     * Return children of all elements on list.
     * @param selector [OPTIONAL] match children before return
     */
    public children(selector?: string): MQuery {
        let elems = new MQuery([]);
        this.each((i, elem) => {elems.concat(elem.childNodes); });
        return selector ? elems.is(selector) : elems;
    }

    /**
     * Return first element on list or undefined if list is empty.
     */
    public first(): MQuery {
        return new MQuery(this.length ? this[0] : undefined);
    }

    /**
     * Return last element on list or undefined if list is empty.
     */
    public last(): MQuery {
        return new MQuery(this.length ? this[this.length - 1] : undefined);
    }

    /**
     * Get all siblings.
     * @param selector [OPTIONAL] filter siblings by selector
     * @return MQuery instance
     */
    public siblings(selector?: string): MQuery {
        let siblings = new MQuery([]);
        this.each((i, elem) => {
            MQuery.forEach(elem.parentElement.children, (child) => {
                if (child === elem) {return; }
                if (!MQuery.matches(child, selector)) {return; }
                siblings.push(child);
            });
        });
        return siblings;
    }

    /**
     * Get previous sibling.
     * @param selector [OPTIONAL] get previous sibling matches selector
     * @return MQuery instance
     */
    public prev(selector?: string): MQuery {
        let prev = new MQuery([]), prevElem;
        this.each((i, elem) => {
            prevElem = elem.previousElementSibling;
            while (prevElem && !MQuery.matches(prevElem, selector)) {
                prevElem = prevElem.previousElementSibling;
            }
            prev.push(prevElem);
        });
        return prev;
    }

    /**
     * Get next sibling.
     * @param selector [OPTIONAL] get next sibling matches selector
     * @return MQuery instance
     */
    public next(selector?: string): MQuery {
        let next = new MQuery([]), nextElem;
        this.each((i, elem) => {
            nextElem = elem.nextElementSibling;
            while (nextElem && !MQuery.matches(nextElem, selector)) {
                nextElem = nextElem.nextElementSibling;
            }
            next.push(nextElem);
        });
        return next;
    }

    /**
     * Add elements before first child.
     * @param elem1... MQuery|element
     * @return MQuery instance
     */
    public prepend(): MQuery {
        let rawChildren = MQuery.toArray(arguments).reverse();
        return this.each((i, parent) => {
            MQuery.setChildren(rawChildren,
                (child) =>  {parent.insertBefore(child, parent.firstChild)},
                (str) =>    {parent.insertAdjacentHTML('afterbegin', str)});
        });
    }

    /**
     * Add elements after last child.
     * @param elem1... MQuery|Element
     * @return MQuery instance
     */
    public append(): MQuery {
        let rawChildren = MQuery.toArray(arguments);
        return this.each((i, parent) => {
            MQuery.setChildren(rawChildren,
                (child) =>  {parent.appendChild(child)},
                (str) =>    {parent.insertAdjacentHTML('beforeend', str)});
        });
    }

    /**
     * Get/Set 'data' attribute.
     * @param attr attribute name
     * @param value [ONLY TO SET] attribute value
     * @return MQuery instance if setting a value, or string if getting
     */
    public data(attr: string, value?: string): MQuery | string {
        if (!MQuery.isSet(value)) {
            return this.attr(`data-${attr}`);
        }
        return this.attr(`data-${attr}`, value);
    }

    /**
     * Get/Set input value.
     * @param value [ONLY TO SET] input value
     * @return MQuery instance if setting a value, or string if getting
     */
    public val(value?: string): MQuery | string {
        if (!MQuery.isSet(value)) {
            return this.attr('value');
        }
        return this.attr('value', value);
    }

    /**
     * Add class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    public addClass(className: string): MQuery {
        return this.each((i, elem) => {elem.classList.add(className)});
    }

    /**
     * Remove class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    public removeClass(className: string): MQuery {
        return this.each((i, elem) => {elem.classList.remove(className)});
    }

    /**
     * Return if some quered element has the class.
     * @param className class name
     * @return true, if some quered element has the class, and false if not.
     */
    public hasClass(className: string): boolean {
        return this.some((elem) => elem.classList.contains(className));
    }

    /**
     * Toggle class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    public toggleClass(className: string): MQuery {
        return this.each((i, elem) => {elem.classList.toggle(className)});
    }

    /**
     * Remove elements on MQuery array.
     * @param selector [OPTIONAL] query selector
     */
    public remove(selector?: string): MQuery {
        let elems = new MQuery();
        this.each((i, elem) => {
            if (MQuery.matches(elem, selector)) {
                elem.outerHTML = '';
                return;
            }
            elems.push(elem);
        });
        return elems;
    }

    /**
     * Remove all childs (including texts).
     */
    public empty(): MQuery {
        return this.each((i, elem) => {elem.innerHTML = ''});
    }

    /**
     * Return width of first element on list.
     */
    public width(): number {
        if (!this.length) {return undefined; }
        return this[0].clientWidth;
    }

    /**
     * Return height of first element on list.
     */
    public height(): number {
        if (!this.length) {return undefined; }
        return this[0].clientHeight;
    }
}

/**
 * Return instance of MQuery with elements matched.
 * @param selector selector
 * @return MQuery instance
 */
export const m$ = (selector?: MQuery | NodeList | HTMLElement | string) => new MQuery(selector);
/**
 * Return instance of MQuery with elements matched.
 * @param selector selector
 * @return MQuery instance
 */
export const mQuery = m$;

// Export global MQuery fns
MQuery.export(m$, ['ready', 'load']);