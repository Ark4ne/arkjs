(function () {
    QUnit.test("Ark:Utils:Event:crud", function (assert) {
        var event = Utils.Event.create('tester');

        var eventRaised = false, eventCount = 0;
        var hanlderCount = function () {
            eventCount++;
        };
        var handler = function (e) {
            hanlderCount();
            eventRaised = !eventRaised;
        };
        Utils.Event.attach(window, 'tester', hanlderCount, false);
        Utils.Event.attach(window, 'tester', handler, false);

        window.dispatchEvent(event);

        assert.equal(eventCount, 2);
        assert.ok(eventRaised);

        Utils.Event.remove(window, 'tester', handler, false);

        window.dispatchEvent(event);

        assert.equal(eventCount, 3);
        assert.ok(eventRaised);

        Utils.Event.remove(window, 'tester', hanlderCount, false);

        window.dispatchEvent(event);

        assert.equal(eventCount, 3);
        assert.ok(eventRaised);
    });

    QUnit.test("Ark:Utils:Event:prevent&stop", function (assert) {
        var event = Utils.Event.create('tester');
        var eventCount = 0, cached;

        var hanlderCount = function (e) {
            cached = e;
            eventCount++;
        };
        var handlerPrevent = function (e) {
            Utils.Event.preventDefault(e);
        };
        var handlerStop = function (e) {
            Utils.Event.stopProp(e);
        };
        var handlerImmeStop = function (e) {
            Utils.Event.stopImmeProp(e);
        };
        var handlerCancel = function (e) {
            Utils.Event.cancel(e);
        };


        Utils.Event.attach(window, 'tester', hanlderCount, false);
        window.dispatchEvent(event);
        // Fix IE8
        /*if (cached.returnValue === true) {
            assert.equal(cached.returnValue, true);
        } else {
            assert.equal(cached.returnValue, undefined);
        }
        // Fix Firefox
        if (cached.cancelBubble === false) {
            assert.equal(cached.cancelBubble, false);
        } else {
            assert.equal(cached.cancelBubble, undefined);
        }*/
        assert.equal(eventCount, 1);
        Utils.Event.remove(window, 'tester', hanlderCount, false);

        Utils.Event.attach(window, 'tester', handlerPrevent, false);
        Utils.Event.attach(window, 'tester', hanlderCount, false);
        window.dispatchEvent(event);

        // Fix IE8
        /*if (cached.returnValue === false) {
            assert.equal(cached.returnValue, false);
        } else {
            assert.equal(cached.returnValue, undefined);
        }
        // Fix Firefox
        if (cached.cancelBubble === false) {
            assert.equal(cached.cancelBubble, false);
        } else {
            assert.equal(cached.cancelBubble, undefined);
        }*/
        assert.equal(eventCount, 2);
        Utils.Event.remove(window, 'tester', hanlderCount, false);
        Utils.Event.remove(window, 'tester', handlerPrevent, false);

        Utils.Event.attach(window, 'tester', handlerPrevent, false);
        Utils.Event.attach(window, 'tester', handlerStop, false);
        Utils.Event.attach(window, 'tester', hanlderCount, false);
        window.dispatchEvent(event);
        /*assert.equal(cached.returnValue, false);
        if (cached.cancelBubble === true) {
            assert.equal(cached.cancelBubble, true);
        } else {
            assert.equal(cached.cancelBubble, false);
        }*/
        assert.equal(eventCount, 3);
        Utils.Event.remove(window, 'tester', hanlderCount, false);
        Utils.Event.remove(window, 'tester', handlerStop, false);
        Utils.Event.remove(window, 'tester', handlerPrevent, false);

        Utils.Event.attach(window, 'tester', handlerPrevent, false);
        Utils.Event.attach(window, 'tester', handlerStop, false);
        Utils.Event.attach(window, 'tester', handlerImmeStop, false);
        Utils.Event.attach(window, 'tester', hanlderCount, false);
        window.dispatchEvent(event);
        /*assert.equal(cached.returnValue, false);
        if (cached.cancelBubble === true) {
            assert.equal(cached.cancelBubble, true);
        } else {
            assert.equal(cached.cancelBubble, false);
        }*/
        assert.equal(eventCount, 3);
        Utils.Event.remove(window, 'tester', hanlderCount, false);
        Utils.Event.remove(window, 'tester', handlerImmeStop, false);
        Utils.Event.remove(window, 'tester', handlerStop, false);
        Utils.Event.remove(window, 'tester', handlerPrevent, false);

        Utils.Event.attach(window, 'tester', handlerImmeStop, false);
        Utils.Event.attach(window, 'tester', handlerCancel, false);
        window.dispatchEvent(event);
        /*assert.equal(cached.returnValue, false);
        if (cached.cancelBubble === true) {
            assert.equal(cached.cancelBubble, true);
        } else {
            assert.equal(cached.cancelBubble, false);
        }*/
        assert.equal(eventCount, 3);
        Utils.Event.remove(window, 'tester', handlerCancel, false);
        Utils.Event.remove(window, 'tester', handlerImmeStop, false);
    });
})();