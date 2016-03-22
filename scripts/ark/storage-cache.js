(function(Ark){
    function factory(Utils){
        var hasOwn = Utils.hasOwnProp;

        /**
         * CacheStorage
         * @constructor
         */
        function CacheStorage(){}

        Utils.prototize(CacheStorage, /** @lends {CacheStorage.prototype} */{
            /**
             * @param {string} key
             * @returns {*}
             */
            get :function(key){
                if(key && hasOwn(this, key)){
                    return this[key];
                }
            },
            /**
             * @param {string} key
             * @param {*} value
             */
            set :function(key, value){
                if(key && value !== undefined){
                    this[key] = value;
                }
            },
            /**
             * @param {string} key
             * @returns {boolean}
             */
            has :function(key){
                return key && hasOwn(this, key);
            },
            /**
             * @param {string} key
             */
            remove :function(key){
                if(key && hasOwn(this, key)){
                    delete this[key];
                }
            }
        });

        return CacheStorage;
    }

    Ark.provider('CacheStorage', factory, ['Utils']);
})(Ark);