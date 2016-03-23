(function (Ark) {

    /**
     *
     * @param {Utils} Utils
     * @param {Dom} Dom
     * @param {TickTimeout} TickTimeout
     * @param {Event$Polyfill} Eventer
     *
     * @returns {InfiniteScroll}
     */
    function factory(Utils, Dom, TickTimeout, Eventer) {
        var attach = Eventer.attach;
        var detach = Eventer.remove;
        var winSize = Dom.Win.getSize;
        var winScroll = Dom.Win.getScroll;

        /**
         * @constructor
         *
         * @param {Element} container
         * @param {Object} [settings]
         */
        function InfiniteScroll(container, settings) {
            this.__scrollHandle = TickTimeout(this.__scrollHandle, 50, this);

            this.eventie = Ark('Eventie');
            this.container = container;
            this.isEnable = false;
            this.settings = Utils.merge({
                direction: InfiniteScroll.DIRECTION_HORIZONTAL,
                distance: winSize().height * 2
            }, settings);
            this.enable();
        }

        /**
         * @const
         */
        InfiniteScroll.DIRECTION_HORIZONTAL = 'horizontal';

        /**
         * @const
         */
        InfiniteScroll.DIRECTION_VERTICAL = 'vertical';

        Utils.prototize(InfiniteScroll, /** @lends {InfiniteScroll.prototype} */{
            /**
             * @private
             */
            __scrollHandle: function () {
                var scroll, scrollMax;
                if (this.isEnable) {
                    if (this.settings.direction === InfiniteScroll.DIRECTION_VERTICAL) {
                        var winWidth = winSize().width;
                        scroll = Dom.getBody().clientWidth - winWidth - winScroll().x;
                        scrollMax = winWidth > this.settings.distance ? winWidth : this.settings.distance;
                    } else if (this.settings.direction === InfiniteScroll.DIRECTION_HORIZONTAL) {
                        var winHeight = winSize().height;
                        scroll = Dom.getBody().clientHeight - winHeight - winScroll().y;
                        scrollMax = winHeight > this.settings.distance ? winHeight : this.settings.distance;
                    }
                    if (scroll < scrollMax) {
                        this.eventie.emit('scrolled');
                    }
                }
            },
            /**
             * @param {Function} handler
             *
             * @return {InfiniteScroll}
             */
            on: function (handler) {
                this.eventie.on('scrolled', handler);

                return this;
            },
            /**
             * @param {Function} handler
             *
             * @return {InfiniteScroll}
             */
            off: function (handler) {
                this.eventie.off('scrolled', handler);

                return this;
            },
            /**
             * @return {InfiniteScroll}
             */
            enable: function () {
                if (!this.isEnable) {
                    this.isEnable = true;
                    attach(this.container, 'scroll', this.__scrollHandle);
                }
                return this;
            },

            /**
             * @return {InfiniteScroll}
             */
            disable: function () {
                if (this.isEnable) {
                    this.isEnable = false;
                    detach(this.container, 'scroll', this.__scrollHandle);
                }
                return this;
            },

            /**
             *
             */
            destroy: function () {
                this.disable();
                this.eventie.destroy();
                this.eventie = null;
                this.isEnable = null;
                this.container = null;
            }
        });

        return InfiniteScroll;
    }

    Ark.define('InfiniteScroll', factory, ['Utils', 'Dom', 'TickTimeout', 'Eventer']);
})(Ark);