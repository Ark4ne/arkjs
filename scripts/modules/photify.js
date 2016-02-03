(function () {
    /**
     *
     * @param {Window} window
     * @param {HTMLDocument} document
     * @param {Utils} Utils
     * @param {Math} Math
     * @param {Hammer} Hammer
     * @param {Support} Support
     * @param {Selector} Selector
     * @param {Function} RequireAnimationFrame
     *
     * @returns {Photify}
     */
    function factory(window, document, Utils, Math, Hammer, Support, Selector, TickAnimationFrame) {
        var prototize = Utils.prototize;
        var bindCall = Utils.bindCall;
        var bindCall1 = Utils.bindCall1;
        var bindCallEvent = Utils.bindCallEvent;
        var merge = Utils.merge;
        var attachEvent = Utils.Event.attach;
        var removeEvent = Utils.Event.remove;
        var Dom = Ark('Dom'),
            addClass = Dom.addClass,
            removeClass = Dom.removeClass,
            getAttr = Dom.getAttr,
            setAttr = Dom.setAttr,
            winSize = Dom.Win.getSize;
        var requestAnimationFrame = window.requestAnimationFrame;
        var MOBILE_DEVICE = Support('isMobileDevice');
        var supportCss3d = Support('Css3d');
        
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
        function attachEventMouseWheel(element, mouseWheelHandler){
                // IE9, Chrome, Safari, Opera
              attachEvent(element, EVENT_NAME_MOUSE_WHEEL, mouseWheelHandler, false);
                // Firefox
              attachEvent(element, EVENT_NAME_MOUSE_SCROLL, mouseWheelHandler, false);
            }
        function detachEventMouseWheel(element, mouseWheelHandler){
                // IE9, Chrome, Safari, Opera
              removeEvent(element, EVENT_NAME_MOUSE_WHEEL, mouseWheelHandler, false);
                // Firefox
              removeEvent(element, EVENT_NAME_MOUSE_SCROLL, mouseWheelHandler, false);
            }

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

            this.opts = {
                trans: {x: 0, y: 0},
                ltrans: {x: 0, y: 0},
                mtrans: {x: 0, y: 0},
                scale: 1,
                lscale: 1,
                img: {h: 0, w: 0}
            };

            this.elem = null;
            this.tapped = null;
            this.tick = false;
            this.isOpen = false;
            this.smoothResetEndT = null;
            this.$$hmOn = false;
            this.wheelTimer = null;
        }

        prototize(Photify,  /** @lends {Photify.prototype} */{
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
                    addClass(this.$$container, 'open');
                    addClass(document.body, 'modal-open');
                    this.setElem(elem, height, width);
                    this.attachHammer();
                }
            },
            /**
             * @method close
             */
            close: function () {
                if (this.isOpen) {
                    this.isOpen = false;
                    removeClass(this.$$container, 'open');
                    removeClass(document.body, 'modal-open');
                    this.detachHammer();
                    this.clearElem();
                    this.resetOpts();
                }
            },
            /**
             * @method toggle
             *
             * @param elem
             * @param height
             * @param width
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
                this.reqClose = false;
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
                console.log('Photify:'+img.tagName+':clickEvElem');
                if ((ev.button || ev.which) != 1) return;

                if (this.isOpen !== true) {
                    this.open(img, img.height, img.width);
                    if (img.src !== getAttr(img, 'data-url-hd')) {
                        img.src = getAttr(img, 'data-url-hd');
                    }
                } else
                    Utils.Event.cancel(ev);

            },
            /**
             * @method mouseWheel
             *
             * @param ev
             * @param img
             */
            mouseWheel: function(ev, img){
                Utils.Event.preventDefault(ev);
                if (this.wheelTimer) {
                    clearTimeout(this.wheelTimer);
                }
                this.opts.lscale = this.opts.scale = this.opts.lscale + ((ev.wheelDelta || ev.detail) > 0 ? 0.1 : -0.1);

                this.posMaxUpdate();
                this.posLimit();
                this.render();
                if (this.opts.scale  < 1) {
                    this.wheelTimer = setTimeout(bindCall(this.reset, this), 100);
                }
            },
            /**
             * @method setElem
             *
             * @param elem
             * @param height
             * @param width
             */
            setElem: function (elem, height, width) {
                this.elem = elem;
                addClass(elem, 'photifies');

                var wSize = winSize();
                var wH = wSize.height,
                    wW = wSize.width,
                    wR = wH / wW,
                    iH = height,
                    iW = width,
                    iR = iH / iW,
                    h, w;
                if (wR < iR) {
                    h = wH;
                    w = h * iW / iH;
                } else {
                    w = wW;
                    h = w * iH / iW;
                }
                this.opts.img.h = h;
                this.opts.img.w = w;
                merge(this.elem.style, {
                    position: 'fixed',
                    height: h + 'px',
                    width: w + 'px',
                    top: (wH / 2 - h / 2) + 'px',
                    left: (wW / 2 - w / 2) + 'px',
                    zIndex: 3333333
                });
                this.posMaxUpdate();
            },
            /**
             * @method clearElem
             */
            clearElem: function () {
                merge(this.elem.style, EMPTY_CSS);
                this.smoothResetEnd();
                if (this.smoothResetEndT)
                    clearTimeout(this.smoothResetEndT);
                this.smoothResetEndT = null;
                removeClass(this.elem, 'photifies');
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
                    var singleTap = new Hammer.Tap({event: 'tap', taps: 1, threshold: 2, interval : 250, time : 200});
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
                if(!this.$$hmOn){
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
                if(this.$$hmOn){
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
                }
                if (Math.abs(this.opts.trans.y) > this.opts.mtrans.y) {
                    this.opts.trans.y = this.opts.mtrans.y * (this.opts.trans.y > 0 ? 1 : -1);
                }
                if (this.opts.img.w * this.opts.scale < winSize().width) {
                    this.opts.trans.x = 0;
                }
            },
            /**
             * @private
             */
            __tap : function(){
                this.tapped = null;
                if (this.opts.scale !== 1) {
                    this.reset();
                } else {
                    this.requestClose();
                }
            },
            /**
             * @method tap
             *
             * @param ev
             */
            tap: function (ev) {
                Utils.Event.cancel(ev.srcEvent);

                if(this.tapped){
                    clearTimeout(this.tapped);
                    this.tapped = null;
                    this.doubleTap(ev);
                } else {
                    this.tapped = setTimeout(this.__tap, 250);
                }
            },
            /**
             * @method tap
             *
             * @param ev
             */
            doubleTap: function (ev) {
                Utils.Event.cancel(ev.srcEvent);
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
             * @method panHandle
             *
             * @param ev
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
                this.render();
            },
            /**
             * @method panEnd
             *
             * @param ev
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
             * @method pinchStart
             *
             * @param ev
             */
            pinchStart: function (ev) {
                this.opts.lscale = this.opts.scale;
                this.opts.scale = this.opts.lscale * ev.scale;
                this.posMaxUpdate();
                if (ev.isFinal) {
                    return this.eventFinal(ev);
                }
                this.render();
            },
            /**
             * @method pinchHandle
             *
             * @param ev
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
             * @method pinchEnd
             *
             * @param ev
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
             * @method eventFinal
             *
             * @param ev
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
                    this.opts.lscale = 1 * this.opts.scale;
                    this.render();
                }
            },
            /**
             * @method reset
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
             * @method smoothReset
             */
            smoothReset: function () {
                addClass(this.elem, 'smooth');
                this.smoothResetEndT = setTimeout(this.smoothResetEnd, 200);
            },
            /**
             * @method smoothResetEnd
             */
            smoothResetEnd: function () {
                removeClass(this.elem, 'smooth');
            },
            /**
             * @method render
             */
            render: function () {
                var value;
                if (supportCss3d) {
                    value = [
                        'translate3d(' + this.opts.trans.x + 'px, ' + this.opts.trans.y + 'px, 0)',
                        'scale3d(' + this.opts.scale + ', ' + this.opts.scale + ', 1)'
                    ].join(' ');
                } else {
                    value = [
                        'translate(' + this.opts.trans.x + 'px, ' + this.opts.trans.y + 'px)',
                        'scale(' + this.opts.scale + ', ' + this.opts.scale + ')'
                    ].join(' ');
                }


                this.elem.style.webkitTransform = value;
                this.elem.style.mozTransform = value;
                this.elem.style.transform = value;
                if (this.opts.smooth === true) {
                    this.smoothReset();
                }
                this.opts.smooth = false;
            }
        });

        return Photify;
    }

    Ark.provider('Photify', factory, ['window', 'document', 'Utils', 'Math', 'Hammer', 'Support', 'Selector', 'TickAnimationFrame']);
})();
