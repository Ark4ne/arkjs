(function(Ark){
   function factory(Utils, window){
       var hasOwn = Utils.hasOwnProp, __LocalStorage__ = typeof(Storage) !== "undefined" && hasOwn(window, 'localStorage') ? window.localStorage : null;

       __LocalStorage__ = false;

       if(!__LocalStorage__){
           __LocalStorage__ = (function(){
              function LocalStorage(){
                  
              } 
              
              Utils.prototize(LocalStorage, {
                  getItem :function(key){
                      if(key && hasOwn(this, key)){
                          return this[key];
                      }
                  },
                  setItem :function(key, value){
                      if(key && value !== undefined){
                          this[key] = value;
                      }
                  },
                  removeItem :function(key){
                      if(key && hasOwn(this, key)){
                          delete this[key];
                      }
                  }
              });
              
              return new LocalStorage();
           })()
       } else {

       }
       
       return __LocalStorage__;
   }
   
   Ark.define('LocalStorage', factory, ['Utils', 'window']);
})(Ark);