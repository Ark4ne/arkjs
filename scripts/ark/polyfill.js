(function(window, document, navigator) {
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

            // 1. Soit O le résultat de l'appel à ToObject avec
            //    this en argument.
            if (this == null) {
              throw new TypeError('"this" vaut null ou n est pas défini');
            }

            var O = Object(this);

            // 2. Soit lenValue le résultat de l'appel de la
            //    méthode interne Get de O avec l'argument
            //    "length".
            // 3. Soit len le résultat de ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. Si len vaut 0, on renvoie -1.
            if (len === 0) {
              return -1;
            }

            // 5. Si l'argument fromIndex a été utilisé, soit
            //    n le résultat de ToInteger(fromIndex)
            //    0 sinon
            var n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
              n = 0;
            }

            // 6. Si n >= len, on renvoie -1.
            if (n >= len) {
              return -1;
            }

            // 7. Si n >= 0, soit k égal à n.
            // 8. Sinon, si n<0, soit k égal à len - abs(n).
            //    Si k est inférieur à 0, on ramène k égal à 0.
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 9. On répète tant que k < len
            while (k < len) {
              // a. Soit Pk égal à ToString(k).
              //    Ceci est implicite pour l'opérande gauche de in
              // b. Soit kPresent le résultat de l'appel de la
              //    méthode interne HasProperty de O avec Pk en
              //    argument. Cette étape peut être combinée avec
              //    l'étape c
              // c. Si kPresent vaut true, alors
              //    i.  soit elementK le résultat de l'appel de la
              //        méthode interne Get de O avec ToString(k) en
              //        argument
              //   ii.  Soit same le résultat de l'application de
              //        l'algorithme d'égalité stricte entre
              //        searchElement et elementK.
              //  iii.  Si same vaut true, on renvoie k.
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
            requestAnimationFrame = function (callback, element) {
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
     */
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
            }
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
}).call(this, window, document, navigator);