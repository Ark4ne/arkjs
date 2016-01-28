(function (window, document, Ark, Utils) {
    function factory() {
        var isDefine = Utils.isDefine;
        var hasOwn = Utils.hasOwnProp;
        var arrIndexOf = Array.prototype.indexOf;
        var isArray = Utils.isArray;
        var isObject = Utils.isObject;
        var isFunction = Utils.isFunction;
        var isNumber = Utils.isNumber;
        var isString = Utils.isString;
        
        /**
         * @param {Array|string} str
         * @param {string} [splitter]
         *
         * @return {Array}
         */
        function stringToArray (str, splitter) {
            return (isArray(str) ? str : str.split(splitter ? splitter : ' '));
        };

        /**
         * @returns {Element}
         */
        function getBody() {
            return document.body || document.documentElement || document.getElementsByTagName('body')[0];
        }

        var __addClass__, __removeClass__, __hasClass__, __toggleClass__;
        var $body = getBody();
        var supportClassList = isDefine($body.classList);
        if (supportClassList) {
            var _add_ = $body.classList.add, _remove_ = $body.classList.remove, _has_ = $body.classList.contains, _toggle_ = $body.classList.toggle;
            __addClass__ = function (clazz) {
                _add_.call(this.classList, clazz)
            };
            __removeClass__ = function (clazz) {
                _remove_.call(this.classList, clazz)
            };
            __hasClass__ = function (clazz) {
                return _has_.call(this.classList, clazz)
            };
            __toggleClass__ = function (clazz) {
                _toggle_.call(this.classList, clazz)
            };
        } else {
            /**
             * @this {HTMLElement}
             * @param {string} clazz
             */
            __addClass__ = function (clazz) {
                if (!__hasClass__.call(this, clazz)) {
                    var className = this.className.split(' ');
                    className.push(clazz);
                    this.className = className.join(' ').trim();
                }
            };
            /**
             * @this {HTMLElement}
             * @param {string} clazz
             */
            __removeClass__ = function (clazz) {
                if (__hasClass__.call(this, clazz)) {
                    var className = this.className.split(' ');
                    this.className = className.slice(1, arrIndexOf.call(className, clazz)).join(' ').trim();
                }
            };
            /**
             * @this {HTMLElement}
             * @param {string} clazz
             *
             * @return {boolean}
             */
            __hasClass__ = function (clazz) {
                return this.className.indexOf(clazz) !== -1;
            };
            /**
             * @this {HTMLElement}
             * @param {string} clazz
             */
            __toggleClass__ = function (clazz) {
                if (__hasClass__.call(this, clazz)) {
                    __removeClass__.call(this, clazz);
                } else {
                    __addClass__.call(this, clazz);
                }
            };
        }
        var __getAttribute__, __setAttribute__, __hasAttribute__, __removeAttribute__;
        if (isDefine($body.getAttribute)) {
            __getAttribute__ = $body.getAttribute;
        } else {
            __getAttribute__ = function (key) {
                return this[key];
            }
        }
        if (isDefine($body.setAttribute)) {
            __setAttribute__ = $body.setAttribute;
        } else {
            __setAttribute__ = function (key, value) {
                this[key] = value;
            }
        }
        if (isDefine($body.hasAttribute)) {
            __hasAttribute__ = $body.hasAttribute;
        } else if (isDefine($body.getAttribute)) {
            __hasAttribute__ = function (key) {
                return isDefine(__getAttribute__.call(this, key));
            }
        }
        else {
            __hasAttribute__ = function (key) {
                return this[key] !== undefined;
            }
        }
        if (isDefine($body.removeAttribute)) {
            __removeAttribute__ = $body.removeAttribute;
        } else {
            __removeAttribute__ = function (key) {
                __setAttribute__.call(this, key, undefined);
            }
        }


        var cachedElement = {};

        function createElement(tagName, className, attributes, content) {
            var elem;
            if (!hasOwn(cachedElement, tagName)) {
                cachedElement[tagName] = document.createElement(tagName);
            }
            elem = cachedElement[tagName].cloneNode(false);

            if (className) {
                Dom.addClass(elem, className);
            }
            if (attributes) {
                for (var key in attributes) {
                    if (hasOwn(attributes, key)) {
                        Dom.setAttr(elem, key, attributes[key]);
                    }
                }
            }

            return elem;
        }

        var _Node_ = window['Node'];
        var _HTMLElement_ = window['HTMLElement'];
        var supportNode = isObject(_Node_) || isFunction(_Node_);
        var supportHTMLElement = isObject(_HTMLElement_) || isFunction(_HTMLElement_);

        /**
         * @namespace Dom
         */
        var Dom = {};

        Utils.merge(Dom, /** @lends Dom */ {
            getBody: getBody,
            createElem: createElement,
            supportClassList: supportClassList,
            /**
             * @param {*} node
             *
             * @return {boolean}
             */
            isNode: function isNode(node) {
                return supportNode ? node instanceof Node : // DOM2
                isObject(node) && isNumber(node.nodeType) && isString(node.nodeName);
            },
            /**
             * @param {*} elem
             *
             * @return {boolean}
             */
            isElement: function isElement(elem) {
                return supportHTMLElement ? elem instanceof HTMLElement : // DOM2
                isObject(elem) && elem.nodeType === 1 && isString(elem.nodeName);
            },

            /**
             * find if a node is in the given parent
             * @method hasParent
             * @param {Node} node
             * @param {Node} parent
             * @return {boolean} found
             */
            hasParent : function hasParent(node, parent) {
                while (node) {
                    if (node == parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            },

            /**
             * @param {Node} element
             */
            remove: function (element) {
                if (Dom.isNode(element) && Dom.isNode(element.parentElement)) {
                    element.parentElement.removeChild(element);
                }
            },

            /**
             * @param {Node} element
             * @param {Node} toAppend
             */
            append: function (element, toAppend) {
                if (Dom.isNode(element) && Dom.isNode(toAppend)) {
                    element.appendChild(toAppend);
                }
            },

            /**
             * @param {HTMLElement} element
             * @param {Array|string} clazz
             */
            addClass: function (element, clazz) {
                var aClazz = stringToArray(clazz), i = 0, len = aClazz.length;
                while (i < len) {
                    __addClass__.call(element, aClazz[i]);
                    i++;
                }
            },
            /**
             * @param {HTMLElement} element
             * @param {Array|string} clazz
             */
            removeClass: function (element, clazz) {
                var aClazz = stringToArray(clazz), i = 0, len = aClazz.length;
                while (i < len) {
                    __removeClass__.call(element, aClazz[i]);
                    i++;
                }
            },
            /**
             * @param {HTMLElement} element
             * @param {Array|string} clazz
             *
             * @returns {boolean}
             */
            hasClass: function (element, clazz) {
                var aClazz = stringToArray(clazz), i = 0, len = aClazz.length, hasClass = true;
                while (i < len && hasClass) {
                    hasClass = hasClass && __hasClass__.call(element, aClazz[i]);
                    i++;
                }
                return hasClass && len > 0;
            },
            /**
             * @param {HTMLElement} element
             * @param {Array|string} clazz
             */
            toggleClass: function (element, clazz) {
                var aClazz = stringToArray(clazz), i = 0, len = aClazz.length;
                while (i < len) {
                    __toggleClass__.call(element, aClazz[i]);
                    i++;
                }
            },

            /**
             * @param {HTMLElement} element
             * @param {string} key
             *
             * @returns {string}
             */
            getAttr: function (element, key) {
                return __getAttribute__.call(element, key);
            },
            /**
             * @param {HTMLElement} element
             * @param {string} key
             * @param {string} value
             */
            setAttr: function (element, key, value) {
                __setAttribute__.call(element, key, value);
            },
            /**
             * @param {HTMLElement} element
             * @param {string} key
             *
             * @returns {string}
             */
            hasAttr: function (element, key) {
                return __hasAttribute__.call(element, key);
            },
            /**
             * @param {HTMLElement} element
             * @param {string} key
             */
            removeAttr: function (element, key) {
                __removeAttribute__.call(element, key);
            },

            /**
             * @param {HTMLElement} element
             * @param {Object.<string, string>} styles
             */
            css: function (element, styles) {
                Utils.merge(element.style, styles);
            },
            /**
             * @param {HTMLElement} element
             * @param {string} [cssDisplay]
             */
            show: function (element, cssDisplay) {
                element.style.display = Utils.isString(cssDisplay) ? cssDisplay : 'block';
            },
            /**
             * @param {HTMLElement} element
             */
            hide: function (element) {
                element.style.display = 'none';
            }
        });

        return Dom;
    }

    Ark.define('Dom', factory);
})(window, document, Ark, Utils);