(
/**
 * @param {Window} window - Any value
 * @param {HTMLDocument} document - Any value
 * @param {Object} Math - Any value
 * @param {undefined} [undefined] - Any value
 */
function UtilsGlobalClosure(window, document, Math, undefined) {

    var TYPE_NUMBER = 'number';
    var TYPE_STRING = 'string';
    var TYPE_ARRAY = 'array';
    var TYPE_OBJECT = 'object';
    var TYPE_FUNCTION = 'function';
    var CONSTRUC_OBJECT = Object.prototype.constructor.toString();
    var CONSTRUC_ARRAY = Array.prototype.constructor.toString();
    var INF = Infinity || -Math.log(0);

    var hasOwnProp = Object.prototype.hasOwnProperty,
        arrProtPush = Array.prototype.push;

    /* @TODO Move to polyfill  */
    
    var isNaN = window.isNaN || Number.isNaN;
    if (!isNaN) {
        /**
         * @function isNaN
         *
         * @see Number.isNaN
         *
         * @param {*} num - Any value
         *
         * @returns {boolean}
         */
        isNaN = function isNaN(num) {
            return num !== num;
        };
    }

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
            return fn.call(context, ev, this);
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
     * DON'T USE THIS
     * -> Use Function.prototype.bind
     * 
     * @deprecated
     * 
     * @param {Function} fn - A Function
     * @param {*} context - A context
     *
     * exemple :
     * var bindable = function(){return Array.prototype.slice.call(arguments);}
     * var binded = Utils.bindArgs(bindable, null, 1, 2, 3);
     *
     * binded('4'); => [1, 2, 3, '4']
     *
     * @returns {Function}
     */
    function bindArgs(fn, context) {
        console.log('deprecated:bindArgs')
        var _i = 2, _len = arguments.length, args;
        if (_len > 2) {
            args = new Array(_len - 2);
            while (_i < _len) {
                args[_i - 2] = arguments[_i];
                _i++;
            }
        }
        return function boundArgs() {
            var cargs = [];
            // args && => Fix for IE < 10
            args && arrProtPush.apply(cargs, args);
            arrProtPush.apply(cargs, arguments);
            return fn.apply(context, cargs);
        };
    }

    /**
     * @param {Function} fn
     * @param {*} [context]
     *
     * @returns {Function}
     */
    function callOnce(fn, context){
        return (
            /**
             * @param {boolean} called
             * @param {*} [value]
             */
            function callOnceClosure(called, value){
                return function(){
                    if(!called){
                        called = true;
                        value = fn.apply(context ? context : this, arguments);
                    }
                    return value;
                }
            }
        )(false);
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
     * @param {Object.<string, Function>} methods - An list of methods
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
     * @param {Object} methods - An list of methods
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
        var _i = start, _len = Math.min(array.length, end);

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

    var createEvent = (function () {
        var EVENT_TYPE = 'createEvent', EVENTS = ['CustomEvent', 'Event'];
        for (var _i = 0, _len = EVENTS.length; _i < _len; _i++) {
            var _ev = EVENTS[_i];
            if (hasOwn(window, _ev)) {
                try {
                    new window[_ev]('test');
                    EVENT_TYPE = _ev;
                    break;
                } catch (err) {
                }
            }
        }
        var createEvent;
        switch (EVENT_TYPE) {
            case 'CustomEvent':
                createEvent = function createEvent(name, data) {
                    return new CustomEvent(name, data);
                };
                break;
            case 'Event':
                createEvent = function createEvent(name, data) {
                    return new Event(name);
                };
                break;
            case 'createEvent':
                createEvent = function createEvent(name, data) {
                    var _ev = document.createEvent('Event');
                    _ev.initEvent(name, true, true);
                    return _ev;
                };
                break;
        }

        return createEvent;
    })();


    /**
     * @typedef Event$Polyfill {{
                attach:Function,
                remove:Function,
                preventDefault:Function,
                stopProp:Function,
                stopImmeProp:Function,
                cancel:Function
            }}
     */
    var Event$Polyfill = {
        create: createEvent,
        /**
         * Polyfill addEventListener
         *
         * support >= IE7
         *
         * @param {Object} element - An HTMLElement.
         * @param {string} type - Type of event to attach.
         * @param {Function} fn - Listener function.
         */
        attach: function () {
            if (isFunction(window.addEventListener)) {
                return function attachEvent(element, type, fn) {
                    element.addEventListener(type, fn, false);
                }
            } else if (isFunction(window.attachEvent)) {
                return function attachEvent(element, type, fn) {
                    element.attachEvent('on' + type, fn);
                }
            } else {
                return function attachEvent(element, type, fn) {
                    var event = 'on' + type;
                    if (hasOwn(element, event))
                        element[event] = fn;
                    else
                        throw new Error('Event : "' + type + '" isn\'t supported in "' + element.constructor.toString() + '"');
                }
            }
        }(),
        /**
         * Polyfill removeEventListener
         *
         * support >= IE7
         *
         * @param {Object} element - An HTMLElement.
         * @param {string} type - Type of event to attach.
         * @param {Function} fn - Listener function.
         */
        remove: function () {
            if (isFunction(window.removeEventListener)) {
                return function removeEvent(element, type, fn) {
                    element.removeEventListener(type, fn, false);
                }
            } else if (isFunction(window.detachEvent)) {
                return function removeEvent(element, type, fn) {
                    element.detachEvent('on' + type, fn);
                }
            } else {
                return function removeEvent(element, type) {
                    var event = 'on' + type;
                    if (hasOwn(element, event))
                        element[event] = null;
                    else
                        throw new Error('Event : "' + type + '" isn\'t supported in "' + element.constructor.toString() + '"');
                }
            }
        }(),

        /**
         * Polyfill preventDefault
         *
         * support >= IE6
         *
         * @param {Event?} ev - Event
         */
        preventDefault: function preventDefault(ev) {
            if (ev == null) ev = window.event;

            if (ev.preventDefault) ev.preventDefault();

            ev.returnValue = false;
        },
        /**
         * Polyfill stopPropagation
         *
         * support >= IE6
         *
         * @param {Event?} ev - Event
         */
        stopProp: function stopPropagation(ev) {
            if (ev == null) ev = window.event;

            if (ev.stopPropagation) ev.stopPropagation();

            ev.cancelBubble = true;
        },
        /**
         * Polyfill stopImmediatePropagation
         *
         * support >= IE6
         *
         * @param {Event?} ev - Event
         */
        stopImmeProp: function stopImmediatePropagation(ev) {
            if (ev == null) ev = window.event;

            if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        },

        /**
         * Cancel an event.
         * Apply [preventDefault, stopPropagation, stopImmediatePropagation] to an event.
         *
         * support >= IE6
         *
         * @param {Event?} ev - Event
         */
        cancel: function cancelEvent(ev) {
            if (ev == null) ev = window.event;
            Event$Polyfill.preventDefault(ev);
            Event$Polyfill.stopProp(ev);
            Event$Polyfill.stopImmeProp(ev);
        }
    };

    /**
     * @typedef Utils {{
            bind : bindApply,
            bindCall : bindCall,
            bindCall1 : bindCall1,
            bindCallEvent : bindCallEvent,
            bindCallValue: bindCallValue,
            bindArgs : bindArgs,
            callOnce : {Function],
            isDefine : isDefine,
            isString : isString,
            isArray : isArray,
            isFunction: isFunction,
            isObject: isObject,
            isPlainObject:isPlainObject,
            isNumber: isNumber,
            isNumeric: isNumeric,
            isNaN : isNaN,
            merge : merge,
            prototize : prototize,
            eachRange : eachRange,
            eachSince : eachSince,
            each : each,
            extendClass : extendClass,
            hasOwnProp : hasOwn,
            Event : Event$Polyfill
        }}
     */
    var Utils = {
        bind: bindApply,
        bindCall: bindCall,
        bindCall1: bindCall1,
        bindCallEvent: bindCallEvent,
        bindCallValue: bindCallValue,
        bindArgs: bindArgs,
        callOnce : callOnce,
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
        hasOwnProp: hasOwn,
        Event: Event$Polyfill
    };
    window.Utils = Utils;

})(window, document, Math);
