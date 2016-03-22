(function (window, Ark, Utils) {

    function factory() {
        var hasOwn = Utils.hasOwnProp;
        var isFunction = Utils.isFunction;

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
                    createEvent = function createEvent(name) {
                        return new Event(name);
                    };
                    break;
                case 'createEvent':
                    createEvent = function createEvent(name) {
                        var _ev = document.createEvent('Event');
                        _ev.initEvent(name, true, true);
                        return _ev;
                    };
                    break;
            }

            return createEvent;
        })();

        var __attachEvent__;
        if (isFunction(window.addEventListener)) {
            __attachEvent__ = function (element, type, fn) {
                element.addEventListener(type, fn, false);
            }
        } else if (isFunction(window.attachEvent)) {
            __attachEvent__ = function (element, type, fn) {
                element.attachEvent('on' + type, fn);
            }
        } else {
            __attachEvent__ = function (element, type, fn) {
                var event = 'on' + type;
                if (hasOwn(element, event))
                    element[event] = fn;
                else
                    throw new Error('Event : "' + type + '" isn\'t supported in "' + element.constructor.toString() + '"');
            }
        }
        /**
         * Polyfill addEventListener
         *
         * support >= IE7
         *
         * @param {Object} element - An HTMLElement.
         * @param {string} type - Type of event to attach.
         * @param {Function} fn - Listener function.
         */
        function attachEvent(element, type, fn){
            __attachEvent__(element, type, fn);
        }


        var __removeEvent__;
        if (isFunction(window.removeEventListener)) {
            __removeEvent__ = function (element, type, fn) {
                element.removeEventListener(type, fn, false);
            }
        } else if (isFunction(window.detachEvent)) {
            __removeEvent__ = function (element, type, fn) {
                element.detachEvent('on' + type, fn);
            }
        } else {
            __removeEvent__ = function (element, type) {
                var event = 'on' + type;
                if (hasOwn(element, event))
                    element[event] = null;
                else
                    throw new Error('Event : "' + type + '" isn\'t supported in "' + element.constructor.toString() + '"');
            }
        }
        /**
         * Polyfill removeEventListener
         *
         * support >= IE7
         *
         * @param {Object} element - An HTMLElement.
         * @param {string} type - Type of event to attach.
         * @param {Function} [fn] - Listener function.
         */
        function removeEvent(element, type, fn){
            __removeEvent__(element, type, fn);
        }

        /**
         * Polyfill preventDefault
         *
         * support >= IE6
         *
         * @param {Event} [ev] - Event
         */
        function preventDefault(ev) {
            if (ev == null) ev = window.event;
            if (ev == null) return;

            if (ev.preventDefault) ev.preventDefault();

            ev.returnValue = false;
        }

        /**
         * Polyfill stopPropagation
         *
         * support >= IE6
         *
         * @param {Event} [ev] - Event
         */
        function stopPropagation(ev) {
            if (ev == null) ev = window.event;
            if (ev == null) return;

            if (ev.stopPropagation) ev.stopPropagation();

            ev.cancelBubble = true;
        }

        /**
         * Polyfill stopImmediatePropagation
         *
         * support >= IE6
         *
         * @param {Event} [ev] - Event
         */
        function stopImmediatePropagation(ev) {
            if (ev == null) ev = window.event;
            if (ev == null) return;

            if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        }

        /**
         * Cancel an event.
         * Apply [preventDefault, stopPropagation, stopImmediatePropagation] to an event.
         *
         * support >= IE6
         *
         * @param {Event} [ev] - Event
         */
        function cancelEvent(ev) {
            if (ev == null) ev = window.event;
            if (ev == null) return;

            Event$Polyfill.preventDefault(ev);
            Event$Polyfill.stopProp(ev);
            Event$Polyfill.stopImmeProp(ev);
        }


        /**
         * @namespace Event$Polyfill
         *
         * @borrows create as createEvent
         * @borrows attach as attachEvent
         * @borrows remove as removeEvent
         * @borrows preventDefault as preventDefault
         * @borrows stopProp as stopPropagation
         * @borrows stopImmeProp as stopImmediatePropagation
         * @borrows cancel as cancelEvent
         */
        var Event$Polyfill = {
            create: createEvent,
            attach: attachEvent,
            remove: removeEvent,
            preventDefault: preventDefault,
            stopProp: stopPropagation,
            stopImmeProp: stopImmediatePropagation,
            cancel: cancelEvent
        };

        return Event$Polyfill;
    }

    Ark.define('Eventer', factory, [])

})(window, Ark, Utils);