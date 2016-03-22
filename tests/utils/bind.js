(function () {
    var Mock = {Binds:{}};
    var defaultBind = {
            onbind: [],
            oncall: [],
            except: [],
            ctx: null
    };
    function addMockBinds(name, opts){
        if(!Mock.Binds.hasOwnProperty(name))
            Mock.Binds[name] = [];

        if(Utils.isArray(opts)){
            for(var _i = 0, _len = opts.length; _i < _len; _i++)
                Mock.Binds[name].push(Utils.merge({}, defaultBind, opts[_i]))
        } else 
            Mock.Binds[name].push(Utils.merge({}, defaultBind, opts))
    }

    addMockBinds('bind',[{}, 
                         {oncall: [1, 2, 3, '4'],except: [1, 2, 3, '4']}]);
    addMockBinds('bindCall',[{}, 
                             {oncall: [1, 2, 3, '4']}]);
    addMockBinds('bindCall1',[{except: [undefined]},
                              {oncall: [1, 2, 3, '4'], except: [1]}]);
    addMockBinds('bindCallEvent',[{ctx: [], except: [undefined, []]},
                                  {ctx: {}, except: [undefined, {}]},
                                  {ctx: {}, oncall: [[]], except: [[], {}]},
                                  {ctx: {}, oncall: [1, 2, 3, '4'], except: [1, {}]}]);
    addMockBinds('bindCallValue',[{ctx: null, except: [undefined]},
                                  {ctx: {}, except: [undefined]},
                                  {ctx: {}, oncall: [[]], except: [undefined]},
                                  {ctx: {}, onbind: [[]], except: [[]]},
                                  {ctx: {}, onbind: [{}], except: [{}]},
                                  {ctx: {}, onbind: [1] , oncall: [[]], except: [1]}]);
    /*addMockBinds('bindArgs',[{},
                             {oncall: [1, 2, 3, '4'], except: [1, 2, 3, '4']}, 
                             {onbind: [1, 2, 3], oncall: ['4'],except: [1, 2, 3, '4']}, 
                             {onbind: [1, 2, 3], oncall: [],except: [1, 2, 3]}]);*/

    function Mock$Utils$Binds$Tester(method, test, idx, assert) {
        var bindable = function () {
            return Array.prototype.slice.call(arguments);
        };

        var args = [bindable, null];

        // test.onbind && => Fix for IE < 10
        test.onbind && Array.prototype.push.apply(args, test.onbind);

        var binded = Utils[method].apply(null, args);

        assert.propEqual(
            binded.apply(test.ctx, test.oncall),
            test.except,
            method + ':' + (idx + 1));
    }

    QUnit.test("$ Ark:Utils:Binds", function (assert) {
        for (var method in Mock.Binds) {
            if (!Mock.Binds.hasOwnProperty(method))
                continue;

            var tests = Mock.Binds[method];
            for (var _i = 0, _len = tests.length; _i < _len; _i++) {
                Mock$Utils$Binds$Tester(method, tests[_i], _i, assert);
            }
        }
    });

})();
