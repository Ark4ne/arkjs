(/**
 * @param {Window} window - Any value
 * @param {HTMLDocument} document - Any value
 * @param {Object} Math - Any value
 */
    function UtilsGlobalClosure(window, document, Math) {
    /**
     * @typedef {Object.<T, U>} Map
     * @template T
     * @template U
     */
    /**
     * @typedef {Map.<string, T>} Set
     * @template T
     */
    /**
     * @typedef {Set.<string, string>} SetString
     */
    /**
     * @typedef {Map.<string, Function>} MapFunction
     */
    /**
     * @typedef {Object} Sizable
     * @param {number} height
     * @param {number} width
     */
    /**
     * @typedef {Sizable} SizableResource
     * @property {string} url
     */

    /** @const {string} */
    var TYPE_NUMBER = 'number';
    /** @const {string} */
    var TYPE_STRING = 'string';
    /** @const {string} */
    var TYPE_ARRAY = 'array';
    /** @const {string} */
    var TYPE_OBJECT = 'object';
    /** @const {string} */
    var TYPE_FUNCTION = 'function';
    /** @const {string} */
    var CONSTRUC_OBJECT = Object.prototype.constructor.toString();
    /** @const {string} */
    var CONSTRUC_ARRAY = Array.prototype.constructor.toString();
    /** @const {Number} */
    var INF = Infinity || -Math.log(0);

    var hasOwnProp = Object.prototype.hasOwnProperty;
    //var arrProtPush = Array.prototype.push;

    var mathMin = Math.min;
    // @TODO Move to polyfill
    var isNaN = window.isNaN || Number.isNaN ||
        /**
         * @function isNaN
         *
         * @see Number.isNaN
         *
         * @param {*} num - Any value
         *
         * @returns {boolean}
         */
         function isNaN(num) {
            return num !== num;
        };


    /**
     * @param {Object} obj - An Object
     * @param {string} property - a property name
     *
     * @returns {boolean}
     */
    function hasOwn(obj, property) {
        return hasOwnProp.call(obj, property);
    }

    /**
     * @param {Function} fn - A Function
     * @param {*} context - A context
     *
     * @returns {Function}
     */
    function bindApply(fn, context) {
        return function boundApply() {
            return fn.apply(context, arguments);
        };
    }

    /**
     * @param {Function} fn - A Function
     * @param {*} context - A context
     *
     * @returns {Function}
     */
    function bindCall(fn, context) {
        return function boundCall() {
            return fn.call(context);
        };
    }

    /**
     * @param {Function} fn - A Function
     * @param {*} context - A context
     *
     * @returns {Function}
     */
    function bindCall1(fn, context) {
        return function boundCall1(arg) {
            return fn.call(context, arg);
        };
    }

    /**
     * @param {Function} fn - A Function
     * @param {*} context - A context
     *
     * @returns {Function}
     */
    function bindCallEvent(fn, context) {
        return function boundCallEvent(ev) {
            return fn.call(context, ev || window.event, this);
        };
    }

    /**
     * @param {Function} fn - A Function
     * @param {*} context - A context
     * @param {*} value - A value
     *
     * @returns {Function}
     */
    function bindCallValue(fn, context, value) {
        return function boundCallValue() {
            return fn.call(context, value);
        };
    }

    /**
     * @param {Function} fn
     * @param {*} [context]
     *
     * @returns {Function}
     */
    function callOnce(fn, context) {
        return (function (called, value) {
            return function () {
                if (!called) {
                    called = true;
                    value = fn.apply(context ? context : this, arguments);
                }
                return value;
            }
        }(false));
    }

    /**
     * @param {...Object.<string, *>} obj - An Object
     *
     * @returns {Object|null|undefined}
     */
    function merge(obj) {
        var arg, j, len, property;

        for (j = 1, len = arguments.length; j < len; j++) {
            arg = arguments[j];
            for (property in arg) {
                if (hasOwn(arg, property))
                    obj[property] = arg[property];
            }
        }
        return obj;
    }

    /**
     * @param {Function} clazz - A Class
     * @param {MapFunction} methods - An list of methods
     *
     * @returns {Function}
     */
    function prototize(clazz, methods) {
        merge(clazz.prototype, methods);
        // Prevent memory leak when the class is extends.
        clazz.prototype.constructor = clazz;

        return clazz;
    }

    /**
     * @param {Function} child - A Class
     * @param {Function} parent - A Class
     *
     * @returns {Function}
     */
    function extendClass(child, parent) {
        for (var key in parent) {
            if (hasOwn(parent, key))
                child[key] = parent[key];
        }
        /** @constructor */
        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }

    /**
     * @param {Function} clazz - A Class
     * @param {Function} parent - A Class
     * @param {MapFunction} methods - An list of methods
     *
     * @returns {Function}
     */
    function inherit(clazz, parent, methods) {
        return prototize(extendClass(clazz, parent), methods);
    }

    /**
     * @param {Array} array - An Array
     * @param {number} start - each since
     * @param {number} end - each to
     * @param {Function} fn - callback
     */
    function eachRange(array, start, end, fn) {
        var _i = start, _len = mathMin(array.length, end);

        while (_i < _len) {
            var value = array[_i];
            if (fn.call(value, _i, value) === false) {
                break;
            }
            _i++;
        }
    }

    /**
     * @param {Array} array - An Array
     * @param {number} since - each since
     * @param {Function} fn - callback
     */
    function eachSince(array, since, fn) {
        eachRange(array, since, INF, fn);
    }

    /**
     * @param {Array} array - An Array
     * @param {Function} fn - callback
     */
    function each(array, fn) {
        eachRange(array, 0, INF, fn);
    }

    /**
     * @param {*} val - Any value
     *
     * @returns {boolean}
     */
    function isDefine(val) {
        return val !== null && val !== undefined;
    }

    /**
     * @param {*} string - Any value
     *
     * @returns {boolean}
     */
    function isString(string) {
        return isDefine(string) && typeof string === TYPE_STRING;
    }

    /**
     * @param {*} array - Any value
     *
     * @returns {boolean}
     */
    function isArray(array) {
        return isDefine(array) && (typeof(array) === TYPE_ARRAY || (typeof(array) === TYPE_OBJECT && array.constructor.toString() === CONSTRUC_ARRAY));
    }

    /**
     * @param {*} fn - Any value
     *
     * @returns {boolean}
     */
    function isFunction(fn) {
        return isDefine(fn) && typeof fn === TYPE_FUNCTION;
    }

    /**
     * @param {*} obj - Any value
     *
     * @returns {boolean}
     */
    function isObject(obj) {
        return isDefine(obj) && typeof obj === TYPE_OBJECT;
    }

    /**
     * @param {*} obj - Any value
     *
     * @returns {boolean}
     */
    function isPlainObject(obj) {
        return isDefine(obj) && isObject(obj) && obj.constructor.toString() === CONSTRUC_OBJECT;
    }

    /**
     * @param {*} num - Any value
     *
     * @returns {boolean}
     */
    function isNumber(num) {
        return isDefine(num) && typeof num === TYPE_NUMBER;
    }

    /**
     * @param {*} num - Any value
     *
     * @returns {boolean}
     */
    function isNumeric(num) {
        return isNumber(num) || (num && isString(num) && !isNaN(num));
    }

    /**
     * @namespace Utils
     *
     * @borrows bindApply as bind
     * @borrows bindCall as bindCall
     * @borrows bindCall1 as bindCall1
     * @borrows bindCallEvent as bindCallEvent
     * @borrows bindCallValue as bindCallValue
     * @borrows callOnce as callOnce
     * @borrows isDefine as isDefine
     * @borrows isString as isString
     * @borrows isArray as isArray
     * @borrows isFunction as isFunction
     * @borrows isObject as isObject
     * @borrows isPlainObject as isPlainObject
     * @borrows isNumber as isNumber
     * @borrows isNumeric as isNumeric
     * @borrows isNaN as isNaN
     * @borrows merge as merge
     * @borrows prototize as prototize
     * @borrows extendClass as extendClass
     * @borrows inherit as inherit
     * @borrows eachRange as eachRange
     * @borrows eachSince as eachSince
     * @borrows each as each
     * @borrows hasOwnProp as hasOwn
     */
    var Utils = {
        bind: bindApply,
        bindCall: bindCall,
        bindCall1: bindCall1,
        bindCallEvent: bindCallEvent,
        bindCallValue: bindCallValue,
        callOnce: callOnce,
        isDefine: isDefine,
        isString: isString,
        isArray: isArray,
        isFunction: isFunction,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isNumber: isNumber,
        isNumeric: isNumeric,
        isNaN: isNaN,
        merge: merge,
        prototize: prototize,
        extendClass: extendClass,
        inherit: inherit,
        eachRange: eachRange,
        eachSince: eachSince,
        each: each,
        hasOwnProp: hasOwn
    };
    window.Utils = Utils;

})(window, document, Math);