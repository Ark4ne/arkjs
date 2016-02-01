(function() {
    function factory (Utils, Promise){
        var prototize = Utils.prototize,
            bind = Utils.bind,
            bindCall = Utils.bindCall,
            attachEvent = Utils.Event.attach,
            removeEvent = Utils.Event.remove;

            /**
             * ImgLoad
             * 
             * @constructor
             * 
             * @returns {Promise}
             */
            function ImgLoad(img) {
                this.img = img;
                this.onload = bindCall(this.onload, this);
                this.onerror = bindCall(this.onerror, this);
                this.promise = new Promise(bind(this.promised, this));
            }
            prototize(ImgLoad, /** @lends {ImgLoad.prototype} */{
                    /**
                     * @method promised
                     * 
                     * @param resolve
                     * @param reject
                     */
                    promised : function(resolve, reject) {
                        if (this.img.complete) {
                            resolve(this.img, 'load')
                            this.dispose()
                        } else {
                            this.resolve = resolve;
                            attachEvent(this.img, 'load', this.onload);
                            attachEvent(this.img, 'error', this.onerror);
                        }
                    },

                    /**
                     * @method onload
                     */
                    onload : function() {
                        this.resolve(this.img, 'load');
                        this.dispose();
                    },

                    /**
                     * @method onerror
                     */
                    onerror : function() {
                        this.resolve(this.img, 'error');
                        this.dispose();
                    },

                    /**
                     * @method dispose
                     */
                    dispose :  function() {
                        removeEvent(this.img, 'load', this.onload);
                        removeEvent(this.img, 'error', this.onerror);
                        this.img = null;
                        this.onload = null;
                        this.onerror = null;
                        this.resolve = null;
                        this.promise = null;
                    }
            });


        /**
         * ImagesLoad
         * 
         * @constructor
         *
         * @param {Array} images - Array of image to handle loading complete.
         */
        function ImagesLoad(images) {
            if (!(this instanceof ImagesLoad))
                return new ImagesLoad(images);

            this.eventie = Ark('Eventie');
            this.imgs = images.length;
            this.prog = 0;
            this.comp = 0;
            this.fail = 0;
            this.progress = bind(this.progress, this);
            this.promises = [];
            var  _i = 0, _len = images.length, $img;
            while (_i < _len) {
                $img = new ImgLoad(images[_i]);
                $img.promise.then(this.progress);
                this.promises[_i] = $img;
                _i++;
            }
        }
        prototize(ImagesLoad, /** @lends {ImagesLoad.prototype} */{
                /**
                 * @method progress
                 * 
                 * @param img
                 * @param event
                 */
                progress:function(img, event) {
                    this.prog++;
                    if (event === 'load') {
                        this.comp++;
                    } else if (event === 'error') {
                        this.fail++;
                    }

                    this.eventie.emit('progress', {
                        img : img, prog : this.prog, total : this.imgs
                    });

                    if (this.prog === this.imgs) {
                        this.eventie.emit('complete');
                        this.dispose();
                    }
                },
                
                /**
                 * @method onprogress
                 * 
                 * @param {Function} callback
                 * @returns {ImagesLoad}
                 */
                onprogress : function(callback) {
                    this.eventie.on('progress', callback);
                    return this;
                },

                /**
                 * @method oncomplete
                 * 
                 * @param callback
                 * @returns {ImagesLoad}
                 */
                oncomplete :  function(callback) {
                    this.eventie.on('complete', callback);
                    return this;
                },

                /**
                 * @method dispose
                 */
                dispose : function() {
                    this.eventie.destroy();
                    this.eventie = null;
                    this.imgs = null;
                    this.prog = null;
                    this.comp = null;
                    this.fail = null;
                    while(this.promises.length){
                        this.promises.pop();
                    }
                    this.promises = null;
                }
                
        });

        /**
         * @function loadImgUrl
         * @static
         *
         * @param url
         *
         * @return {Promise}
         */
        ImagesLoad.loadImgUrl = function(url){
            var docFrag = document.createDocumentFragment();
            var img = document.createElement('IMG');
            docFrag.appendChild(img);
            var $img = new ImgLoad(img);
            $img.promise.then(function(){
                docFrag.removeChild(img);
                docFrag = null;
                url = null;
                img = null;
            });
            img.src = url;

            return $img.promise;
        };
        return ImagesLoad;
    }
    
    Ark.define('ImagesLoad', factory, ['Utils', 'Promise']);
})();