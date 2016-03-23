(function(window, Ark, Utils){
    var bindCallValue = Utils.bindCallValue;
    
    /**
     * @constructor
     * @param {Function} fn
     */
    function TickClosure(fn){
        /**
         * @type {Function}
         */
        this.fn = fn;
        /**
         * @type {null|int}
         */
        this.tick = null;
    }

    Utils.prototize(TickClosure, /** @lends {TickClosure.prototype} */ {
        /**
         * @param {*} context
         */
        callback : function(context) {
            this.fn.call(context);
            this.tick = null;
        }
    });
    
    Ark.define('TickAnimationFrame', function factory() {
        var callTickAnimationFrame = function(context){
            if(!this.tick){
                this.tick = true;
                requestAnimationFrame.call(window, bindCallValue(this.callback, this, context));
            }
        };

        /**
         * @param {Function} fn
         * @param {Object} [context]
         * 
         * @return {Function}
         */
        function TickAnimationFrame(fn, context){
             return Utils.bindCallValue(callTickAnimationFrame, new TickClosure(fn), context);
         }
        
        return TickAnimationFrame;
    });

    Ark.define('TickTimeout', function factory() {

        Utils.extendClass(TickTimeoutClosure, TickClosure);

        /**
         * @constructor
         * @extends {TickClosure}
         * @param {Function} fn
         * @param {number} time
         */
        function TickTimeoutClosure(fn, time){
            TickTimeoutClosure.__super__.constructor.call(this, fn);
            this.time = time;
        }

        /**
         * @this {TickTimeoutClosure}
         * @param {Object} [context]
         */
        function callTickTimeout(context){
            if(this.tick){
                clearTimeout(this.tick)
            }
            this.tick = setTimeout(bindCallValue(this.callback, this, context), this.time);
        }

        /**
         * @param {Function} fn
         * @param {number} time
         * @param {Object} [context]
         *
         * @return {Function}
         */
        function TickTimeout(fn, time, context){
            return bindCallValue(callTickTimeout, new TickTimeoutClosure(fn, time), context);
        }

        return TickTimeout;
    });
})(window, Ark, Utils);