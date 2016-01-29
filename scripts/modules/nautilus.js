(function(window){
    function factory(Utils, Eventie){
        var nautilusInit =  false,
            nautilusHistory = window.history,
            supportHistoryState = Utils.isFunction(nautilusHistory.pushState),
            bindCallEvent = Utils.bindCallEvent,
            attach = Utils.Event.attach;

        function Nautilus() {
            this.handlers = [];
            this.historyListener = bindCallEvent(this, this.historyListener);
        }

        Utils.prototize(Nautilus, {
            init : function(){
                if(!supportHistoryState)
                    return;
                if (!nautilusInit) {
                    return attach(window, 'popstate', this.historyListener, false);
                }
            },
            historyListener : function(event){
                Eventie.emit("popstate", event);
            },
            onChange : function(event){
                if(!Eventie.has("popstate", event))
                    Eventie.on("popstate", event);
            },
            offChange : function(event){
                if(Eventie.has("popstate", event))
                    Eventie.off("popstate", event);
            },
            push : function(obj, url, title){
                // @TODO
            }
        });

        return Nautilus;
    }

    Ark.provider('Nautilus', factory, ['Utils', 'Eventie'])
})(window);