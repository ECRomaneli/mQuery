export declare type AJAXCallback = Function;
export declare type EachIterator = (index?: number, element?: HTMLElement) => boolean | void;
export declare type ForEachIterator = (key: string, value: any) => void;
export declare type AJAXPromise = Promise<Object>;
export declare type KeyValue = Object;
export declare type AJAXConfig = {
    beforeSend?: (XHR: XMLHttpRequest, settings: KeyValue) => void;
    complete?: (XHR: XMLHttpRequest, textStatus: string) => void;
    success?: (data: any, textStatus: string, XHR: XMLHttpRequest) => void;
    error?: (XHR: XMLHttpRequest, textStatus: string, errorThrown: string) => void;
    contentType?: false | string;
    context?: Object;
    data?: KeyValue | string | any[];
    dataFilter?: (data: string, type: string) => any;
    headers?: KeyValue;
    method: string;
    type?: string;
    url?: string;
    mimeType?: string;
    username?: string;
    password?: string;
    async?: boolean;
    statusCode?: KeyValue;
    timeout?: number;
    xhr?: () => XMLHttpRequest;
};
/**
 * MQuery, a jQuery-like lightweight framework.
 */
export declare class MQuery {
    [index: string]: any;
    [index: number]: HTMLElement;
    /**
     * CONSTANTS AND PROPERTIES
     */
    private static readonly APP_NAME;
    private static readonly DOC;
    private static readonly AUX_ELEM;
    static readonly fn: MQuery;
    private static AJAX_CONFIG;
    length: number;
    /**
     * Default constructor.
     * @param selector MQuery | NodeList | Node | Array<Node> | QuerySelector | HTML String
     */
    constructor(selector?: any);
    /**
     * Transform object parameter to Array.
     * @param obj object must be array compatible
     * @return Array
     */
    private static toArray(obj);
    /**
     * Insert element on internal list.
     * @param elem element
     * @return MQuery instance
     */
    private push(elem);
    /**
     * Each listed elements on position ascendant order.
     * @param fn {elem, index, list} Callback for each elements
     * @return void
     */
    private forEach(fn);
    /**
     * Each listed elements on position descendant order at found a positive return.
     * @param fn {elem, index, list} Callback for each elements
     * @return true if some iteration return true, or false if not
     */
    private some(fn);
    /**
     * Concat array-like elements inside current object.
     * @param elems MQuery | Array[HTMLElement]
     * @return MQuery instance
     */
    private concat(elems);
    /**
     * Verify if parameter is set (comparing with undefined).
     * NOTE: [], 0 and "" will return true.
     * @param param parameter to be verified
     * @return if object is setted or not
     */
    static isSet(param: any): boolean;
    /**
     * Verify the type of object passed and compare.
     * @param object object to be verified
     * @param type type of object
     * @return if object is of passed type or not
     */
    static typeOf(object: any, types: string): boolean;
    /**
     * Verify if object is instance of type passed.
     * @param object object to be verified
     * @param type type of object
     * @return if object is instance of type or not
     */
    static instanceOf(object: any, type: any): boolean;
    /**
     * Get the value or, if not exists, the default value.
     * @param value value
     * @param defaultValue default value
     * @return value if exists or default value if not
     */
    static getOrDefault(value: any, defaultValue: any): any;
    /**
     * Transform snake case string to camel case.
     * @param s snake case string
     * @return camel case string
     */
    static snakeToCamelCase(s: string): string;
    /**
     * Transform camel case string to snake case.
     * @param c camel case string
     * @return snake case string
     */
    static camelToSnakeCase(c: string): string;
    /**
     * Each elements of the list calling forEach Array Function.
     * @param list List of elements
     * @param fn (elem, index, array) Callback for each elements
     * @return void
     */
    static forEach(list: any, fn: any): void;
    /**
     * [HEAVY] Each object attributes and values.
     * @param obj Object to each
     * @param fn ForEachIterator Callback for each elements
     * @return void
     */
    static forEachObj(obj: KeyValue, fn: ForEachIterator): void;
    /**
     * Transform HTML/XML code to list of elements.
     * @param code HTML/XML code
     * @return NodeList
     */
    private static codeToNodeList(code);
    /**
     * Verify if element matches selector.
     * @param elem element to be verified
     * @param querySelector querySelector
     * @return true if element matches selector, or false if not
     */
    private static matches(elem, querySelector);
    /**
     * Verify if element has parent.
     * @param elem element to be verified
     * @return true if has parent, or false if not
     */
    private static hasParent(elem);
    /**
     * Generate list of elements to concat.
     * @param selector MQuery | NodeList | HTMLElement | QuerySelector | HTML String
     * @return Array<HTMLElement>|MQuery
     */
    private static generateNodeArray(selector?);
    /**
     * Set event shorthand methods.
     * @param events Array<string> Example: ['click', 'focus', 'mouseenter'] enable this shorthand methods.
     * @return void
     */
    static setEventsShorthand(events: Array<string>): void;
    /**
     * Export automatic mQuery instance methods to objects.
     * Ex.: MQuery.(foo, ['click'], 'button') enables foo.click() trigger click on button tags
     * @param target object will be receive the method
     * @param fns array of functions will be ed
     * @param selector selector for mQuery instance
     * @return void
     */
    static export(target: any, fns: Array<string>, selector?: any): void;
    /**
     * Generic child insertion.
     * @param rawChildren array<MQuery|HTMLElement|string> children array
     * @param elemInsertFn function responsible to add elem child
     * @param stringInsertFn function responsible to add string child
     * @return void
     */
    private static setChildren(rawChildren, elemInsertFn, stringInsertFn);
    /**
     * Shorthand to concat all elements quered values with space between them.
     * @param fnVal function responsible to generate value
     * @return string with values concated
     */
    private eachConcat(fnVal);
    /**
     * Return all leaf elements (elements without child).
     * @return MQuery instance
     */
    leaves(): MQuery;
    /**
     * Called after DOM content finish load.
     * @param handler event listener
     * @return MQuery instance
     */
    ready(handler: EventListener): MQuery;
    /**
     * Each quered elements.
     * @param handler callback to iterate elements
     * @return MQuery instance
     */
    each(handler: EachIterator): MQuery;
    /**
     * Attach listeners on events passed by paramenter.
     * @param event events separated by space
     * @param selectOrHandler [OPTIONAL] selector to query before attach
     * @param handler event listener
     * @return MQuery instance
     */
    on(event: string, selectOrHandler: any, handler?: EventListener): MQuery;
    /**
     * Detach listeners on events passed by paramenter.
     * @param event events separated by space
     * @param selectOrHandler [OPTIONAL] selector to query before detach
     * @param handler event listener
     * @return MQuery instance
     */
    off(event: string, selectOrHandler: any, handler: EventListener): MQuery;
    is(selector: string): MQuery;
    /**
     * Find children elements by selector.
     * @param selector query selector
     * @return MQuery instance
     */
    find(selector: string): MQuery;
    /**
     * Get parent element.
     * @param selector [OPTIONAL] parent's selector
     * @return MQuery instance
     */
    parent(selector?: string): MQuery;
    /**
     * [EXPERIMENTAL] Load data inside quered elements.
     */
    load(url: string, data?: Object, complete?: AJAXCallback): MQuery;
    ajax(url: string): Object;
    ajax(config: AJAXConfig): Object;
    ajax(url: string, config: AJAXConfig): Object;
    private static callFn(fn, context, params?);
    private static callFns(fns, call);
    /**
     * Trigger events.
     * @param event event name
     * @param data data to be passed to event
     * @return MQuery instance
     */
    trigger(event: string, data?: KeyValue): MQuery;
    /**
     * Get/Set attribute on quered elements.
     * @param attr attribute name
     * @param value [ONLY TO SET] attribute value
     * @return MQuery instance if setting a value, or string if getting
     */
    attr(attr: string): string;
    attr(attr: string, value: string): MQuery;
    removeAttr(attr: string): MQuery;
    /**
     * Get/Set style on quered elements.
     * @param nameOrJSON name of the style or [ONLY TO SET] JSON with styles and values
     * @param value [ONLY TO SET] value of the style
     * @return MQuery instance if setting a value, or string if getting
     */
    css(vame: string): string;
    css(json: Object): MQuery;
    css(name: string, value: string | number): MQuery;
    /**
     * Get/Set inner text on quered elements (for active HTML code, use .html()).
     * @param value text to be added
     * @return MQuery instance if setting a value, or string if getting
     */
    text(): string;
    text(value: string): MQuery;
    /**
     * Get/Set inner html on quered elements.
     * @param value [ONLY TO SET] html code to be added
     * @return MQuery instance if setting a value, or string if getting
     */
    html(): string;
    html(value: string): MQuery;
    /**
     * Get/Set outer html on quered elements.
     * @param value [ONLY TO SET] html code to replace
     * @return MQuery instance if setting a value, or string if getting
     */
    outerHtml(): string;
    outerHtml(value: string): MQuery;
    /**
     * Return children of all elements on list.
     * @param selector [OPTIONAL] match children before return
     */
    children(selector?: string): MQuery;
    /**
     * Return first element on list or undefined if list is empty.
     */
    first(): MQuery;
    /**
     * Return last element on list or undefined if list is empty.
     */
    last(): MQuery;
    /**
     * Get all siblings.
     * @param selector [OPTIONAL] filter siblings by selector
     * @return MQuery instance
     */
    siblings(selector?: string): MQuery;
    /**
     * Get previous sibling.
     * @param selector [OPTIONAL] get previous sibling matches selector
     * @return MQuery instance
     */
    prev(selector?: string): MQuery;
    /**
     * Get next sibling.
     * @param selector [OPTIONAL] get next sibling matches selector
     * @return MQuery instance
     */
    next(selector?: string): MQuery;
    /**
     * Add elements before first child.
     * @param elem1... MQuery|element
     * @return MQuery instance
     */
    prepend(): MQuery;
    /**
     * Add elements after last child.
     * @param elem1... MQuery|Element
     * @return MQuery instance
     */
    append(): MQuery;
    /**
     * Get/Set 'data' attribute.
     * @param attr attribute name
     * @param value [ONLY TO SET] attribute value
     * @return MQuery instance if setting a value, or string if getting
     */
    data(attr: string): string;
    data(attr: string, value: string): MQuery;
    /**
     * Get/Set input value.
     * @param value [ONLY TO SET] input value
     * @return MQuery instance if setting a value, or string if getting
     */
    val(): string;
    val(value: string): MQuery;
    /**
     * Add class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    addClass(className: string): MQuery;
    /**
     * Remove class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    removeClass(className: string): MQuery;
    /**
     * Return if some quered element has the class.
     * @param className class name
     * @return true, if some quered element has the class, and false if not.
     */
    hasClass(className: string): boolean;
    /**
     * Toggle class on quered elements.
     * @param className class name
     * @return MQuery instance
     */
    toggleClass(className: string): MQuery;
    /**
     * Remove elements on MQuery array.
     * @param selector [OPTIONAL] query selector
     */
    remove(selector?: string): MQuery;
    /**
     * Remove all childs (including texts).
     */
    empty(): MQuery;
    /**
     * Return width of first element on list.
     */
    width(): number;
    /**
     * Return height of first element on list.
     */
    height(): number;
}
/**
 * Return instance of MQuery with elements matched.
 * @param selector selector
 * @return MQuery instance
 */
export declare const m$: (selector?: string | Node | NodeList | Node[] | MQuery) => MQuery;
/**
 * Return instance of MQuery with elements matched.
 * @param selector selector
 * @return MQuery instance
 */
export declare const mQuery: (selector?: string | Node | NodeList | Node[] | MQuery) => MQuery;
