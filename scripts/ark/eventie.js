(function(){

    function factory(Utils){
        /**
         * @constructor
         */
        function Eventie(){
            this.handlers = {}
        }

        Utils.prototize(Eventie, /** @lends {Eventie.prototype} */{
            /**
             * @param {*} event
             * @param {Function} handler
             */
            on : function(event, handler){
                this.handlers[event] = this.handlers[event] || [];
                this.handlers[event].push(handler);
            },
            /**
             * @param {*} event
             * @param {Function} handler
             */
            off : function(event, handler){
                if(!handler){
                    delete this.handlers[event];
                } else {
                    var eventHandlers = this.handlers[event];
                    eventHandlers.splice(eventHandlers.indexOf(handler), 1);
                }
            },
            /**
             * @param {*} event
             * @param {Function} handler
             */
            has : function(event, handler){
                var eventHandlers = this.handlers[event];
                return eventHandlers && eventHandlers.indexOf(handler) > -1;
            },
            /**
             * @param {*} event
             * @param {Object} [data]
             */
            emit : function(event, data){
                var handler = this.handlers[event], i = 0, len = handler.length;

                while(i < len){
                    handler[i++](data);
                }
            },
            /**
             *
             */
            destroy : function(){
                this.handlers = null;
            }
        });

        return Eventie;
    }

    Ark.factory('Eventie', factory, ['Utils']);
})();