(function(Ark){
    function factory(Utils){
        var hasOwn = Utils.hasOwnProp;

        /**
         * CacheStorage
         * @constructor
         */
        function __CacheStorage__(){}

        Utils.prototize(__CacheStorage__, /** @lends {__CacheStorage__.prototype} */{
            /**
             * @param {string} key
             * @returns {*}
             */
            getItem :function(key){
                if(key && hasOwn(this, key)){
                    return this[key];
                }
            },
            /**
             * @param {string} key
             * @param {*} value
             */
            setItem :function(key, value){
                if(key && value !== undefined){
                    this[key] = value;
                }
            },
            /**
             * @param {string} key
             * @returns {boolean}
             */
            hasItem :function(key){
                return key && hasOwn(this, key);
            },
            /**
             * @param {string} key
             */
            removeItem :function(key){
                if(key && hasOwn(this, key)){
                    delete this[key];
                }
            }
        });

        return __CacheStorage__;
    }

    Ark.provider('CacheStorage', factory, ['Utils']);
})(Ark);