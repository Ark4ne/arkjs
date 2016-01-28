(function() {
    /**
     * Polyfill Selector
     * 
     * support >= All
     * 
     * @see SizzleJS 
     */
    function Factory$$Selector(document, Utils) {
        var isFunction = Utils.isFunction;

        var fnQuerySelector = document.querySelector;
        var fnQuerySelectorAll = document.querySelectorAll;
        var fnGetElementsByClassName = document.getElementsByClassName;

        var useSizzle = !isFunction(fnQuerySelector)
                || !isFunction(fnQuerySelectorAll)
                || !isFunction(fnGetElementsByClassName);

        var __DI3Z__ = '#', __DOT__ = '.', __SPAC__ = ' ', __REG_W__ = /^\w/;

        if (useSizzle) {
            fnQuerySelector = null;
            fnQuerySelectorAll = null;
            fnGetElementsByClassName = null;
            Ark.requireJS('packages/sizzle/sizzle.js');
        }
        /**
         * @function Selector(string query, HTMLElement? context):{Array<HTMLElement>|HTMLElement|null}
         *   query startWith '#'          => Use Selector.$id
         *   query startWith '.'          => Use Selector.$class
         *   query startWith ' ' Or '\w'  => Use Selector.$queryAll
         *
         * @param {string} query
         * @param {HTMLElement?} context
         * 
         * @return {Array<HTMLElement>|HTMLElement|null}
         */
        function Selector(query, context) {
            var firstChar = query.charAt(0);
            query = query.substr(1);
            if (firstChar === __DI3Z__) {
                return Selector.$id(query);
            }
            if (firstChar === __DOT__) {
                return Selector.$class(query, context);
            }
            if (firstChar === __SPAC__ || __REG_W__.test(firstChar)) {
                return Selector.$queryAll(firstChar+query, context);
            }
            return null;
        }

        /**
         * @function $id
         * @methodOf Selector
         * @static
         * 
         * @param {string} id
         * 
         * @returns {HTMLElement}
         */
        Selector.$id = function(id) {
            return document.getElementById(id);
        };

        var Selector$Class, Selector$Query, Selector$QueryAll;
        if (useSizzle){
            /**
             * @function $class
             * @methodOf Selector
             * @static
             * 
             * @param {string} byClassName
             * @param {HTMLElement?} context
             * 
             * @returns {Array<HTMLElement>}
             */
            Selector$Class = function(byClassName, context) {
                if (context == null) {
                    context = document;
                }
                return Sizzle('.' + byClassName, context);
            };
            /**
             * @function $query
             * @methodOf Selector
             * @static
             * 
             * @param {string} byQuery
             * @param {HTMLElement?} context
             * 
             * @returns {HTMLElement}
             */
            Selector$Query = function(byQuery, context) {
                if (context == null) {
                    context = document;
                }
                return Sizzle(byQuery, context)[0];
            };
            /**
             * @function $queryAll
             * @methodOf Selector
             * @static
             * 
             * @param {string} byQueryAll
             * @param {HTMLElement?} context
             * 
             * @returns {Array<HTMLElement>}
             */
            Selector$QueryAll = function(byQueryAll, context) {
                if (context == null) {
                    context = document;
                }
                return Sizzle(byQueryAll, context);
            };
        }
        else{
            /**
             * @function $class
             * @methodOf Selector
             * @static
             * 
             * @param {string} byClassName
             * @param {HTMLElement?} context
             * 
             * @returns {Array<HTMLElement>}
             */
            Selector$Class = function(byClassName, context) {
                if (context == null) {
                    context = document;
                }
                if(context.getElementsByClassName)
                    return context.getElementsByClassName(byClassName);
                 
                return document.getElementsByClassName(byClassName);
            };
            /**
             * @function $query
             * @methodOf Selector
             * @static
             * 
             * @param {string} byQuery
             * @param {HTMLElement?} context
             * 
             * @returns {HTMLElement}
             */
            Selector$Query = function(byQuery, context) {
                if (context == null) {
                    context = document;
                }
                return fnQuerySelector.call(context, byQuery);
            };
            /**
             * @function $queryAll
             * @methodOf Selector
             * @static
             * 
             * @param {string} byQueryAll
             * @param {HTMLElement?} context
             * 
             * @returns {Array<HTMLElement>}
             */
            Selector$QueryAll = function(byQueryAll, context) {
                if (context == null) {
                    context = document;
                }
                return fnQuerySelectorAll.call(context, byQueryAll);
            };
        }

        Selector.$class = Selector$Class;
        Selector.$query = Selector$Query;
        Selector.$queryAll = Selector$QueryAll;
        
        return Selector;
    }
    Ark.define('Selector', Factory$$Selector, [ 'document', 'Utils' ]);
})();