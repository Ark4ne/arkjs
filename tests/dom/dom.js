(function(){
    QUnit.test("Ark:Dom", function (assert) {
        var dom = Ark('Dom');
        
        var body = dom.getBody();

        assert.strictEqual(body, document.body || document.documentElement || document.getElementsByTagName('body')[0], 'Dom:getBody');
        assert.ok(dom.isElement(dom.createElem('div')), 'Dom:createElem');
        assert.strictEqual(dom.createElem('P').tagName, 'P', 'Dom:createElem.tagName');
        assert.strictEqual(dom.createElem('P', 'class').className, 'class', 'Dom:createElem.className');
        assert.strictEqual(dom.createElem('P', 'class', {attr:'attr'}).getAttribute('attr'), 'attr', 'Dom:createElem.attributes');
    });
    
    QUnit.test("$ Ark:Dom", function (assert) {
        var DATAS = [{"tag":"p","clazz":"Phasellus molestie maecenas venenatis in.","attributes":{"attr1":"BFILU","attr2":"Malesuada nisi."}},{"tag":"div","clazz":"Tortor potenti suspendisse facilisi class.","attributes":{"attr1":"KCSSE","attr2":"Eleifend, tempor."}},{"tag":"i","clazz":"Curabitur quisque sociis ligula suspendisse!","attributes":{"attr1":"BVFOP","attr2":"Natoque accumsan?"}},{"tag":"div","clazz":"Vestibulum id urna lacinia cubilia.","attributes":{"attr1":"UCSFJ","attr2":"Nisi tempus."}},{"tag":"p","clazz":"Pellentesque turpis cum tortor quam!","attributes":{"attr1":"PIUMI","attr2":"Aliquam suspendisse."}},{"tag":"a","clazz":"Suscipit rhoncus pharetra rutrum vivamus.","attributes":{"attr1":"UDOED","attr2":"Convallis iaculis!"}},{"tag":"span","clazz":"Sem ut ullamcorper viverra in.","attributes":{"attr1":"IGHNK","attr2":"Id aliquet!"}},{"tag":"span","clazz":"Nibh suspendisse ipsum facilisi felis?","attributes":{"attr1":"DACGZ","attr2":"Platea aenean."}},{"tag":"p","clazz":"Donec sociosqu vestibulum faucibus commodo.","attributes":{"attr1":"VUBHG","attr2":"Pharetra, cursus!"}},{"tag":"p","clazz":"Cubilia viverra donec rutrum eget.","attributes":{"attr1":"HVRJG","attr2":"Aliquet dictumst."}},{"tag":"i","clazz":"Donec sit semper ornare sem.","attributes":{"attr1":"SQTLW","attr2":"Dui elit."}},{"tag":"i","clazz":"Ipsum erat vivamus litora consectetur.","attributes":{"attr1":"CUGOI","attr2":"Justo vitae."}},{"tag":"div","clazz":"Ante congue suspendisse inceptos lacinia.","attributes":{"attr1":"OWXSN","attr2":"Adipiscing dapibus."}},{"tag":"i","clazz":"Scelerisque mi rutrum augue mattis.","attributes":{"attr1":"AKERM","attr2":"Vulputate himenaeos."}},{"tag":"i","clazz":"Semper blandit primis augue erat.","attributes":{"attr1":"CVLJW","attr2":"Dignissim consequat."}},{"tag":"span","clazz":"Aliquet scelerisque quis varius proin.","attributes":{"attr1":"PLIEW","attr2":"Sed eu."}},{"tag":"i","clazz":"Blandit quam nulla ac lectus.","attributes":{"attr1":"ZZAVX","attr2":"Enim ipsum."}},{"tag":"a","clazz":"Ut viverra feugiat dis cubilia.","attributes":{"attr1":"GFGYP","attr2":"Purus urna?"}},{"tag":"p","clazz":"Velit primis mmi id proin","attributes":{"attr1":"NQXCS","attr2":"Volutpat laoreet."}},{"tag":"a","clazz":"Aliquam sollicitudin sagittis purus! Fusce.","attributes":{"attr1":"DGLFK","attr2":"Bibendum nullam."}}];
        
        var dom = Ark('Dom');
        var supportClassList = dom.supportClassList;
        
        for(var i =0, len=DATAS.length; i < len; i++){
            var elem = DATAS[i];
            var $elem = dom.createElem(elem.tag, elem.clazz, elem.attributes);

            assert.ok(dom.isElement($elem), 'Dom:$elem instanceof HTMLElement');
            assert.strictEqual($elem.tagName, elem.tag.toUpperCase(), 'Dom:$elem.tagName');
            assert.strictEqual(supportClassList ? $elem.className.split(',').join(' ') : $elem.className, elem.clazz, 'Dom:$elem.className');
            assert.strictEqual($elem.getAttribute('attr1'), elem.attributes.attr1, 'Dom:createElem.attributes.1');
            assert.strictEqual($elem.getAttribute('attr2'), elem.attributes.attr2, 'Dom:createElem.attributes.2');
        }
    });
})()