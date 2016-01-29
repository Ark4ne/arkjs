(function () {
    /**
     * @param {Window} window
     * @param {Utils} Utils
     * @param {Function} TickAnimationFrame
     * @param {Function} TickTimeout
     * @returns {*}
     */
    function factory(window, Utils, TickAnimationFrame, TickTimeout) {
        var merge = Utils.merge,
            prototize = Utils.prototize,
            attachEvent = Utils.Event.attach,
            hasOwnProperty = Utils.hasOwnProp,
            Grid, Gridify;
        var Cell = (function () {
            /** @constructor */
            function Cell(block, initialSize, grid, idx) {
                if (block == null) {
                    throw new Error("Cell: constructor: block can't be null");
                }

                if (initialSize == null) {
                    var prefix = 'offset';
                    if (hasOwnProperty(block, 'naturalHeight')
                        && hasOwnProperty(block, 'naturalWidth')) {
                        prefix = 'natural'
                    }
                    initialSize = {
                        height: block[prefix + 'Height'],
                        width: block[prefix + 'Width']
                    };
                }

                this.block = block;
                this.org = initialSize;

                this.height = 0;
                this.width = 0;
                this.marginRight = null;
                this.ratio = 0;

                this.applyStyle = false;

                this.grid = grid;
                this.idx = idx;
            }

            prototize(Cell, /** @lends {Cell.prototype} */{
                updateStyle: function () {
                    this.applyStyle = true;
                },
                applyTargetToSize: function (targetHeight) {
                    var org = this.org;
                    this.ratio = org.width / org.height;
                    this.height = targetHeight;
                    return this.width = this.ratio * targetHeight;
                },
                prev: function () {
                    if (this.idx > 0) {
                        return this.grid.cells[this.idx - 1];
                    }
                    return null;
                },
                next: function () {
                    if (this.idx < this.grid.cells.length - 1) {
                        return this.grid.cells[this.idx + 1];
                    }
                    return null;
                }
            });

            return Cell;
        })();
        Grid = (function () {
            /** @constructor */
            function Grid(container, options) {
                if (!(this instanceof Grid))
                    return new Grid(container, options);

                this.cells = [];
                this.lastRow = null;
                this.added = 0;
                this.opts = options;
                this.opts.gutterPx = this.opts.gutter + 'px';
                this.container = container;
                this.containerWidth = container.clientWidth;

                this.renderCells = TickAnimationFrame(this.renderCells, this);
            }

            prototize(Grid, /** @lends {Grid.prototype} */{
                /**
                 * Add new cell
                 */
                addBlock: function (block, size) {
                    var cell = new Cell(block, size, this, this.cells.length);
                    this.cells.push(cell);
                    return cell;
                },
                /**
                 * Render only last added cells
                 */
                renderAdded: function () {
                    if (this.added >= this.cells.length) {
                        return;
                    }

                    if (this.lastRow === null) {
                        return this.renderAll();
                    }

                    var containerWidth = this.containerWidth || this.container.clientWidth;
                    var windowHeight = window.innerHeight - 50;
                    this.renderRow(this.lastRow, containerWidth, windowHeight);

                    return this.render();
                },
                /**
                 * ReRender all cells
                 */
                renderAll: function () {
                    if (this.cells.length === 0) {
                        return;
                    }

                    this.added = 0;
                    this.lastRow = null;

                    return this.render();
                },
                /**
                 * Render all cells
                 */
                render: function () {
                    if (this.cells.length === 0) {
                        return;
                    }

                    var containerWidth = this.containerWidth || this.container.clientWidth;
                    var windowHeight = window.innerHeight - 50;

                    while (this.added < this.cells.length) {
                        this.lastRow = this.renderRow(this.added, containerWidth, windowHeight);
                    }

                    return this.renderCells();
                },
                /**
                 * Render a Row
                 *
                 * @param start     int - First index cell to display on row
                 * @param maxWidth  int
                 * @param maxHeight int
                 */
                renderRow: function (start, maxWidth, maxHeight) {
                    var rowWidth, rowRatio, targetHeight, deltaWidth, justifyToMaxHeight, idxEnd, idxStart, last, justify, gutter, addHeight, addWidth, cell, _i, _len, px = "px", gutterPx, cellInRow;
                    rowWidth = 0;
                    rowRatio = 0;
                    last = _i = idxStart = start;
                    _len = this.cells.length;
                    idxEnd = _len - 1;
                    targetHeight = this.opts.targetHeight;
                    justifyToMaxHeight = targetHeight > maxHeight;
                    targetHeight = justifyToMaxHeight ? maxHeight : targetHeight;
                    gutter = this.opts.gutter;
                    gutterPx = this.opts.gutterPx;
                    justify = true;
                    cellInRow = 0;

                    while (_i < _len) {
                        cell = this.cells[_i];

                        cell.applyTargetToSize(targetHeight);

                        if (rowWidth > 0 // Prevent Empty Row
                            && !(maxWidth > 640 && cellInRow == 1) // Force have two Cell when container width > 640
                            && !justifyToMaxHeight
                            && (rowWidth + ((cell.width/2) + gutter)) > maxWidth) {
                            justify = true;
                            break;
                        }
                        rowWidth += cell.width + gutter;
                        rowRatio += cell.ratio;
                        last = _i;
                        cellInRow++;
                        if (rowWidth >= maxWidth
                            && !(maxWidth > 640 && cellInRow == 1) // Force have two Cell when container width > 640
                        ) {
                            justify = true;
                            break;
                        }
                        _i++
                    }

                    justify |= last === idxEnd;
                    deltaWidth = maxWidth - (rowWidth - gutter) - 1;

                    _i = idxStart;
                    this.added = _len = last + 1;
                    while (_i < _len) {
                        cell = this.cells[_i];
                        if (justify) {
                            addWidth = deltaWidth * cell.ratio / rowRatio;
                            addHeight = addWidth / cell.ratio;
                            cell.width = cell.width + addWidth;
                            cell.height = cell.height + addHeight;
                        }
                        if (_i < last) {
                            cell.marginRight = gutterPx;
                        } else {
                            cell.marginRight = null;
                        }
                        cell.updateStyle();
                        _i++;
                    }

                    return idxStart;
                },
                renderCells: function () {
                    var i = this.cells.length - 1, cell, px = "px";

                    while (i >= 0) {
                        cell = this.cells[i];
                        if (cell.applyStyle === true) {
                            cell.block.style.marginRight = cell.marginRight;
                            cell.block.style.height = cell.height + px;
                            cell.block.style.width = cell.width + px;
                            cell.applyStyle = false;
                        }
                        i--;
                    }
                }
            });

            return Grid;
        })();

        Gridify = (function () {
            /** @constructor */
            function Gridify(container, options) {
                if (!(this instanceof Gridify))
                    return new Gridify(container, options);

                this.container = container;

                this.grid = new Grid(container, merge({
                    targetHeight: 300,
                    gutter: 0
                }, options));

                this.resize = TickTimeout(this.resize, 50, this);
                attachEvent(window, 'resize', this.resize);
            }

            prototize(Gridify, /** @lends {Gridify.prototype} */{
                append: function (elem, size) {
                    return this.grid.addBlock(elem, size);
                },
                appends: function (blocks) {
                    for (var len = blocks.length, i = 0; i < len; i++) {
                        var block = blocks[i];
                        this.grid.addBlock(block.elem, block.size);
                    }
                },
                layout: function (all) {
                    if (all) {
                        this.grid.renderAll();
                    } else {
                        this.grid.renderAdded();
                    }
                },
                resize: function () {
                    var currentContainerWidth = this.container.clientWidth, lastContainerWidth = this.grid.containerWidth;
                    if (lastContainerWidth !== currentContainerWidth) {
                        lastContainerWidth = currentContainerWidth;
                        this.grid.containerWidth = lastContainerWidth;
                        this.layout(true);
                    }
                }
            });

            return Gridify;
        })();

        return Gridify;
    }

    Ark.define('Gridify', factory, ['window', 'Utils', 'TickAnimationFrame', 'TickTimeout']);
}).call(this);
