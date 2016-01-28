var GridCell = Gridify.GridCell;
var GridRow = Gridify.GridRow;
var Grid = Gridify.Grid;

var Units = {};
Units.Class = {
    'GridCell' : {
        Class : Gridify.GridCell,
        Prototype : {
            /*block : 'object',
            org : 'object',

            height : 'number',
            width : 'number',
            ratio : 'number',*/

            applySizeToBlock : 'function',
            applyTargetToSize : 'function'
        }
    },
    'GridRow' : {
        Class : Gridify.GridRow,
        Prototype : {
            /*idxStart : 'number',
            idxEnd : 'number',
            width : 'number',*/

            render : 'function'
        }
    },
    'Grid' : {
        Class : Gridify.Grid,
        Prototype : {
            /*added : 'number',

            cells : 'object',
            rows : 'object',*/

            addBlock : 'function',
            renderAdded : 'function',
            render : 'function'
        }
    },
    'Gridify' : {
        Class : Gridify,
        Prototype : {
            append : 'function',
            layout : 'function'
        }
    }
};


Units.Mocks = {}
Units.Mocks.Block = function MockBlock(height, width){
    this.style = {
            height:height,
            width :width
    }
    this.innerHeight = height;
    this.innerWidth = width;
    this.naturalHeight = height;
    this.naturalWidth = width;
};
Units.Mocks.Container = function MockContainer(){
    this.style = {
            height:900,
            width :1200
    }
    this.innerHeight = 900;
    this.innerWidth = 1200;
};
console.log(Units.Class);

function TestUnitClass(clazz, Class){
    console.log(clazz)
    console.log(Class)
    QUnit.test("Class." + clazz + ".Construction", function(assert) {
        assert.strictEqual(window[clazz], Class.Class, "window[" + clazz
                + "] === " + clazz)
        assert.ok(new Class.Class() instanceof Class.Class, "new " + clazz
                + "() instanceof " + clazz)
        assert.ok(Class.Class() instanceof Class.Class, clazz
                + "() instanceof " + clazz)
    })

    QUnit.test("Class."+clazz + ".Prototype", function(assert) {
        var key;
        for (key in Class.Prototype) {
            var value = Class.Prototype[key];

            assert.ok(key in Class.Class.prototype, 
                    key + " prototypeof " + clazz);
            assert.strictEqual(typeof (Class.Class.prototype[key]), value,
                            'typeof(' + clazz + '.prototype[' + key + ']) === ' + value);
        }
    });
} 

for (clazz in Units.Class) {
    var Class = Units.Class[clazz];
    
    TestUnitClass(clazz, Class);
}


QUnit.test("GridCell.Object", function(assert) {
    var size = {
            height:200,
            width :400
    };
    var block = new Units.Mocks.Block(size.height,size.width);
    var cell = new GridCell(block);

    assert.strictEqual(cell.block, block, "GridCell.block == block")
    assert.propEqual(cell.org, size, "GridCell.org == block[Size]")
    assert.strictEqual(cell.height, 0, "GridCell.height == 0")
    assert.strictEqual(cell.width, 0, "GridCell.width == 0")
    assert.strictEqual(cell.ratio, 0, "GridCell.ratio == 0")
});

QUnit.test("GridCell.Object.Manip", function(assert) {
    var size = {
            height:200,
            width :400
    };
    var expectedSize = {
            height:400,
            width :800
    };
    var block = new Units.Mocks.Block(size.height,size.width);
    var cell = new GridCell(block);

    cell.applyTargetToSize(400);

    assert.propEqual(cell.org, size, "GridCell.org == block[Size]")
    assert.strictEqual(cell.height, expectedSize.height, "GridCell.height == expectedSize.height")
    assert.strictEqual(cell.width, expectedSize.width, "GridCell.width == expectedSize.width")
    assert.strictEqual(cell.ratio, 2, "GridCell.ratio == 2")
    
    cell.applySizeToBlock();

    assert.propEqual(cell.org, size, "GridCell.org == block[Size]")
    assert.strictEqual(block.style.height, expectedSize.height+'px', "GridCell.block.style.height == expectedSize.height+'px'")
    assert.strictEqual(block.style.width, expectedSize.width+'px', "GridCell.block.style.width == expectedSize.width+'px'")
});

QUnit.test("GridRow.Object", function(assert) {

    var row = new GridRow();

    assert.strictEqual(row.idxStart, 0, "GridRow.idxStart == 0")
    assert.strictEqual(row.idxEnd, Infinity, "GridRow.idxEnd == Infinity")
    assert.strictEqual(row.width, 0, "GridRow.width == 0")
});

QUnit.test("GridRow.Object.Manip", function(assert) {
    var row = new GridRow();
    var cells = [];

    var targetHeight = 300;
    var containerWidth = 1200;
    var expectedCells = 3;
    var expectedHeight = 300;
    
    for(var _i = 0, _len = 20; _i < _len; _i++){
        cells.push(new GridCell(new Units.Mocks.Block(150, 200)));
    }

    row.render({start:0, cells: cells}, {targetHeight:targetHeight,containerWidth:containerWidth, gutter:0});
    assert.strictEqual(row.idxStart, 0, "GridRow.idxStart == 0")
    assert.strictEqual(row.idxEnd, expectedCells-1, "GridRow.idxEnd == 2")
    assert.strictEqual(row.width, containerWidth, "GridRow.width == containerWidth")
    for(var _i = row.idxStart, _len = row.idxEnd+1; _i < _len; _i++){
        assert.strictEqual(cells[_i].height, targetHeight, "cells["+_i+"].height == targetHeight")
        assert.strictEqual(cells[_i].block.style.height, targetHeight+'px', "cells["+_i+"].block.style.height == targetHeight+'px'")
    }
    
    var row2 = new GridRow();
    row2.render({start:row.idxEnd+1, cells: cells}, {targetHeight:targetHeight,containerWidth:containerWidth, gutter:0});
    assert.strictEqual(row2.idxStart, row.idxEnd+1, "GridRow.idxStart == 3")
    assert.strictEqual(row2.idxEnd, expectedCells*2-1, "GridRow.idxEnd == "+(expectedCells*2-1))
    assert.strictEqual(row2.width, containerWidth, "GridRow.width == containerWidth")
    for(var _i = row2.idxStart, _len = row2.idxEnd+1; _i < _len; _i++){
        assert.strictEqual(cells[_i].height, targetHeight, "cells["+_i+"].height == targetHeight")
        assert.strictEqual(cells[_i].block.style.height, targetHeight+'px', "cells["+_i+"].block.style.height == targetHeight+'px'")
    }
});

QUnit.test("Grid.Object", function(assert) {

    var grid = new Grid();

    assert.strictEqual(grid.added, 0, "Grid.added == 0")
    assert.ok(grid.cells instanceof Array, "Grid.cells == []")
    assert.ok(grid.rows instanceof Array, "Grid.rows == []")
});

QUnit.test("Grid.Object.Manip", function(assert) {
    var grid = new Grid();
    var blocks = [];
    
    var targetHeight = 300;
    var containerWidth = 1200;
    var expectedCells = 3;
    var expectedHeight = 300;
    
    for(var _i = 0, _len = 20; _i < _len; _i++){
        blocks.push(new Units.Mocks.Block(150, 200));
    }
    

    for(var _i = 0, _len = 10; _i < _len; _i++){
        grid.addBlock(blocks[_i]);

        assert.strictEqual(grid.added, 0, "Grid.added == 0")
        assert.strictEqual(grid.rows.length, 0, "Grid.rows == 0")
        assert.strictEqual(grid.cells.length, ((1*_i)+1), "grid.cells.lenght == "+((1*_i)+1))
    }
    
    grid.render({targetHeight:targetHeight,containerWidth:containerWidth, gutter:0});

    assert.strictEqual(grid.added, 10, "Grid.added == 10")
    assert.strictEqual(grid.rows.length, 4, "Grid.rows == 4")
    
    for(var _i = 0, _len = grid.rows.length; _i < _len; _i++){
        var row = grid.rows[_i];

        assert.strictEqual(row.idxStart, 3*_i, "row.idxStart == "+(3*_i))
        if(_i+1 == _len){
            assert.strictEqual(row.idxEnd, row.idxStart, "row.idxEnd == row.idxStart")
            assert.strictEqual(row.width, 400, "row.width == 400 [Last]")
        }
        else{
            assert.strictEqual(row.idxEnd, (3*_i)+2, "row.idxEnd == "+((3*_i)+2))
            assert.strictEqual(row.width, containerWidth, "row.width == containerWidth")
        }
    }
    
    for(var _i = 0, _len = 10; _i < _len; _i++){
        var block = blocks[_i];
        
        assert.strictEqual(block.style.height, expectedHeight+'px', "block.style.height == expectedHeight+'px'")
    }

    for(var _i = 10, _len = 20; _i < _len; _i++){
        grid.addBlock(blocks[_i]);

        assert.strictEqual(grid.added, 10, "Grid.added == 0")
        assert.strictEqual(grid.rows.length, 4, "Grid.rows == 0")
        assert.strictEqual(grid.cells.length, _i+1, "grid.cells.lenght == "+(_i+1))
    }
    
    grid.renderAdded({targetHeight:targetHeight,containerWidth:containerWidth, gutter:0});
    
    assert.strictEqual(grid.added, 20, "Grid.added == 20")
    assert.strictEqual(grid.rows.length, 7, "Grid.rows == 7")
    
    for(var _i = 0, _len = grid.rows.length; _i < _len; _i++){
        var row = grid.rows[_i];

        assert.strictEqual(row.idxStart, 3*_i, "row.idxStart == "+(3*_i))
        if(_i+1 == _len){
            assert.strictEqual(row.idxEnd, row.idxStart+1, "row.idxEnd == row.idxStart")
            assert.strictEqual(row.width, 800, "row.width == 800 [Last]")
        }
        else{
            assert.strictEqual(row.idxEnd, (3*_i)+2, "row.idxEnd == "+((3*_i)+2))
            assert.strictEqual(row.width, containerWidth, "row.width == containerWidth")
        }
    }
    
    for(var _i = 0, _len = 20; _i < _len; _i++){
        var block = blocks[_i];
        
        assert.strictEqual(block.style.height, expectedHeight+'px', "block.style.height == expectedHeight+'px'")
    }
});

QUnit.test("Gridify", function(assert) {
    var gridify = Gridify(new Units.Mocks.Container(), 400);
    
    var blocks = [];
    
    var targetHeight = 300;
    var containerWidth = 1200;
    var expectedCells = 3;
    var expectedHeight = 300;

    for(var _i = 0, _len = 20; _i < _len; _i++){
        blocks.push(new Units.Mocks.Block(150, 200));
    }
    
    for(var _i = 0, _len = 10; _i < _len; _i++){
        gridify.append(blocks[_i]);
    }
    assert.strictEqual(gridify.grid.cells.length, 10, "gridify.grid.cells.length == 10");
    assert.strictEqual(gridify.grid.added, 0, "gridify.grid.added == 0");

    gridify.layout();
    assert.strictEqual(gridify.grid.added, 10, "gridify.grid.added == 10");
    

    for(var _i = 10, _len = 20; _i < _len; _i++){
        gridify.append(blocks[_i]);
    }
    assert.strictEqual(gridify.grid.added, 10, "gridify.grid.added == 10");

    gridify.layout();
    assert.strictEqual(gridify.grid.added, 20, "gridify.grid.added == 20");
});


