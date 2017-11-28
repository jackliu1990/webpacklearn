/**
 * Mostly a big copy/paste from https://raw.githubusercontent.com/openlayers/ol3/master/src/ol/control/overviewmapcontrol.js
 * without rotation and zoom/dezoom plus some adapations from http://ol3.qtibia.ro/build/examples/overviewmap-custom-drag.html
 * to add the possibility to drag the box on the minimap to move the main map
 */
define(['ol','jquery'], function (ol,$) {


    function scaleFromCenter(extent, value) {
        var deltaX = ((extent[2] - extent[0]) / 2) * (value - 1);
        var deltaY = ((extent[3] - extent[1]) / 2) * (value - 1);
        extent[0] -= deltaX;
        extent[2] += deltaX;
        extent[1] -= deltaY;
        extent[3] += deltaY;
    };
    var OVERVIEWMAP_MAX_RATIO = 0.75;
    var OVERVIEWMAP_MIN_RATIO = 0.1;
    var OverviewMap = function (opt_options) {
        var options = opt_options ? opt_options : {};
        this.collapsed_ = options.collapsed !== undefined ? options.collapsed : false;
        this.collapsible_ = options.collapsible !== undefined ? options.collapsible : true;
        if (!this.collapsible_) {
            this.collapsed_ = false;
        }
        var className = options.className ? options.className : 'ol-overviewmap';
        var tipLabel = options.tipLabel ? options.tipLabel : 'Overview map';
        var ovmapDiv = $('<div class="ol-overviewmap-map overviewMapBG"></div>').get(0);
        this.ovmap_ = new ol.Map({
            controls: new ol.Collection(),
            interactions: new ol.Collection(),
            target: ovmapDiv
        });
        //this.ovmap_.setSize([window.innerWidth, window.innerHeight]);
        var ovmap = this.ovmap_;
        if (options.layers) {
            options.layers.forEach(
                function (layer) {
                    ovmap.addLayer(layer);
                }, this);
        }
        var box = $('<div class="ol-overviewmap-box"></div>');
        this.boxOverlay_ = new ol.Overlay({
            position: [0, 0],
            positioning: 'bottom-left',
            element: box
        });
        this.ovmap_.addOverlay(this.boxOverlay_);
        var cssClasses = className + ' ' + 'ol-unselectable' + ' ' +
            'ol-control' +
            (this.collapsed_ && this.collapsible_ ? ' ol-collapsed' : '') +
            (this.collapsible_ ? '' : ' ol-uncollapsible');
        var element;
        if(!(options.collapseLabel === undefined && options.label === undefined)){
            var collapseLabel = options.collapseLabel ? options.collapseLabel : '\u00AB';
            this.collapseLabel_ = $('<span>\u00BB</span>').get(0);
            var label = options.label ? options.label : '\u00BB';
            this.label_ = $('<span>\u00AB</span>').get(0);
            var activeLabel = (this.collapsible_ && !this.collapsed_) ? this.collapseLabel_ : this.label_;
            var button = $('<button type="button" title="{0}"></button>'.replace('{0}', tipLabel)).append(activeLabel);
            button.on('click', this.handleClick_.bind(this));
            button.on('mouseout', function () {
                this.blur();
            });
            button.on('focusout', function () {
                this.blur();
            });
            element = $('<div class="{0}"></div>'.replace('{0}', cssClasses)).append(ovmapDiv).append(button).get(0);
        }
        else{
            element = $('<div class="{0}"></div>'.replace('{0}', cssClasses)).append(ovmapDiv).get(0);
        }
        var render = options.render ? options.render : OverviewMap.render;

        this.dragging = null;
        box.on("mousedown", this.onStartDrag.bind(this));
        $(document.body).on("mousemove", this.onDrag.bind(this));
        $(document.body).on("mouseup", this.onEndDrag.bind(this));
        ol.control.Control.call(this, {
            element: element,
            render: render,
            target: options.target
        });
    };
    ol.inherits(OverviewMap, ol.control.Control);

    OverviewMap.prototype.setMap = function (map) {
        var oldMap = this.getMap();
        if (map === oldMap) {
            return;
        }
        var view = map.getView();
        var projection = view.getProjection();
        var ovView = new ol.View({projection: projection});
        this.ovmap_.setView(ovView);
        ol.control.Control.prototype.setMap.call(this, map);
        if (map) {
            if (this.ovmap_.getLayers().getLength() === 0) {
                this.ovmap_.setLayerGroup(map.getLayerGroup());
            }
        }
        this.ovmap_.updateSize();
        this.resetExtent_();
    };

    OverviewMap.prototype.handleRotationChanged_ = function () {
        this.ovmap_.getView().setRotation(this.getMap().getView().getRotation());
    };

    OverviewMap.render = function (mapEvent) {
        this.validateExtent_();
        this.updateBox_();
    };

    OverviewMap.prototype.validateExtent_ = function () {
        var map = this.getMap();
        var ovmap = this.ovmap_;
        var mapSize = map.getSize();
        var view = map.getView();
        var extent = view.calculateExtent(mapSize);
        var ovmapSize = ovmap.getSize();
        var ovview = ovmap.getView();
        var ovextent = ovview.calculateExtent(ovmapSize);
        var topLeftPixel = ovmap.getPixelFromCoordinate(ol.extent.getTopLeft(extent));
        if (!topLeftPixel) return;
        var bottomRightPixel = ovmap.getPixelFromCoordinate(ol.extent.getBottomRight(extent));
        var boxSize = {
            width: Math.abs(topLeftPixel[0] - bottomRightPixel[0]),
            height: Math.abs(topLeftPixel[1] - bottomRightPixel[1])
        };
        var ovmapWidth = ovmapSize[0];
        var ovmapHeight = ovmapSize[1];
        if (boxSize.width < ovmapWidth * OVERVIEWMAP_MIN_RATIO ||
            boxSize.height < ovmapHeight * OVERVIEWMAP_MIN_RATIO ||
            boxSize.width > ovmapWidth * OVERVIEWMAP_MAX_RATIO ||
            boxSize.height > ovmapHeight * OVERVIEWMAP_MAX_RATIO) {
            this.resetExtent_();
        } else if (!ol.extent.containsExtent(ovextent, extent)) {
            this.recenter_();
        }
    };

    OverviewMap.prototype.resetExtent_ = function () {
        if (OVERVIEWMAP_MAX_RATIO === 0 || OVERVIEWMAP_MIN_RATIO === 0) {
            return;
        }
        var map = this.getMap();
        var ovmap = this.ovmap_;
        var mapSize = map.getSize();
        var view = map.getView();
        var extent = view.calculateExtent(mapSize);
        var ovmapSize = ovmap.getSize();
        var ovview = ovmap.getView();
        var steps = Math.log(OVERVIEWMAP_MAX_RATIO / OVERVIEWMAP_MIN_RATIO) / Math.LN2;
        var ratio = 1 / (Math.pow(2, steps / 2) * OVERVIEWMAP_MIN_RATIO);
        scaleFromCenter(extent, ratio);
        ovview.fit(extent, ovmapSize);
    };

    OverviewMap.prototype.recenter_ = function () {
        var map = this.getMap();
        var ovmap = this.ovmap_;
        var view = map.getView();
        var ovview = ovmap.getView();
        ovview.setCenter(view.getCenter());
    };

    OverviewMap.prototype.updateBox_ = function () {
        var map = this.getMap();
        var ovmap = this.ovmap_;
        var mapSize = map.getSize();
        var view = map.getView();
        var ovview = ovmap.getView();
        var ovmapSize = ovmap.getSize();
        var rotation = view.getRotation();
        var overlay = this.boxOverlay_;
        var box = this.boxOverlay_.getElement();
        var extent = view.calculateExtent(mapSize);
        var ovresolution = ovview.getResolution();
        var bottomLeft = ol.extent.getBottomLeft(extent);
        var topRight = ol.extent.getTopRight(extent);
        var rotateBottomLeft = this.calculateCoordinateRotate_(rotation, bottomLeft);
        overlay.setPosition(rotateBottomLeft);
        if (box) {
            var boxWidth = Math.abs((bottomLeft[0] - topRight[0]) / ovresolution);
            var boxHeight = Math.abs((topRight[1] - bottomLeft[1]) / ovresolution);
            box.width(boxWidth).height(boxHeight);
        }
    };

    OverviewMap.prototype.calculateCoordinateRotate_ = function (rotation, coordinate) {
        var coordinateRotate;
        var map = this.getMap();
        var view = map.getView();
        var currentCenter = view.getCenter();
        if (currentCenter) {
            coordinateRotate = [
                coordinate[0] - currentCenter[0],
                coordinate[1] - currentCenter[1]
            ];
            ol.coordinate.rotate(coordinateRotate, rotation);
            ol.coordinate.add(coordinateRotate, currentCenter);
        }
        return coordinateRotate;
    };

    OverviewMap.prototype.handleClick_ = function (event) {
        event.preventDefault();
        this.collapsed_ = !this.collapsed_;
        $(this.element).toggleClass('ol-collapsed');
        if (this.collapsed_) {
            this.collapseLabel_.parentNode.replaceChild(this.label_, this.collapseLabel_);
        } else {
            this.label_.parentNode.replaceChild(this.collapseLabel_, this.label_);
        }

        if (!this.collapsed_ && this.needFirstRenderUpdate_) {
            this.needFirstRenderUpdate_ = false;
            this.ovmap_.updateSize();
            this.ovmap_.once("postrender", function () {
                this.render();
            }.bind(this));
        }
    };

    OverviewMap.prototype.onStartDrag = function (e) {
        var box = $(e.target);
        this.dragging = {
            el: box,
            evPos: {top: e.pageY, left: e.pageX},
            elPos: box.offset()
        };
    }

    OverviewMap.prototype.onDrag = function (e) {
        if (this.dragging) {
            var curOffset = this.dragging.el.offset();
            var newOffset = {
                top: curOffset.top + (e.pageY - this.dragging.evPos.top),
                left: curOffset.left + (e.pageX - this.dragging.evPos.left)
            };
            this.dragging.evPos = {top: e.pageY, left: e.pageX};
            this.dragging.el.offset(newOffset);
        }
    }

    OverviewMap.prototype.onEndDrag = function (e) {
        if (this.dragging) {
            var map = this.getMap();
            var offset = this.dragging.el.position();
            var divSize = [this.dragging.el.width(), this.dragging.el.height()];
            var mapSize = map.getSize();
            var c = map.getView().getResolution();
            var xMove = offset.left * (Math.abs(mapSize[0] / divSize[0]));
            var yMove = offset.top * (Math.abs(mapSize[1] / divSize[1]));
            var bottomLeft = [0 + xMove, mapSize[1] + yMove];
            var topRight = [mapSize[0] + xMove, 0 + yMove];
            var left = map.getCoordinateFromPixel(bottomLeft);
            var top = map.getCoordinateFromPixel(topRight);
            var extent = [left[0], left[1], top[0], top[1]];
            map.getView().fit(extent, map.getSize());
            map.getView().setResolution(c);
            this.dragging.el.offset(this.dragging.elPos);
            this.dragging = null;
        }
    }

    return OverviewMap;
})

