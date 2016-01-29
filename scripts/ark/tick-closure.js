(function(window, Utils){
    var bindCallValue = Utils.bindCallValue;
    
    /**
     * @constructor
     * @param {Function} fn
     */
    function TickClosure(fn){
        this.fn = fn;
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
        /**
         * @param {Function} fn
         * @param {Object} [context]
         * 
         * @return {Function}
         */
        function TickAnimationFrame(fn, context){
             var tClosure = new TickClosure(fn);
             return function(){
                 if(!tClosure.tick){
                     tClosure.tick = true;
                     requestAnimationFrame.call(window, bindCallValue(tClosure.callback, tClosure, context ? context : this));
                 }
             }
         }
        
        return TickAnimationFrame;
    });

    Ark.define('TickTimeout', function factory() {
        /**
         * @param {Function} fn
         * @param {number} time
         * @param {Object} [context]
         *
         * @return {Function}
         */
        function TickTimeout(fn, time, context){
            var tClosure = new TickClosure(fn);
            return function(){
                if(tClosure.tick){
                    clearTimeout(tClosure.tick)
                }
                tClosure.tick = setTimeout(bindCallValue(tClosure.callback, tClosure, context ? context : this), time);
            }
        }
        return TickTimeout;
    });
})(window, Utils);