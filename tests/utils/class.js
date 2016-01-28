(function () {
    function noop() {
    }

    function meth1() {
    }

    function meth2() {
    }

    function meth3() {
    }

    var Mocks = {};

    Mocks.Methods = [{
        meth1: noop,
        meth2: noop,
        meth3: noop
    }, {
        meth1: meth1,
        meth2: meth2,
        meth3: meth3
    }];

    QUnit.test("$ Ark:Utils:Class:prototype", function (assert) {
        for (var _i = 0, _len = Mocks.Methods.length; _i < _len; _i++) {
            var meths = Mocks.Methods[_i];

            function ctor() {
            }

            Utils.prototize(ctor, meths);

            assert.strictEqual(ctor.prototype.constructor, ctor, '#' + (_i + 1) + ':ctor:constructor');
            for (var meth in meths) {
                if (meths.hasOwnProperty(meth)) {
                    assert.strictEqual(ctor.prototype[meth], meths[meth], '#' + (_i + 1) + ':ctor:' + meth);
                }
            }
        }
    });

    QUnit.test("Ark:Utils:Class:inheritance", function (assert) {
        (function () {
            var Animal = (function () {
                function Animal(name) {
                    this.name = name;
                }

                Animal.prototype.move = function (meters) {
                    return alert(this.name + (" moved " + meters + "m."));
                };

                return Animal;

            })();

            var Snake = (function (superClass) {
                Utils.extendClass(Snake, superClass);

                function Snake() {
                    return Snake.__super__.constructor.apply(this, arguments);
                }

                Snake.prototype.move = function () {
                    alert("Slithering...");
                    return Snake.__super__.move.call(this, 5);
                };

                return Snake;

            })(Animal);

            var sam = new Snake("Sammy the Python");

            assert.strictEqual(sam instanceof Snake, true, 'extendClass: instanceof Snake');
            assert.strictEqual(sam instanceof Animal, true, 'extendClass: instanceof Animal');
        })();
        (function () {
            var Animal = (function () {
                function Animal(name) {
                    this.name = name;
                }

                Animal.prototype.move = function (meters) {
                    return alert(this.name + (" moved " + meters + "m."));
                };

                return Animal;

            })();

            var Snake = (function (superClass) {
                function Snake() {
                    return Snake.__super__.constructor.apply(this, arguments);
                }

                Utils.inherit(Snake, superClass, {
                    move: function () {
                        alert("Slithering...");
                        return Snake.__super__.move.call(this, 5);
                    }
                });

                return Snake;

            })(Animal);

            var sam = new Snake("Sammy the Python");

            assert.strictEqual(sam instanceof Snake, true, 'inherit: instanceof Snake');
            assert.strictEqual(sam instanceof Animal, true, 'inherit: instanceof Animal');
        })();
        (function () {
            function Animal(name) {
                this.name = name;
                this.moved = 0;
                this.isDown = !1;
            }

            Utils.prototize(Animal, {
                move: function (meters) {
                    return this.moved=meters;
                },
                down:function(){
                    this.isDown = !this.isDown;
                }
            });

            function Snake() {
                return Snake.__super__.constructor.apply(this, arguments);
            }

            Utils.inherit(Snake, Animal, {
                move: function () {
                    //alert("Slithering...");
                    return Snake.__super__.move.call(this, 5);
                }
            });

            function SuperSnake() {
                return SuperSnake.__super__.constructor.apply(this, arguments);
            }

            Utils.inherit(SuperSnake, Snake, {
                move: function (){
                    SuperSnake.__super__.move.call(this);
                    this.name+= '::moved::'+this.moved;
                }
            });

            var sna = new Snake("Sammy the Python");
            var hor = new SuperSnake("Tom the Horse");

            assert.strictEqual(sna instanceof Snake, true, 'prototize&inherit: sna instanceof Snake');
            assert.strictEqual(sna instanceof Animal, true, 'prototize&inherit: sna instanceof Animal');

            assert.strictEqual(hor instanceof SuperSnake, true, 'prototize&inherit: hor instanceof SuperSnake');
            assert.strictEqual(hor instanceof Snake, true, 'prototize&inherit: hor instanceof Snake');
            assert.strictEqual(hor instanceof Animal, true, 'prototize&inherit: hor instanceof Animal');

            assert.strictEqual(sna instanceof SuperSnake, false, 'prototize&inherit: sna not instanceof SuperSnake');

            assert.strictEqual(hor.isDown, false, 'Verifie parent property');
            hor.down();
            assert.strictEqual(hor.isDown, true, 'Verifie parent property');
            assert.strictEqual(hor.name, 'Tom the Horse', 'Verifie parent call');
            hor.move();
            assert.strictEqual(hor.name, 'Tom the Horse::moved::5', 'Verifie parent call');
        })();
    });
})();
