(function ArkGlobalClosure(global){
    var Utils = global.Utils;
    var hasOwn = Utils.hasOwnProp;
    var isArray = Utils.isArray;
    var inherit = Utils.inherit;
    var prototize = Utils.prototize;

    /**
     * @constructor
     *
     * @param {string} name
     * @param {Function} factory
     * @param {Array<string>} [inject]
     */
    function Ark$Module(name, factory, inject){
        this.name = name;
        this.factory = factory;
        this.instance = null;
        this.$$inject = isArray(inject) && inject.length > 0 ? inject : [];
    }

    prototize(Ark$Module,  /** @lends {Ark$Module.prototype} */{
        /**
         * @return {Object|Function|Array|string}
         */
        getInstance : function(){
            if(this.instance == null){
                // make simple injection faster
                switch(this.$$inject.length){
                    case 0 :
                        this.instance = this.factory.call(global);
                        break;
                    case 1 :
                        this.instance = this.factory.call(global, Ark.require(this.$$inject[0]));
                        break;
                    case 2 :
                        this.instance = this.factory.call(global, Ark.require(this.$$inject[0]), Ark.require(this.$$inject[1]));
                        break;
                    case 3 :
                        this.instance = this.factory.call(global, Ark.require(this.$$inject[0]), Ark.require(this.$$inject[1]), Ark.require(this.$$inject[2]));
                        break;
                    case 4 :
                        this.instance = this.factory.call(global,
                            Ark.require(this.$$inject[0]),
                            Ark.require(this.$$inject[1]),
                            Ark.require(this.$$inject[2]),
                            Ark.require(this.$$inject[3])
                        );
                        break;
                    default :
                        var _i = 0,
                            _len = this.$$inject.length,
                            injection = new Array(_len);

                        while(_i < _len){
                            injection[_i] = Ark.require(this.$$inject[_i]);
                            _i++;
                        }

                        this.instance = this.factory.apply(global, injection);

                        injection = null;
                }
            }
            return this.instance;
        }
    });

    /**
     * @constructor
     * @extends {Ark$Module}
     *
     * @param {string} name
     * @param {Function} factory
     * @param {Array<string>} [inject]
     */
    function Ark$Factory(name, factory, inject){
        Ark$Factory.__super__.constructor.call(this, name, factory, inject);
    }

    inherit(Ark$Factory, Ark$Module, /** @lends {Ark$Factory.prototype} */{
        /**
         * @return {Object}
         */
        getInstance : function(){
            return new (Ark$Factory.__super__.getInstance.call(this))();
        }
    });

    /**
     * @constructor
     * @extends {Ark$Module}
     *
     * @param {string} name
     * @param {Function} factory
     * @param {Array<string>} [inject]
     */
    function Ark$Provider(name, factory, inject){
        Ark$Provider.__super__.constructor.call(this, name, factory, inject);
    }

    inherit(Ark$Provider, Ark$Module, /** @lends {Ark$Provider.prototype} */{
        /**
         * @inheritDoc
         */
        getInstance : function(){
            if(this.instance === null)
                this.instance = new (Ark$Provider.__super__.getInstance.call(this))();
            return this.instance;
        }
    });

    /**
     * @function Ark(...arg):{Ark|Object|Function|Ark$Module}
     *
     * @param {...string} arg
     *
     * @returns {Object|Function|Ark$Module}
     */
    function Ark(arg){
        if(arg == null){
            return Ark;
        }
        switch (arguments.length){
            case 1:
                return Ark.require(arg);
            default :
                return Ark.define.apply(Ark, arguments);
        }
    }

    /**
     * @template T
     *
     * @function {Ark$$Define$Module({T extends Function} typeModule, {string} moduleName, {Function} factory, {Array<string>?} inject):{T}}
     *
     * @param {T} typeModule
     * @param {string} moduleName
     * @param {Function} factory
     * @param {Array<string>} [inject]
     *
     * @throws {Error}
     *
     * @returns {T}
     */
    var Ark$$Define$Module = function (typeModule, moduleName, factory, inject){
        if(hasOwn(Ark.$$modules$$, moduleName)){
            throw new Error("Module '"+moduleName+"' already defined.")
        }

        return Ark.$$modules$$[moduleName] = new (typeModule)(moduleName, factory, inject);
    };

    /**
     * @type {Object.<string, Ark$Module>}
     * @memberOf Ark
     * @static
     */
    Ark.$$modules$$ = {};

    /**
     * @function define
     * @memberOf Ark
     * @static
     *
     * @param {string} moduleName
     * @param {Function} factory
     * @param {Array<string>} [inject]
     *
     * @throws {Error}
     *
     * @returns {Ark$Module}
     */
    Ark.define = function (moduleName, factory, inject){
        return Ark$$Define$Module(Ark$Module, moduleName, factory, inject);
    };

    /**
     * @function provider
     * @memberOf Ark
     * @static
     *
     * @param {string} moduleName
     * @param {Function} factory
     * @param {Array<string>} [inject]
     *
     * @throws {Error}
     *
     * @returns {Ark$Provider}
     */
    Ark.provider = function (moduleName, factory, inject){
        return Ark$$Define$Module(Ark$Provider, moduleName, factory, inject);
    };

    /**
     * @function factory
     * @memberOf Ark
     * @static
     *
     * @param {string} moduleName
     * @param {Function} factory
     * @param {Array<string>} [inject]
     *
     * @throws {Error}
     *
     * @returns {Ark$Factory}
     */
    Ark.factory = function (moduleName, factory, inject){
        return Ark$$Define$Module(Ark$Factory, moduleName, factory, inject);
    };

    /**
     * @function require
     * @memberOf Ark
     * @static
     *
     * @param {string} moduleName
     *
     * @returns {Object|Function|Array|string}
     */
    Ark.require = function (moduleName){
        if(hasOwn(Ark.$$modules$$, moduleName)){
            return Ark.$$modules$$[moduleName].getInstance();
        }
        if(global[moduleName] !== undefined){
            return global[moduleName];
        }
        throw new Error("Module '"+moduleName+"' not defined.")
    };

    // @TODO Create Module for require external script.
    var requiredJS = {};

    /**
     * @function requireJS
     * @memberOf Ark
     * @static
     *
     * @param {string} pathFile
     *
     * @returns {Promise|Boolean}
     */
    Ark.requireJS = function (pathFile){
        if(hasOwn(requiredJS, pathFile) && requiredJS[pathFile] === true){
            return requiredJS[pathFile];
        }

        // @TODO Rewrite method to remove function instantiation
        return new Promise(function(resolve, reject){
            var script,
                head = document.head  || document.documentElement || document.getElementsByTagName('HEAD')[0];

            script = document.createElement("script");
            script.async = true;
            script.onload = script.onreadystatechange = function( _, isAbort ) {
                if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;

                    // Remove the script
                    if ( script.parentNode ) {
                        script.parentNode.removeChild( script );
                    }

                    // Dereference the script
                    script = null;

                    // Callback if not abort
                    if ( !isAbort ) {
                        requiredJS[pathFile] = true;
                        return resolve(200);
                    }
                    requiredJS[pathFile] = false;
                    reject(_);
                }
            };
            script.src = pathFile;
            head.insertBefore( script, head.firstChild );
        });
    };

    global.Ark = Ark;
})(window);
