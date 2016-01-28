(function () {
    function inArray(needle, haystack, argStrict) {
        var key = '',
            strict = !!argStrict;
        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true;
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true;
                }
            }
        }

        return false;
    }
    function noop() {}
    var Mocks = {};

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var functions = [
        'number', 'numeric', 'string', 'array', 'object', 'plainObject', 'function', 'naN'
    ];

    Mocks.Types = [
        {type: 'number', 'value': 100, ok: ['numeric'], wrong: [null, '', '1', 'feg', {}, [], noop]},
        {type: 'numeric', 'value': '100', ok: ['string'], wrong: [null, '', 'feg', {}, [], noop]},
        {type: 'string', 'value': 'str', ok: ['naN'], wrong: [null, 1, {}, [], noop]},
        {type: 'array', 'value': [], ok: ['object'], wrong: [null, 1, {}, '', noop]},
        {type: 'object', 'value': new (function Test() {})(), ok: ['naN'], wrong: [null, 1, '', noop]},
        {type: 'plainObject', 'value': {}, ok: ['naN', 'object'], wrong: [null, 1, '', noop]},
        {type: 'function', 'value': noop, ok: ['naN'], wrong: [null, '', '1', 'feg', {}, []]}
    ];

    QUnit.test("$ Ark:Utils:Type", function (assert) {
        var _i, _len, _j, __len, _fn, testing;
        for (_i = 0, _len = Mocks.Types.length; _i < _len; _i++) {
            var type = Mocks.Types[_i];

            for (_j = 0, __len = functions.length; _j < __len; _j++) {
                _fn = functions[_j];
                if (type.type === _fn || inArray(_fn, type.ok, true))
                    testing = ['ok', 'is'];
                else
                    testing = ['notOk', 'notIs'];

                assert[testing[0]](Utils['is' + capitalizeFirstLetter(_fn)](type.value), type.type + ' ' + testing[1] + capitalizeFirstLetter(_fn) + '()');
            }

            for (_j = 0, __len = type.wrong.length; _j < __len; _j++) {
                assert.notOk(Utils['is' + capitalizeFirstLetter(type.type)](type.wrong[_j]), type.wrong[_j] + ' notOk' + capitalizeFirstLetter(type.type) + '()');
            }
        }
    });
})();
