(function (document, Ark, Utils) {
    /**
     *
     * @param {Selector} Selector
     * @param {Dom} Dom
     * @param {Event$Polyfill} Eventer
     *
     * @returns {ModalContent}
     */
    function factory(Selector, Dom, Eventer) {
        var body = document.documentElement,
            isArray = Utils.isArray,
            show = Dom.show,
            hide = Dom.hide,
            addClass = Dom.addClass,
            removeClass = Dom.removeClass,
            remove = Dom.remove,
            append = Dom.append;
        //isNode = Utils.isNode,
        //isElement = Utils.isElement,
        //css = Dom.css,
        // getAttr = Dom.getAttr,
        // setAttr = Dom.setAttr;

        var ModalManager = (function () {
            /**
             * @param fn
             * @param context
             * @returns {Promise}
             */
            function promiseAnimationFrame(fn, context) {
                return new Promise(function (resolve) {
                    requestAnimationFrame(function () {
                        fn.call(context);
                        setTimeout(resolve, 0);
                    });
                });
            }

            /**
             * @constructor
             */
            function __ModalManager__() {
                this.$$elem = Selector.$id('modal');
                this.$$content = Selector.$class('modal-content', this.$$elem)[0];
                this.$$back = Selector.$class('modal-backdrop', this.$$elem)[0];

                this.$con = null;

                Eventer.attach(this.$$back, 'click', Utils.bind(this.close, this));

                this.isOpen = false;
                /** @type {Eventie} */
                this.eventie = Ark('Eventie');
            }

            Utils.prototize(__ModalManager__, /** @lends {__ModalManager__.prototype} */{
                unsetContent: function () {
                    if (this.$con instanceof Modal)
                        this.$con.closing();
                    this.$con = null;
                    this.$$content.innerHTML = '';
                },
                setContent: function (content) {
                    if (content !== this.$con)
                        this.unsetContent();
                    if (content instanceof Modal)
                        this.$$content.appendChild(content.getElement());
                    else
                        this.$$content.appendChild(content);
                    this.$con = content;
                },
                /**
                 * @param content
                 * @returns {Promise}
                 */
                open: function (content) {
                    var self = this, promise;

                    promise = promiseAnimationFrame(this.opening, this);

                    promise.then(function () {
                        self.eventie.emit('modal.open', content);
                        if (content) self.setContent(content);
                        self.isOpen = true;
                    });

                    return promise;
                },
                opening: function () {
                    addClass(body, 'modal-open');
                    show(this.$$elem);
                },
                close: function () {
                    this.eventie.emit('modal.close', this.$con);
                    this.unsetContent();
                    removeClass(body, 'modal-open');
                    hide(this.$$elem);
                    this.isOpen = false;
                }
            });

            return new __ModalManager__();
        })();


        /**
         * @constructor
         */
        function Modal() {
            this.isOpen = false;
            this.$elem = null;
            this.autoDispose = true;
            /** @type {Eventie} */
            this.eventie = Ark('Eventie');

            this.opened = Utils.bindCall(this.opened, this);
        }

        Utils.prototize(Modal, /** @lends {Modal.prototype} */{
            /**
             * @returns {Promise}
             */
            open: function () {
                var promise = ModalManager.open(this);
                promise.then(this.opened);
                return promise;
            },
            opened: function () {
                this.isOpen = true;
                this.eventie.emit("open");
            },
            /**
             * @returns {Modal}
             */
            close: function () {
                ModalManager.close();
                this.isOpen = false;
                return this;
            },
            closing: function () {
                this.eventie.emit("close");
                if (this.autoDispose) {
                    this.dispose();
                }
            },
            /**
             * @param {Function} callback
             * @returns {Modal}
             */
            onOpen: function (callback) {
                this.eventie.on("open", callback);
                return this;
            },
            /**
             * @param {Function} callback
             * @returns {Modal}
             */
            onClose: function (callback) {
                this.eventie.on("close", callback);
                return this;
            },
            /**
             * @returns {Element|DocumentFragment}
             */
            getElement: function () {
                if (this.$elem)
                    return this.$elem;
                else
                    return document.createDocumentFragment();
            },
            dispose: function () {
                remove(this.$elem);
                this.$elem = null;
            },
            destroy: function () {
                this.dispose();
                this.eventie.destroy();
                this.eventie = null;
            }
        });

        /**
         * @static
         * @type {ModalManager}
         */
        Modal.Manager = ModalManager;

        /**
         * @param {string} sClass
         * @param {Node} child
         * @returns {Node}
         */
        var createDiv = function (sClass, child) {
            var div = Dom.createElem('DIV', sClass);
            div.appendChild(child);
            return div;
        };

        /**
         * @constructor
         * @extends {Modal}
         *
         * @param body
         * @param header
         * @param btnFooter
         */
        function ModalContent(body, header, btnFooter) {
            ModalContent.__super__.constructor.call(this);
            this.$h = null;
            this.$b = null;
            this.$f = null;

            this.setHeader(header);
            this.setBody(body);
            this.setFooter(btnFooter);
        }

        Utils.inherit(ModalContent, Modal, /** @lends {ModalContent.prototype} */{
            setBody: function (elem, immediateApply) {
                if (elem) {
                    this.$b = createDiv('modal-body', elem);
                    if (immediateApply === true) {
                        ModalManager.setContent(this);
                    }
                } else
                    this.$b = null;
                return this;
            },
            setHeader: function (elem) {
                if (elem) {
                    this.$h = createDiv('modal-header', elem);
                } else
                    this.$h = null;
                return this;
            },
            setFooter: function (buttons) {
                if (!Utils.isDefine(buttons)) {
                    buttons = []
                }
                else if (!isArray(buttons)) {
                    buttons = [buttons]
                }

                buttons.push({
                    inner: 'Close',
                    action: Utils.bindCall(this.close, this)
                });

                var i = 0, len = buttons.length, button, btn;
                var docFrag = document.createDocumentFragment();

                while (i < len) {
                    /**
                     * @type {{action : Function, inner : string, btnClass : string}}
                     */
                    button = buttons[i];
                    if (Dom.isElement(button)) {
                        btn = button;
                    } else {
                        btn = Dom.createElem('BUTTON', "btn btn-" + (button.btnClass ? button.btnClass : 'default'));
                        btn.innerHTML = button.inner;
                        Dom.setAttr(btn, 'type', 'button');
                        Utils.isFunction(button.action) && Eventer.attach(btn, 'click', button.action);
                        append(docFrag, btn);
                    }
                    append(docFrag, btn);
                    i++;
                }

                this.$f = createDiv('modal-footer', docFrag);
                return this;
            },
            getElement: function () {
                this.$elem = ModalContent.__super__.getElement.call(this);
                append(this.$elem, this.$h);
                append(this.$elem, this.$b);
                append(this.$elem, this.$f);
                return this.$elem;
            },
            dispose: function () {
                remove(this.$h);
                remove(this.$b);
                remove(this.$f);
                this.$h = null;
                this.$b = null;
                this.$f = null;

                ModalContent.__super__.dispose.call(this);
            }
        });


        Ark.define('ModalNautili',
            /**
             * @param {Nautilus} Nautilus
             */
            function (Nautilus) {
                /**
                 * @constructor
                 * @extends {ModalContent}
                 */
                function ModalNautili(url, title, obj) {
                    ModalNautili.__super__.constructor.call(this);
                    this.modClosing = Utils.bindCall(this.modClosing, this);
                    this.onOpen((function (_this) {
                        return function () {
                            Nautilus.pushHash(url, obj, document.documentElement.title + ' : ' + title);
                            Nautilus.onChange(_this.modClosing);
                        }
                    }(this)));
                    this.onClose((function (_this) {
                        return function () {
                            Nautilus.offChange(_this.modClosing);
                            Nautilus.goFirst();
                        }
                    }(this)));
                }

                return Utils.inherit(ModalNautili, ModalContent, /** @lends {ModalNautili.prototype} */ {
                    modClosing: function () {
                        this.close();
                    }
                });
            }, ['Nautilus']);

        return ModalContent;
    }

    Ark.define('Modal', factory, ['Selector', 'Dom', 'Eventer']);
})(document, Ark, Utils);