(function (window, document, Math, Ark, Utils) {
    /**
     * @param {Hammer} Hammer
     * @param {Nautilus} Nautilus
     * @param {Support} Support
     * @param {Selector} Selector
     * @param {Function} TickAnimationFrame
     * @param {Event$Polyfill} Eventer
     *
     * @returns {Photify}
     */
    function factory(Hammer, Nautilus, Support, Selector, TickAnimationFrame, Eventer) {
        /** @typedef {{srcEvent: Event, isFinal: boolean, deltaX: number, deltaY: number, scale: number}} HammerEvent */
        var prototize = Utils.prototize;
        var bindCall = Utils.bindCall;
        var bindCall1 = Utils.bindCall1;
        var bindCallEvent = Utils.bindCallEvent;
        var merge = Utils.merge;

        var attachEvent = Eventer.attach;
        var removeEvent = Eventer.remove;
        /** @type {Dom} */
        var Dom = Ark('Dom');
        var addClass = Dom.addClass,
            removeClass = Dom.removeClass,
            getAttr = Dom.getAttr,
            //setAttr = Dom.setAttr,
            winSize = Dom.Win.getSize;
        //var requestAnimationFrame = window.requestAnimationFrame;
        var MOBILE_DEVICE = Support('isMobileDevice');
        var supportCss3d = Support('Css3d');
        //var supportDomClassList = Support('DomClassList');
        var EMPTY_CSS = {
            position: "",
            height: "",
            width: "",
            top: "",
            left: "",
            zIndex: "",
            touchAction: "",
            webkitTransform: "",
            mozTransform: "",
            transform: ""
        };

        var EVENT_NAME_MOUSE_WHEEL = "mousewheel";
        var EVENT_NAME_MOUSE_SCROLL = "DOMMouseScroll";

        function attachEventMouseWheel(element, mouseWheelHandler) {
            // IE9, Chrome, Safari, Opera
            attachEvent(element, EVENT_NAME_MOUSE_WHEEL, mouseWheelHandler, false);
            // Firefox
            attachEvent(element, EVENT_NAME_MOUSE_SCROLL, mouseWheelHandler, false);
        }

        function detachEventMouseWheel(element, mouseWheelHandler) {
            // IE9, Chrome, Safari, Opera
            removeEvent(element, EVENT_NAME_MOUSE_WHEEL, mouseWheelHandler, false);
            // Firefox
            removeEvent(element, EVENT_NAME_MOUSE_SCROLL, mouseWheelHandler, false);
        }

        /** @const {number} */
        var POS_CENTER = 0;
        /** @const {number} */
        var POS_LEFT = 1;
        /** @const {number} */
        var POS_RIGHT = 2;

        /**
         * @param {HTMLImageElement} img
         * @constructor
         */
        function ImgManaged(img) {
            this.img = img;
            /** @type {{height : number, width : number, tx: number, ty: number, zo: number}} */
            this.opts = {
                height: 0,
                width: 0,
                tx: 0,
                ty: 0,
                zo: 0
            };
            this.position = POS_CENTER;

            this.render = TickAnimationFrame(this.__render, this);
            }

        prototize(ImgManaged, /** @lends ImgManaged.prototype */{
            /**
             * @private
             */
            __render: function () {
                var value, tx = this.opts.tx, ty = this.opts.ty, zo = this.opts.zo;
                if (supportCss3d) {
                    value = [
                        'translate3d(' + tx + 'px, ' + ty + 'px, 0)',
                        'scale3d(' + zo + ', ' + zo + ', 1)'
                    ].join(' ');
                } else {
                    value = [
                        'translate(' + tx + 'px, ' + ty + 'px)',
                        'scale(' + zo + ', ' + zo + ')'
                    ].join(' ');
                }

                var elStyle = this.img.style;
                elStyle.webkitTransform = value;
                elStyle.mozTransform = value;
                elStyle.msTransform = value;
                elStyle.oTransform = value;
                elStyle.transform = value;
            },
            /**
             *
             * @returns {ImgManaged}
             */
            render: function () {
                this.__render();
                return this;
            },
            /**
             * @param {number} x
             * @param {number} y
             *
             * @returns {ImgManaged}
             */
            move: function (x, y) {
                this.opts.tx = x;
                this.opts.ty = y;
                return this;
            },
            /**
             * @param {number} scale
             *
             * @returns {ImgManaged}
             */
            zoom: function (scale) {
                this.opts.zo = scale;
                return this;
            },
            /**
             * @param {number} x
             * @param {number} y
             * @param {number} scale
             *
             * @returns {ImgManaged}
             */
            transform: function (x, y, scale) {
                return this.move(x, y).zoom(scale);
            },
            /**
             * @param {Sizable} container
             * @param {number} [height]
             * @param {number} [width]
             *
             * @returns {Sizable}
             */
            sizeToFit: function (container, height, width) {
                var wH = container.height,
                    wW = container.width,
                    iH = height ? height : this.img.naturalHeight,
                    iW = width ? width : this.img.naturalWidth,
                    wR = wH / wW, iR = iH / iW,
                    h, w;
                if (wR < iR) {
                    h = wH;
                    w = h * iW / iH;
                } else {
                    w = wW;
                    h = w * iH / iW;
                }
                return {height: h, width: w};
            },
            /**
             * @param {Sizable} container
             * @param {number} [height]
             * @param {number} [width]
             *
             * @returns {ImgManaged}
             */
            size: function (container, height, width) {
                var size = this.sizeToFit(container, height, width);
                merge(this.opts, size);
                merge(this.img.style, size);

                return this;
            },
            /**
             * @param {Sizable} container
             * @param {number} [height]
             * @param {number} [width]
             * @param {number} [position]
             *
             * @returns {ImgManaged}
             */
            fit: function (container, height, width, position) {
                var size = this.sizeToFit(container, height, width);
                this.position = position;
                merge(this.opts, size);
                merge(this.img.style, {
                    position: 'fixed',
                    height: size.height + 'px',
                    width: size.width + 'px',
                    top: (container.height / 2 - size.height / 2) + 'px',
                    zIndex: 3333333
                });
                return this.moveToOrigin(container);
            },
            /**
             * @param {Sizable} container
             *
             * @returns {ImgManaged}
             */
            moveToOrigin : function (container) {
                var posLeft, width = this.opts.width;
                switch (this.position) {
                    case POS_LEFT :
                        this.position = POS_LEFT;
                        posLeft = (-container.width - width) + 'px';
                        break;
                    case POS_RIGHT :
                        this.position = POS_RIGHT;
                        posLeft = (container.width + width) + 'px';
                        break;
                    case POS_CENTER :
                    default:
                        this.position = POS_CENTER;
                        posLeft = (container.width / 2 - width / 2) + 'px';
                }
                merge(this.img.style, {
                    left: posLeft
                });

                return this;
            },
            /**
             * @param {Object} styles
             *
             * @returns {ImgManaged}
             */
            css: function (styles) {
                merge(this.img.style, styles);

                return this;
            },
            /**
             * @param {string} clazz
             *
             * @returns {ImgManaged}
             */
            addClass: function (clazz) {
                addClass(this.img, clazz);

                return this;
            },
            /**
             * @param {string} clazz
             *
             * @returns {ImgManaged}
             */
            removeClass: function (clazz) {
                removeClass(this.img, clazz);

                return this;
            },
            /**
             * TODO
             * @returns {Node|null}
             */
            next: function () {
                var parent = this.img.parentNode.parentNode;
                var next = Dom.next(parent);

                if (next) return Dom.first(Dom.first(next));

                next = Dom.next(parent.parentNode);
                if (next) return Dom.first(Dom.first(Dom.first(next)));

                return null;
            },
            /**
             * TODO
             * @returns {Node|null}
             */
            prev: function () {
                var parent = this.img.parentNode.parentNode;
                var prev = Dom.prev(parent);

                if (prev) return Dom.first(Dom.first(prev));

                prev = Dom.prev(parent.parentNode);
                if (prev) return Dom.first(Dom.first(Dom.first(prev)));

                return null;
            },
            destroy: function () {
                this.css(EMPTY_CSS);
                this.opts = null;
                this.img = null;
            }
        });

        /**
         * @constructor
         */
        function Photify() {
            this.$$container = Selector.$class('photify')[0];

            this.clickEvElem = bindCallEvent(this.clickEvElem, this);
            this.mouseWheel = bindCallEvent(this.mouseWheel, this);

            this.smoothResetEnd = bindCall(this.smoothResetEnd, this);
            this.tap = bindCall1(this.tap, this);
            this.__tap = bindCall(this.__tap, this);
            this.doubleTap = bindCall1(this.doubleTap, this);
            this.panHandle = bindCall1(this.panHandle, this);
            this.panEnd = bindCall1(this.panEnd, this);
            this.pinchStart = bindCall1(this.pinchStart, this);
            this.pinchHandle = bindCall1(this.pinchHandle, this);
            this.pinchEnd = bindCall1(this.pinchEnd, this);

            this.close = bindCall(this.close, this);
            this.render = TickAnimationFrame(this.render, this);
            /**
             * @type {{trans: {x: number, y: number}, ltrans: {x: number, y: number}, mtrans: {x: number, y: number}, scale: number, lscale: number, img: {h: number, w: number}}}
             */
            this.opts = {
                trans: {x: 0, y: 0},
                ltrans: {x: 0, y: 0},
                mtrans: {x: 0, y: 0},
                scale: 1,
                lscale: 1,
                img: {h: 0, w: 0}
            };

            /** @type {ImgManaged} */
            this.elem = null;
            /** @type {ImgManaged} */
            this.elemPrev = null;
            /** @type {ImgManaged} */
            this.elemNext = null;

            /** @type {boolean} */
            this.tick = false;
            /** @type {boolean} */
            this.isOpen = false;
            /** @type {boolean} */
            this.$$hmOn = false;

            this.tapped = null;
            this.wheelTimer = null;
            this.smoothResetEndT = null;
        }

        prototize(Photify, /** @lends {Photify.prototype} */{
            next: function () {
                if (this.isOpen && this.elemNext) {
                    var wSize = winSize(), next, elemSize;
                    if (this.elemPrev) {
                        this.elemPrev.destroy();
                        this.elemPrev = null;
                    }
                    this.elemPrev = this.elem.removeClass('photifies');
                    this.elem = this.elemNext.addClass('photifies');
                    elemSize = this.elem.sizeToFit(wSize);
                    this.opts.img.h = elemSize.height;
                    this.opts.img.w = elemSize.width;

                    if (next = this.elem.next()) {
                        this.elemNext = new ImgManaged(next);
                        this.elemNext.fit(wSize, undefined, undefined, POS_RIGHT).transform(0,0,1).__render()
                    }
                    this.elem.fit(wSize, undefined, undefined, POS_CENTER).transform(0,0,1).__render();
                    this.elemPrev.fit(wSize, undefined, undefined, POS_LEFT).transform(0,0,1).__render()
                }
            },
            prev: function () {
                if (this.isOpen && this.elemPrev) {
                    var wSize = winSize(), prev, elemSize;
                    if (this.elemNext) {
                        this.elemNext.destroy();
                        this.elemNext = null;
                    }
                    this.elemNext = this.elem.removeClass('photifies');
                    this.elem = this.elemPrev.addClass('photifies');
                    elemSize = this.elem.sizeToFit(wSize);
                    this.opts.img.h = elemSize.height;
                    this.opts.img.w = elemSize.width;
                    if (prev = this.elem.prev()) {
                        this.elemPrev = new ImgManaged(prev);
                        this.elemPrev.fit(wSize, undefined, undefined, POS_LEFT).transform(0,0,1).__render()
                    }
                    this.elem.fit(wSize, undefined, undefined, POS_CENTER).transform(0,0,1).__render();
                    this.elemNext.fit(wSize, undefined, undefined, POS_RIGHT).transform(0,0,1).__render()
                }
            },
            /**
             * @method open
             *
             * @param elem
             * @param height
             * @param width
             */
            open: function (elem, height, width) {
                if (!this.isOpen) {
                    this.resetOpts();
                    this.isOpen = true;
                    addClass(document.documentElement, 'modal-open');
                    addClass(this.$$container, 'open');
                    this.setElem(elem, height, width);
                    this.attachHammer();

                    Nautilus.pushHash("photify", {}, '');
                    Nautilus.onChange(this.close);
                }
            },
            /**
             * @method close
             */
            close: function () {
                if (this.isOpen) {
                    this.isOpen = false;
                    removeClass(this.$$container, 'open');
                    removeClass(document.documentElement, 'modal-open');
                    this.detachHammer();
                    this.clearElem();
                    this.resetOpts();
                    Nautilus.offChange(this.close);
                    Nautilus.goFirst();
                }
            },
            /**
             * @method toggle
             *
             * @param {HTMLImageElement} elem
             * @param {number} height
             * @param {number} width
             */
            toggle: function (elem, height, width) {
                if (this.elem !== elem) {
                    this.open(elem, height, width);
                } else {
                    this.requestClose();
                }
            },
            /**
             * @method resetOpts
             */
            resetOpts: function () {
                this.tick = false;
                this.isOpen = false;
                this.smoothResetEndT = null;
                this.opts = {
                    trans: {x: 0, y: 0},
                    ltrans: {x: 0, y: 0},
                    mtrans: {x: 0, y: 0},
                    scale: 1,
                    lscale: 1,
                    img: {h: 0, w: 0},
                    smooth: false
                };
            },
            /**
             * @method requestClose
             */
            requestClose: function () {
                this.close();
            },
            /**
             * @method attachElem
             *
             * @param elem
             */
            attachElem: function (elem) {
                attachEvent(elem, 'click', this.clickEvElem);
            },
            /**
             * @method detachElem
             *
             * @param elem
             */
            detachElem: function (elem) {
                removeEvent(elem, 'click', this.clickEvElem);
            },
            /**
             * @method clickEvElem
             *
             * @param ev
             * @param img
             */
            clickEvElem: function (ev, img) {
                if (ev == null) ev = window.event;
                var button = (ev.button || ev.which);
                if (button != null && button != 1) return;

                if (this.isOpen !== true) {
                    this.open(img, img.height, img.width);
                    if (img.src !== getAttr(img, 'data-url-hd')) {
                        img.src = getAttr(img, 'data-url-hd');
                    }
                } else
                    Eventer.cancel(ev);

            },
            /**
             * @method mouseWheel
             *
             * @param {Event|HammerEvent} ev
             */
            mouseWheel: function (ev) {
                Eventer.preventDefault(ev);
                if (this.wheelTimer) {
                    clearTimeout(this.wheelTimer);
                }
                this.opts.lscale = this.opts.scale = this.opts.lscale + ((ev.wheelDelta || ev.detail) > 0 ? 0.1 : -0.1);

                this.posMaxUpdate();
                this.posLimit();
                this.render();
                if (this.opts.scale < 1) {
                    this.wheelTimer = setTimeout(bindCall(this.reset, this), 100);
                }
            },
            /**
             * @method setElem
             *
             * @param {HTMLImageElement} elem
             * @param {number} height
             * @param {number} width
             */
            setElem: function (elem, height, width) {
                var wSize = winSize(), prev, next;

                this.elem = new ImgManaged(elem);
                if ((prev = this.elem.prev())) {
                    this.elemPrev = new ImgManaged(prev);
                    this.elemPrev.fit(wSize, undefined, undefined, POS_LEFT);
                }

                if ((next = this.elem.next())) {
                    this.elemNext = new ImgManaged(next);
                    this.elemNext.fit(wSize, undefined, undefined, POS_RIGHT);
                }

                var elemSize = this.elem.addClass('photifies').sizeToFit(wSize, height, width);
                this.opts.img.h = elemSize.height;
                this.opts.img.w = elemSize.width;
                this.elem.fit(wSize, height, width);

                this.posMaxUpdate();
            },
            /**
             * @method clearElem
             */
            clearElem: function () {
                if (this.elemPrev) {
                    this.elemPrev.css(EMPTY_CSS).destroy();
                    this.elemPrev = null;
                }
                if (this.elemNext) {
                    this.elemNext.css(EMPTY_CSS).destroy();
                    this.elemNext = null;
                }
                this.smoothResetEnd();
                if (this.smoothResetEndT)
                    clearTimeout(this.smoothResetEndT);
                this.smoothResetEndT = null;
                this.elem.css(EMPTY_CSS)
                    .removeClass('photifies')
                    .destroy();
                this.elem = null;
            },
            /**
             * @method attachHammer
             */
            attachHammer: function () {
                if (this.$$hm == null) {
                    this.$$hm = new Hammer.Manager(document.body);
                    var pan = new Hammer.Pan({pointers: 0, threshold: 0});
                    var pinch = new Hammer.Pinch({threshold: 0});
                    var singleTap = new Hammer.Tap({event: 'tap', taps: 1, threshold: 2, interval: 250, time: 200});
                    this.$$hm.add([
                        pinch,
                        pan,
                        singleTap
                    ]);

                    pinch.recognizeWith(pan);
                } else {
                    this.offHammer();
                }
                this.onHammer();
            },
            /**
             * @method detachHammer
             */
            detachHammer: function () {
                this.offHammer();
                this.$$hm.destroy();
                this.$$hm = null;
                document.body.style.touchAction = null
            },
            /**
             * @method onHammer
             */
            onHammer: function () {
                if (!this.$$hmOn) {
                    !MOBILE_DEVICE && attachEventMouseWheel(document.body, this.mouseWheel);
                    this.$$hm.on("tap", this.tap);
                    this.$$hm.on("panmove", this.panHandle);
                    this.$$hm.on("panend", this.panEnd);
                    this.$$hm.on("pinchstart", this.pinchStart);
                    this.$$hm.on("pinchmove", this.pinchHandle);
                    this.$$hm.on("pinchend", this.pinchEnd);
                    this.$$hmOn = true;
                }
            },
            /**
             * @method offHammer
             */
            offHammer: function () {
                if (this.$$hmOn) {
                    !MOBILE_DEVICE && detachEventMouseWheel(document.body, this.mouseWheel);
                    this.$$hm.off("tap", this.tap);
                    this.$$hm.off("panmove", this.panHandle);
                    this.$$hm.off("panend", this.panEnd);
                    this.$$hm.off("pinchstart", this.pinchStart);
                    this.$$hm.off("pinchmove", this.pinchHandle);
                    this.$$hm.off("pinchend", this.pinchEnd);
                    this.$$hmOn = false;
                }
            },

            /**
             * @method posMaxUpdate
             */
            posMaxUpdate: function () {
                var wSize, size, scale = this.opts.scale;
                wSize = winSize();
                size = this.opts.img;
                this.opts.mtrans.x = Math.abs(Math.floor((size.w * scale / 2) - (wSize.width / 2)));
                this.opts.mtrans.y = Math.abs(Math.floor((size.h * scale / 2) - (wSize.height / 2)));
            },
            /**
             * @method posLimit
             */
            posLimit: function () {
                if (Math.abs(this.opts.trans.x) > this.opts.mtrans.x) {
                    this.opts.trans.x = this.opts.mtrans.x * (this.opts.trans.x > 0 ? 1 : -1);
                    this.opts.smooth = true;
                }
                if (Math.abs(this.opts.trans.y) > this.opts.mtrans.y) {
                    this.opts.trans.y = this.opts.mtrans.y * (this.opts.trans.y > 0 ? 1 : -1);
                    this.opts.smooth = true;
                }
                if (this.opts.img.w * this.opts.scale < winSize().width) {
                    this.opts.trans.x = 0;
                    this.opts.smooth = true;
                }
            },
            /**
             * @private
             */
            __tap: function () {
                this.tapped = null;
                if (this.opts.scale !== 1) {
                    this.reset();
                } else {
                    this.requestClose();
                }
            },
            /**
             * @param {HammerEvent} ev
             */
            tap: function (ev) {
                Eventer.cancel(ev.srcEvent);

                if (this.tapped) {
                    clearTimeout(this.tapped);
                    this.tapped = null;
                    this.doubleTap(ev);
                } else {
                    this.tapped = setTimeout(this.__tap, 250);
                }
            },
            /**
             * @param {HammerEvent} ev
             */
            doubleTap: function (ev) {
                Eventer.cancel(ev.srcEvent);
                if (this.opts.scale >= 2) {
                    this.reset();
                } else {
                    this.opts.scale = 2;
                    this.opts.smooth = true;
                    this.posMaxUpdate();
                    this.render();
                }
            },
            /**
             * @param {HammerEvent} ev
             */
            panHandle: function (ev) {
                this.opts.trans.x = this.opts.ltrans.x + ev.deltaX;
                if (this.opts.scale !== 1) {
                    this.opts.trans.y = this.opts.ltrans.y + ev.deltaY;
                    //this.posLimit();
                }
                if (ev.isFinal) {
                    return this.eventFinal(ev);
                }

                /*
                var containerWidth, imgWidth, changePosX, preview, posX, to;
                posX = this.opts.trans.x;
                containerWidth = winSize().width;
                imgWidth = this.opts.img.w * this.opts.scale;
                if (imgWidth < containerWidth) {
                    changePosX = Math.max(110, 0.196428571 * containerWidth - 31.42857143) < Math.abs(posX);
                }
                preview = changePosX || false;
                if (preview && posX > 1 && this.elemPrev) {
                    to = posX - imgWidth / 2 - this.elemPrev.opts.width / 2 - 30;


                    this.elemPrev(containerWidth);
                }
                 if (preview && pos_x > 1) {
                 to = pos_x - viewerWidth / 2 - self.$$imgPrev.size.width / 2 - 30;
                 if (mobile) {
                 self.$$imgPrev.move(to, 0);
                 } else {
                 self.$$imgPrev.$$anim(to, -containerWidth, 300);
                 }
                 self.$$imgNext.$$$reset(containerWidth);
                 changeElement = changePosX ? -1 : null;
                 }
                 if (preview && pos_x < -1) {
                 to = pos_x + viewerWidth / 2 + self.$$imgNext.size.width / 2 + 30;
                 if (mobile) {
                 self.$$imgNext.move(to, 0);
                 } else {
                 self.$$imgNext.$$anim(to, containerWidth, 300);
                 }
                 self.$$imgPrev.$$$reset(-containerWidth);
                 changeElement = changePosX ? 1 : null;
                 }
                 if (!preview) {
                 self.$$imgNext.$$$reset(containerWidth);
                 self.$$imgPrev.$$$reset(-containerWidth);
                 changeElement = null;
                 }
                 */
                this.render();
            },
            /**
             * @param {HammerEvent} ev
             */
            panEnd: function (ev) {
                this.opts.trans.x = this.opts.ltrans.x + ev.deltaX;
                if (this.opts.scale !== 1) {
                    this.opts.trans.y = this.opts.ltrans.y + ev.deltaY;
                }
                this.posLimit();
                this.opts.ltrans = {
                    x: this.opts.trans.x,
                    y: this.opts.trans.y
                };
                if (ev.isFinal) {
                    return this.eventFinal(ev);
                }
                this.render();
            },
            /**
             * @param {HammerEvent} ev
             */
            pinchStart: function (ev) {
                this.opts.lscale = this.opts.scale;

                return this.pinchHandle(ev);
            },
            /**
             * @param {HammerEvent} ev
             */
            pinchHandle: function (ev) {
                this.opts.scale = this.opts.lscale * ev.scale;
                this.posMaxUpdate();
                if (ev.isFinal) {
                    return this.eventFinal(ev);
                }
                this.render();
            },
            /**
             * @param {HammerEvent} ev
             */
            pinchEnd: function (ev) {
                this.opts.scale = this.opts.lscale * ev.scale;
                this.opts.lscale = this.opts.scale;
                this.posMaxUpdate();
                if (ev.isFinal) {
                    return this.eventFinal(ev);
                }
                this.render();
            },
            /**
             * @param {HammerEvent} ev
             */
            eventFinal: function (ev) {
                if (ev.isFinal) {
                    this.posMaxUpdate();
                    this.posLimit();
                    if (this.opts.scale <= 1) {
                        return this.reset();
                    }

                    this.opts.ltrans = {
                        x: this.opts.trans.x,
                        y: this.opts.trans.y
                    };
                    this.opts.lscale = this.opts.scale;
                    this.render();
                }
            },
            /**
             *
             */
            reset: function () {
                this.opts.trans = {x: 0, y: 0};
                this.opts.ltrans = {x: 0, y: 0};
                this.opts.scale = 1;
                this.opts.lscale = 1;
                this.opts.smooth = true;
                this.wheelTimer = null;
                this.render();
            },
            /**
             * @private
             */
            smoothReset: function () {
                this.elem.addClass('smooth');
                this.smoothResetEndT = setTimeout(this.smoothResetEnd, 200);
            },
            /**
             * @private
             */
            smoothResetEnd: function () {
                this.elem.removeClass('smooth');
            },
            /**
             * @method render
             */
            render: function () {
                var trans = this.opts.trans, scale = this.opts.scale;
                this.elem.transform(trans.x, trans.y, scale).__render();

                if (this.opts.smooth === true) {
                    this.smoothReset();
                }
                this.opts.smooth = false;
            }
        });

        return Photify;
    }

    Ark.provider('Photify', factory, ['Hammer', 'Nautilus', 'Support', 'Selector', 'TickAnimationFrame', 'Eventer']);
})(window, document, Math, Ark, Utils);
