(function(){
    QUnit.test("$ Ark:Dom:class", function (assert) {
        var DATAS = [{"clazz":"8QuGufFHEc"},{"clazz":"9IsV6aIaSr"},{"clazz":"LwiOX0G2l4"},{"clazz":"fkJq3TiqNU"},{"clazz":"7SSmGsQVzt"},{"clazz":"sFSlNRE0qG"},{"clazz":"JSAkisTm88"},{"clazz":"LmZfgEoDBQ"},{"clazz":"Rv475A3MKA"},{"clazz":"443MccOgvg"},{"clazz":"hhqJahm2bP"},{"clazz":"wZxBNKcOzV"},{"clazz":"3WaV2hE5u5"},{"clazz":"Di9hQn5ykm"},{"clazz":"rAYGVXoVuX"},{"clazz":"CYnPAYRSei"},{"clazz":"3JNMPRxgCd"},{"clazz":"VqAee7qqVu"},{"clazz":"Z2iC3B3NUI"},{"clazz":"zpQ5lqMFMt"}];
        
        var dom = Ark('Dom');
        var body = dom.getBody();
        var defClazzName = body.className.length ? body.className + ' ' : '';
        var supportClassList = dom.supportClassList
        for(var i =0, len=DATAS.length; i < len; i++){
            var clazz = DATAS[i].clazz;

            dom.addClass(body, clazz);
            assert.strictEqual(supportClassList ? body.className.split(',').join(' ') : body.className, defClazzName + clazz, 'Dom:addClass');
            assert.ok(dom.hasClass(body, clazz), 'Dom:hasClass');
            dom.removeClass(body, clazz);
            assert.strictEqual(supportClassList ? body.className.split(',').join(' ') : body.className, defClazzName.trim(), 'Dom:removeClass');
            assert.notOk(dom.hasClass(body, clazz), 'Dom:hasClass');
            
            dom.toggleClass(body, clazz);
            assert.strictEqual(supportClassList ? body.className.split(',').join(' ') : body.className, defClazzName + clazz, 'Dom:toggleClass');
            assert.ok(dom.hasClass(body, clazz), 'Dom:hasClass');
            dom.toggleClass(body, clazz);
            assert.strictEqual(supportClassList ? body.className.split(',').join(' ') : body.className, defClazzName, 'Dom:toggleClass');
            assert.notOk(dom.hasClass(body, clazz), 'Dom:hasClass');
        }
    });
})()