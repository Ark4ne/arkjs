(function () {
    function factory(Selector, document, Dom) {
        var body = document.documentElement,
            isNode = Utils.isNode,
            isElement = Utils.isElement,
            css = Dom.css,
            show = Dom.show,
            hide = Dom.hide,
            addClass = Dom.addClass,
            removeClass = Dom.removeClass,
            remove = Dom.remove,
            append = Dom.append,
            getAttr = Dom.getAttr,
            setAttr = Dom.setAttr;

        /**
         * @param fn
         * @param context
         * @returns {Promise}
         */
        function promiseAnimationFrame(fn, context){
            var promise = new Promise(function(resolve){
                requestAnimationFrame(function(){
                    fn.call(context);
                    setTimeout(resolve, 0);
                });
            });
            return promise;
        }

        var ModalManager = (function () {
            /**
             * @constructor
             */
            function __ModalManager__() {
                this.$$elem = Selector.$id('modal');
                this.$$content = Selector.$class('modal-content', this.$$elem)[0];
                this.$$back = Selector.$class('modal-backdrop', this.$$elem)[0];

                this.$con = null;

                Utils.Event.attach(this.$$back, 'click', Utils.bind(this.close, this));

                this.isOpen = false;
            }

            Utils.prototize(__ModalManager__, /** @lends {__ModalManager__.prototype} */{
                unsetContent: function () {
                    if (this.$con instanceof Modal)
                        this.$con.closing();
                    this.$con = null;
                    this.$$content.innerHTML = '';
                },
                setContent: function (content) {
                    if(content !== this.$con)
                        this.unsetContent();
                    if (content instanceof Modal)
                        this.$$content.appendChild(content.getElement());
                    else
                        this.$$content.appendChild(content);
                    this.$con = content;
                },
                open: function (content) {
                    var self = this, promise;
                    promise =  promiseAnimationFrame(function(){
                        addClass(body, 'modal-open');
                        show(this.$$elem);
                    }, this);

                    promise.then(function(){

                        if (content) self.setContent(content);
                        self.isOpen = true;
                    });

                    return promise;
                },
                close: function () {
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
        }

        Utils.prototize(Modal, /** @lends {Modal.prototype} */{
            open: function () {
                var promise = ModalManager.open(this), self = this;
                promise.then(function(){
                    self.isOpen = true;
                });
                return promise;
            },
            close: function () {
                ModalManager.close();
                this.isOpen = false;
                return this;
            },
            closing : function(){
                if(this.autoDispose){
                    this.dispose();
                }
            },
            getElement: function () {
                if (this.$elem)
                    return this.$elem;
                else
                    return document.createDocumentFragment();
            },
            dispose: function () {
                remove(this.$elem);
                this.$elem = null;
            }
        });

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
            ModalContent.__super__.constructor.apply(this, arguments);
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
                    if(immediateApply===true){
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
                if(!Utils.isDefine(buttons)){
                    buttons = []
                }
                else if(!isArray(buttons)){
                    buttons = [buttons]
                }

                buttons.push({
                    inner :'Close',
                    action:Utils.bindCall(this.close, this)
                });

                var i = 0, len = buttons.length, button, btn;
                var docFrag = document.createDocumentFragment();

                while (i < len) {
                    button = buttons[i];
                    if(Dom.isElement(button)){
                        btn = button;
                    } else {
                        btn = Dom.createElem('BUTTON', "btn btn-" + (button.btnClass ? button.btnClass : 'default'));
                        btn.innerHTML = button.inner;
                        btn.type = "button";
                        Utils.isFunction(button.action) && Utils.Event.attach(btn, 'click', button.action);
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

        return ModalContent;
    }

    Ark.define('Modal', factory, ['Selector', 'document', 'Dom']);
})();