(function(window, document) {
    if (!String.prototype.trim) {
        /**
         * @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/trim
         */
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }
    if (!Array.prototype.indexOf) {
        /**
         * @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/indexOf
         */
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            var k;
            if (this == null) {
                throw new TypeError('"this" vaut null ou n est pas défini');
            }
            var O = Object(this);
            var len = O.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
                n = 0;
            }

            if (n >= len) {
                return -1;
            }

            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            while (k < len) {
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }
    /**
     * Polyfill requestAnimationFrame & cancelAnimationFrame
     *
     * support >= IE8
     */
    (function Polyfill$$AnimationFrame() {
        var VENDORS = [ 'ms', 'moz', 'webkit', 'o'];
        var vendor,
            requestAnimationFrame = window.requestAnimationFrame,
            cancelAnimationFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;

        for (var x = 0; x < VENDORS.length && !requestAnimationFrame; ++x) {
            vendor = VENDORS[x];
            requestAnimationFrame = window[vendor
            + 'RequestAnimationFrame'];
            cancelAnimationFrame = window[vendor + 'CancelAnimationFrame']
                || window[vendor + 'CancelRequestAnimationFrame'];
        }
        if (!requestAnimationFrame) {
            var lastTime = 0;
            requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(callback, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        window.requestAnimationFrame = requestAnimationFrame;
        window.cancelAnimationFrame = cancelAnimationFrame;
    })();

    /**
     * Polyfill Promise
     *
     * support >= IE6
     */
    (function Polyfill$$Promise(){
        var promise;
        try{
            promise = new Promise(function(resolve){resolve()});
            promise.then(function(){promise = null;});
        } catch (error){
            promise = null;
            document.write('<scr'+'ipt type="text/javascript" src="packages/es6/promise.js"></scr'+'ipt>');
        }
    })();

    /**
     * Polyfill Event
     *
     * support >= IE8
     *
     (function(){
        var event;
        try{
            event = new CustomEvent('EventName', {})
        } catch (error){
            try{
                event = new Event('EventName')
            } catch (error){
                try{
                event = document.createEvent('Event')
                } catch (error){
                    event=null;
                    document.write('<scr'+'ipt type="text/javascript" src="packages/ie8/event.js"></scr'+'ipt>');
                }
            }
        }
        event=null;
    })();*/
    !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
        WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
            var target = this;

            registry.unshift([target, type, listener, function (event) {
                event.currentTarget = target;
                event.preventDefault = function () { event.returnValue = false };
                event.stopPropagation = function () { event.cancelBubble = true };
                event.target = event.srcElement || target;
                listener.call(target, event);
            }]);

            this.attachEvent("on" + type, registry[0][3]);
        };

        WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
            for (var index = 0, register; register = registry[index]; ++index) {
                if (register[0] == this && register[1] == type && register[2] == listener) {
                    return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
                }
            }
        };

        WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
            return this.fireEvent("on" + eventObject.type, eventObject);
        };
    })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

    (function(){
        var useSizzle = !(typeof document.querySelector === 'function')
            || !(typeof document.querySelectorAll === 'function')
            || !(typeof document.getElementsByClassName === 'function');

        if (useSizzle) {
            document.write('<scr'+'ipt type="text/javascript" src="packages/sizzle/sizzle.js"></scr'+'ipt>');
        }
    })();
    /**
     * Polyfill Object.keys
     *
     * support >= IE6
     */
    if (!Object.keys) {
        Object.keys = (function Polyfill$$ObjectKeys() {
            'use strict';
            var hasOwn = function hasOwn(obj, property) {
                return Object.prototype.hasOwnProperty.call(obj, property);
            };
            var hasDontEnumBug = !({
                toString : null
            }).propertyIsEnumerable('toString'), dontEnums = [ 'toString',
                'toLocaleString', 'valueOf', 'hasOwnProperty',
                'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ], dontEnumsLength = dontEnums.length;

            return function ObjectKeys(obj) {
                if (!(typeof obj === 'object') && (!(typeof obj === 'function') || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwn(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwn(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }
})(window, document);