(function(){
    QUnit.test("$ Ark:Dom:attr", function (assert) {
        var DATAS = [{"attr1":"sZWj158Nik","attr2":393984,"attr3":"jablackwel7385"},{"attr1":"tabqcf5yBB","attr2":752213,"attr3":"selhodge3568"},{"attr1":"Ipz4QD4HU2","attr2":203824,"attr3":"alkno8633"},{"attr1":"eKk33pZmAk","attr2":174096,"attr3":"regingriffin1458"},{"attr1":"vi73dR2R7T","attr2":248070,"attr3":"sophirive6070"},{"attr1":"BXiVCeGanq","attr2":479565,"attr3":"blakewin4496"},{"attr1":"MR7F60QkCE","attr2":840509,"attr3":"aadstanto8427"},{"attr1":"Jh3nMnkK2E","attr2":156723,"attr3":"aarees7959"},{"attr1":"3MmRHxw7G9","attr2":136063,"attr3":"riroac5591"},{"attr1":"D7POSZMuC3","attr2":183790,"attr3":"josefoley9842"},{"attr1":"iL0uOqvc9U","attr2":477554,"attr3":"manuelsawye5453"},{"attr1":"xjFjMHqzVR","attr2":111270,"attr3":"vincenacevedo9152"},{"attr1":"vsYWGFi3Az","attr2":53873,"attr3":"priscilmcknigh8035"},{"attr1":"rDdq9MPvvD","attr2":888116,"attr3":"taycervante1874"},{"attr1":"UY39EKkqiY","attr2":912464,"attr3":"barrwallace3256"},{"attr1":"m1AkbIYWjw","attr2":276501,"attr3":"ayannahowe9628"},{"attr1":"0yuXhUFDAV","attr2":718056,"attr3":"armaclarke4738"},{"attr1":"5P4AnnyIbw","attr2":873716,"attr3":"elianndean4635"},{"attr1":"Qtwascc3Dh","attr2":74378,"attr3":"stersloan8225"},{"attr1":"WPoceajmFR","attr2":793011,"attr3":"ivsulliva8039"}];
        
        var dom = Ark('Dom');
        var body = dom.getBody();

        for(var i = 0, len=DATAS.length; i < len; i++){
            var attrs = DATAS[i];
            for(var attr in attrs){
                if(Utils.hasOwnProp(attrs, attr)){
                    assert.strictEqual(dom.getAttr(body, attr), null, '#:Dom:getAttr:null');
                    assert.strictEqual(dom.hasAttr(body, attr), false, '#:Dom:hasAttr:false');
                    assert.strictEqual(dom.removeAttr(body, attr), undefined, '#:Dom:removeAttr:undefined');

                    dom.setAttr(body, attr, attrs[attr]);

                    assert.strictEqual(dom.getAttr(body, attr), attrs[attr] + "", 'Dom:getAttr:attrs[attr]');
                    assert.strictEqual(dom.hasAttr(body, attr), true, 'Dom:hasAttr:true');
                    
                    dom.removeAttr(body, attr);

                    assert.strictEqual(dom.getAttr(body, attr), null, 'Dom:getAttr:null');
                    assert.strictEqual(dom.hasAttr(body, attr), false, 'Dom:hasAttr:false');
                    assert.strictEqual(dom.removeAttr(body, attr), undefined, 'Dom:removeAttr:undefined');
                }
            }
        }
    });
})()