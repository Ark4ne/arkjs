(function(){

    function factory(Utils, TickTimeout){
        var attach = Utils.Event.attach;
        var detach = Utils.Event.remove;

        function InfiniteScroll(container){
            this.__scrollHandle = TickTimeout(this.__scrollHandle, 50, this);

            this.container = container;

            attach(container, 'scroll', this.__scrollHandle);
        }

        Utils.prototize(InfiniteScroll, /** @lends {InfiniteScroll.prototype} */{
            /**
             *
             * @param ev
             * @private
             */
            __scrollHandle : function(){
                console.log(window.scrollX);
                console.log(window.scrollY);
            },

            /**
             *
             */
            destroy : function(){
                detach(this.container, 'scroll', this.__scrollHandle);
                this.container = null;
            }
        });

        return InfiniteScroll;
    }

    Ark.define('InfiniteScroll', factory, ['Utils', 'TickTimeout']);
})();