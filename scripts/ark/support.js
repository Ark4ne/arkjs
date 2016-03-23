(function (Ark) {
    /**
     * @param window
     * @param document
     * @param navigator
     */
    function factory(window, document, navigator) {
        var hasOwn = window.Utils.hasOwnProp;
        var callOnce = Utils.callOnce;
        /**
         * @namespace Support
         */
        /**
         * @function Support
         *
         * @param {string} need
         *
         * @returns {boolean}
         */
        function Support(need) {
            if (hasOwn(Support, need)) {
                return Support[need]();
            }
            return false;
        }

        /**
         * @memberOf Support
         * @static
         * @returns {boolean}
         */
        Support.Css3d = callOnce(function () {
            if (!window.getComputedStyle) {
                return false;
            }
            var el = document.createElement('p'), has3d, transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            }, body = document.body;
            // Add it to the body to get the computed style
            body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(
                        transforms[t]);
                }
            }
            body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        });

        /**
         * @memberOf Support
         * @static
         *
         * @returns {boolean}
         */
        Support.isMobileDevice = callOnce(function isMobileDevice() {
            return /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent);
        });

        return Support;
    }

    Ark.define('Support', factory, ['window', 'document', 'navigator']);
})(Ark);