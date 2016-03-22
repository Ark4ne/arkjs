(function(window){    /**     * @param {Utils} Utils     * @param {Eventie} Eventie     * @param {Event$Polyfill} Eventer     *     * @returns {Nautilus}     */    function factory(Utils, Eventie, Eventer){        var nautilusInit =  false,            nautilusHistory = window.history,            supportHistoryState = Utils.isFunction(nautilusHistory.pushState),            bindCallEvent = Utils.bindCallEvent,            attach = Eventer.attach;        /**         * @constructor         */        function Nautilus() {            this.handlers = [];            this.history  = {};            this.lastAttemp  = window.location.href;            this.pushed = 0;            this.historyListener = bindCallEvent(this.historyListener, this);        }        /**         * @const         * @type {string}         */        Nautilus.HASH_BANG = '#!';        Utils.prototize(Nautilus, /** @lends {Nautilus.prototype} */{            init : function(){                console.log(supportHistoryState + ':init');                if(!supportHistoryState){                    /* @TODO Implement method to emulate popstate */                    this.history['#!'] = {state:null};                    this.history['#'] = {state:null};                    this.lastAttemp = window.location.href;                    setInterval(function(_this){                        return function(){                            if(_this.lastAttemp !== window.location.href){                                _this.lastAttemp = window.location.href;                                _this.historyListener(_this.history[window.location.hash]);                            }                        }                    }(this),500);                    return;                }                if (!nautilusInit) {                    return attach(window, 'popstate', this.historyListener, false);                }            },            /**             * @param event             */            historyListener : function(event){                Eventer.cancel(event);                if(event == null || event.state == null){                    this.pushed = Math.max(this.pushed-1, 0);                }                Eventie.emit("popstate", event);            },            /**             * @param {Function} callback             */            onChange : function(callback){                if(!Eventie.has("popstate", callback))                    Eventie.on("popstate", callback);            },            /**             * @param {Function} callback             */            offChange : function(callback){                if(Eventie.has("popstate", callback))                    Eventie.off("popstate", callback);            },            /**             * @param {string} url             * @param {*} obj             * @param {string} [title]             */            push : function(url, obj, title){                this.pushed++;                if(supportHistoryState){                    nautilusHistory.pushState(obj, title, url);                } else {                    // @TODO                    window.location.hash = '#!' + url;                    window.location.hash !== '#!' ? this.history[window.location.hash] = {state:obj} : null;                    this.lastAttemp = window.location.href;                    //this.historyListener({state: obj, url:'#' + hash});                }            },            /**             * @param {string} hash             * @param {*} obj             * @param {string} [title]             */            pushHash : function(hash, obj, title){                console.log(supportHistoryState + ':pushHash');                this.pushed++;                if(supportHistoryState){                    //window.location.hash = '#' + hash;                    nautilusHistory.pushState(obj, title, '#' + hash);                } else {                    // @TODO                    window.location.hash = '#' + hash;                    window.location.hash !== '#' ? this.history[window.location.hash] = {state:obj} : null;                    this.lastAttemp = window.location.href;                    //this.historyListener({state: obj, url:'#' + hash});                }            },            /**             * @param {string} hash             * @param {*} [obj]             * @param {string} [title]             */            replaceHash : function(hash, obj, title){                if(supportHistoryState){                    nautilusHistory.replaceState(obj, title, hash ? '#' + hash : '#!');                } else {                    this.pushHash(hash,obj,title);                }            },            /**             * @param {string} [url]             */            setOrigin : function(url){                console.log(supportHistoryState + ':setOrigin');                if(supportHistoryState){                    this.pushed = 0;                    nautilusHistory.replaceState(null, null, url ? url : location.pathname + location.search);                } else {                    window.location.hash = '';                    this.lastAttemp = window.location.href;                }            },            /**             *             */            back : function(){                this.pushed = Math.max(this.pushed-1, 0);                nautilusHistory.back();            },            goFirst : function(){                if(this.pushed){                    console.log(-this.pushed);                    nautilusHistory.go(-this.pushed);                    this.pushed = 0;                }            }        });        return Nautilus;    }    Ark.provider('Nautilus', factory, ['Utils', 'Eventie', 'Eventer']);})(window);