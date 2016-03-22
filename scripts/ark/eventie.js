(function(){

    function factory(){
        /** @typedef {Object.<*, Function[]>} CallableSet */

        /**
         * @constructor
         */
        function Eventie(){
            /**
             * @type  {CallableSet}
             */
            this.handlers = {}
        }

        Utils.prototize(Eventie, /** @lends {Eventie.prototype} */{
            /**
             * @param {*} event
             * @param {Function} handler
             *
             * @returns {Eventie}
             */
            on : function(event, handler){
                this.handlers[event] = this.handlers[event] || [];
                this.handlers[event].push(handler);

                return this;
            },
            /**
             * @param {*} event
             * @param {Function} handler
             *
             * @returns {Eventie}
             */
            off : function(event, handler){
                if(!handler){
                    delete this.handlers[event];
                } else {
                    var handlers = this.handlers[event], idx;
                    if (handlers && (idx = handlers.indexOf(handler)) > -1)
                        handlers.splice(idx, 1);
                }

                return this;
            },
            /**
             * @param {*} event
             * @param {Function} handler
             */
            has : function(event, handler){
                var handlers = this.handlers[event];
                return handlers && handlers.indexOf(handler) > -1;
            },
            /**
             * @param {*} event
             * @param {Object} [data]
             *
             * @returns {Eventie}
             */
            emit : function(event, data){
                var handler = this.handlers[event], i = 0, len = handler ? handler.length : 0;

                while(i < len){
                    handler[i++](data);
                }

                return this;
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

    Ark.factory('Eventie', factory);
})();