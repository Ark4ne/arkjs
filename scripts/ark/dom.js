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
        function stringToArray(str, splitter) {
            return (isArray(str) ? str : str.split(splitter ? splitter : ' '));
        }

        var getBody = Utils.callOnce(
            /**
             * @returns {Element}
             */
            function getBody() {
                return document.body ? document.body : document.getElementsByTagName('body')[0];
            }
        );

        var getHtml = Utils.callOnce(
            /**
             * @returns {Element}
             */
            function getHtml() {
                return document.documentElement ? document.documentElement : (document.getElementsByTagName('html') ? document.getElementsByTagName('html')[0] : null);
            }
        );

        var $body = getBody();
        var $html = getHtml();

        /**
         * @param {string} tagName
         * @param {string} [className]
         * @param {SetString} [attributes]
         * @param {Node|Array|string} [content]
         *
         * @returns {HTMLElement|Element|Node}
         */
        function createElement(tagName, className, attributes, content) {
            var elem;
            if (!hasOwn(cachedElement, tagName)) {
                cachedElement[tagName] = document.createElement(tagName);
            }
            elem = cachedElement[tagName].cloneNode(false);

            if (className)
                addClass(elem, className);

            if (attributes)
                attrs(elem, attributes);

            if (content)
                content(elem, content);

            return elem;
        }

        var __addClass__, __removeClass__, __hasClass__, __toggleClass__;
        var supportClassList = isDefine($body.classList);
        if (supportClassList) {
            __addClass__ = function (clazz) {
                return this.classList.add(clazz);
            };
            __removeClass__ = function (clazz) {
                return this.classList.remove(clazz);
            };
            __hasClass__ = function (clazz) {
                return this.classList.contains(clazz);
            };
            __toggleClass__ = function (clazz) {
                return this.classList.toggle(clazz);
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
                    className.splice(arrIndexOf.call(className, clazz), 1);
                    this.className = className.join(' ').trim();
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

        var prevElementSibling = (function () {
            if (!!document.getElementsByTagName('body')[0].previousElementSibling)
            /**
             * @param {Element} currentElement
             * @returns {Element}
             */
                return function prevElementSibling(currentElement) {
                    return currentElement.previousElementSibling;
                };
            else
            /**
             * @param {Element} currentElement
             * @returns {Element}
             */
                return function prevSibling(currentElement) {
                    return currentElement.previousSibling;
                };
        }());

        var nextElementSibling = (function () {
            if (!!document.getElementsByTagName('head')[0].nextElementSibling)
            /**
             * @param {Element} currentElement
             * @returns {Element}
             */
                return function nextElementSibling(currentElement) {
                    return currentElement.nextElementSibling;
                };
            else
            /**
             * @param {Element} currentElement
             * @returns {Element}
             */
                return function nextSibling(currentElement) {
                    return currentElement.nextSibling;
                };
        }());
        var _Node_ = window['Node'];
        var _HTMLElement_ = window['HTMLElement'];
        var supportNode = isObject(_Node_) || isFunction(_Node_);
        var supportHTMLElement = isObject(_HTMLElement_) || isFunction(_HTMLElement_);

        var supportPageOffset = isDefine(window.pageXOffset);
        var supportScrollZ = isDefine(window.scrollY);
        var supportDocumentElement = (document.compatMode != null) && document.compatMode === "CSS1Compat" && ($html != null) && isDefine($html.scrollTop != null);

        /*
         * @TODO Move Win to new Modules
         */
        /**
         * @namespace Win
         */
        var Win = {};
        /**
         * Fastest get window size.
         *
         * support >= IE6
         */
        var winSize = (function ($body) {
            var height = window.innerHeight, width = window.innerWidth, windowResize;

            if (window.innerWidth && window.innerHeight) {
                windowResize = function () {
                    height = window.innerHeight;
                    width = window.innerWidth;
                };
            } else {
                height = $body.clientHeight;
                width = $body.clientWidth;
                windowResize = function () {
                    height = $body.clientHeight;
                    width = $body.clientWidth;
                };
            }

            Ark('Eventer').attach(window, 'resize', windowResize);
            /**
             * @return {Sizable}
             */
            return function winSize() {
                return {
                    height: height,
                    width: width
                }
            }
        })($body);

        /**
         * @return {Sizable}
         */
        Win.getSize = function () {
            return winSize();
        };
        Win.getScrollX = (function () {
            if (supportPageOffset) {
                return function () {
                    return window.pageXOffset;
                };
            } else if (supportScrollZ) {
                return function () {
                    return window.scrollX;
                };
            } else if (supportDocumentElement) {
                return function () {
                    return $html.scrollLeft;
                };
            } else {
                return function () {
                    return $body.scrollLeft;
                };
            }
        })();

        Win.getScrollY = (function () {
            if (supportPageOffset) {
                return function () {
                    return window.pageYOffset;
                };
            } else if (supportScrollZ) {
                return function () {
                    return window.scrollY;
                };
            } else if (supportDocumentElement) {
                return function () {
                    return $html.scrollTop;
                };
            } else {
                return function () {
                    return $body.scrollTop;
                };
            }
        })();

        Win.getScroll = function () {
            return {
                x: Win.getScrollX(),
                y: Win.getScrollY()
            };
        };

        /**
         * @param {*} node
         *
         * @return {boolean}
         */
        function isNode(node) {
            return supportNode ? node instanceof Node :
            isObject(node) && isNumber(node.nodeType) && isString(node.nodeName); // DOM2
        }

        /**
         * @param {*} elem
         *
         * @return {boolean}
         */
        function isElement(elem) {
            return supportHTMLElement ? elem instanceof HTMLElement :
            isObject(elem) && elem.nodeType === 1 && isString(elem.nodeName); // DOM2
        }

        /**
         * find if a node is in the given parent
         * @method hasParent
         * @param {Node} node
         * @param {Node} parent
         * @return {boolean} found
         */
        function hasParent(node, parent) {
            while (node) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }

        /**
         * @param {Element} node
         *
         * @returns {null|Element}
         */
        function first(node) {
            if (!node) return null;

            if (node.firstElementChild)
                return node.firstElementChild;

            var children = node.children;
            if (children && children.length > 0)
                return children[children.length - 1]
        }

        /**
         * @param {Element} node
         *
         * @returns {null|Element}
         */
        function last(node) {
            if (!node) return null;

            if (node.lastElementChild)
                return node.lastElementChild;

            var children = node.children;
            if (children && children.length > 0)
                return children[children.length - 1]
        }

        /**
         * @param {Node} elem
         *
         * @returns {Node}
         */
        function prev(elem) {
            return prevElementSibling(elem);
        }

        /**
         * @param {Node} elem
         *
         * @returns {Node}
         */
        function next(elem) {
            return nextElementSibling(elem);
        }

        /**
         * @param {Node} element
         */
        function remove(element) {
            if (isNode(element) && isNode(element.parentElement)) {
                element.parentElement.removeChild(element);
            }
        }

        /**
         * @param {Node} element
         * @param {Node} toAppend
         */
        function append(element, toAppend) {
            if (isNode(element) && isNode(toAppend)) {
                element.appendChild(toAppend);
            }
        }

        /**
         * @param {Node} element
         * @param {Node|Array|string} content
         */
        function content(element, content) {
            if (content) {
                switch (true) {
                    case isNode(content) :
                        element.appendChild(content);
                        break;
                    case Utils.isArray(content) :
                        var i = 0, len = content.length;
                        while (i < len) {
                            content(element, content[i]);
                            i++;
                        }
                        break;
                    case Utils.isString(content) :
                    default :
                        element.appendChild(document.createTextNode('' + content));
                }
            }
        }

        /**
         * @param {HTMLElement} element
         * @param {Array|string} clazz
         */
        function addClass(element, clazz) {
            var aClazz = stringToArray(clazz), i = 0, len = aClazz.length;
            while (i < len) {
                __addClass__.call(element, aClazz[i]);
                i++;
            }
        }

        /**
         * @param {HTMLElement} element
         * @param {Array|string} clazz
         */
        function removeClass(element, clazz) {
            var aClazz = stringToArray(clazz), i = 0, len = aClazz.length;
            while (i < len) {
                __removeClass__.call(element, aClazz[i]);
                i++;
            }
        }

        /**
         * @param {HTMLElement} element
         * @param {Array|string} clazz
         *
         * @returns {boolean}
         */
        function hasClass(element, clazz) {
            var aClazz = stringToArray(clazz), i = 0, len = aClazz.length, hasClass = true;
            while (i < len && hasClass) {
                hasClass = hasClass && __hasClass__.call(element, aClazz[i]);
                i++;
            }
            return hasClass && len > 0;
        }

        /**
         * @param {HTMLElement} element
         * @param {Array|string} clazz
         */
        function toggleClass(element, clazz) {
            var aClazz = stringToArray(clazz), i = 0, len = aClazz.length;
            while (i < len) {
                __toggleClass__.call(element, aClazz[i]);
                i++;
            }
        }

        /**
         * @param {Element} element
         * @param {SetString} attrs
         */
        function attrs(element, attrs) {
            if (attrs) {
                for (var key in attrs) {
                    if (hasOwn(attrs, key)) {
                        setAttr(element, key, attrs[key]);
                    }
                }
            }
        }

        /**
         * @param {HTMLElement} element
         * @param {string} key
         *
         * @returns {string}
         */
        function getAttr(element, key) {
            return __getAttribute__.call(element, key);
        }

        /**
         * @param {HTMLElement} element
         * @param {string} key
         * @param {string} value
         */
        function setAttr(element, key, value) {
            __setAttribute__.call(element, key, value);
        }

        /**
         * @param {HTMLElement} element
         * @param {string} key
         *
         * @returns {string}
         */
        function hasAttr(element, key) {
            return __hasAttribute__.call(element, key);
        }

        /**
         * @param {HTMLElement} element
         * @param {string} key
         */
        function removeAttr(element, key) {
            __removeAttribute__.call(element, key);
        }

        /**
         * @param {HTMLElement} element
         * @param {SetString} styles
         */
        function css(element, styles) {
            Utils.merge(element.style, styles);
        }

        /**
         * @param {HTMLElement} element
         * @param {string} [cssDisplay]
         */
        function show(element, cssDisplay) {
            element.style.display = Utils.isString(cssDisplay) ? cssDisplay : 'block';
        }

        /**
         * @param {HTMLElement} element
         */
        function hide(element) {
            element.style.display = 'none';
        }

        /**
         * @namespace Dom
         *
         * @borrows Win as {}
         * @borrows getBody as Function
         * @borrows getHtml as Function
         * @borrows supportClassList as boolean
         * @borrows createElem as createElement
         * @borrows isNode as isNode
         * @borrows isElement as isElement
         * @borrows hasParent as hasParent
         * @borrows first as first
         * @borrows last as last
         * @borrows prev as prev
         * @borrows next as next
         * @borrows remove as remove
         * @borrows append as append
         * @borrows content as content
         * @borrows addClass as addClass
         * @borrows removeClass as removeClass
         * @borrows hasClass as hasClass
         * @borrows toggleClass as toggleClass
         * @borrows getAttr as getAttr
         * @borrows setAttr as setAttr
         * @borrows hasAttr as hasAttr
         * @borrows removeAttr as removeAttr
         * @borrows css as css
         * @borrows show as show
         * @borrows hide: hide
         */
        var Dom = {
            Win: Win,
            getBody: getBody,
            getHtml: getHtml,
            supportClassList: supportClassList,
            createElem: createElement,
            isNode: isNode,
            isElement: isElement,
            hasParent: hasParent,
            first: first,
            last: last,
            prev: prev,
            next: next,
            remove: remove,
            append: append,
            content: content,
            addClass: addClass,
            removeClass: removeClass,
            hasClass: hasClass,
            toggleClass: toggleClass,
            attrs: attrs,
            getAttr: getAttr,
            setAttr: setAttr,
            hasAttr: hasAttr,
            removeAttr: removeAttr,
            css: css,
            show: show,
            hide: hide
        };

        return Dom;
    }

    Ark.define('Dom', factory);
})(window, document, Ark, Utils);
