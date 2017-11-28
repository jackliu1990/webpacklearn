/**
 * @author by wangyanxin on 2016-07-25.
 */
define(['classUtil', 'pagelayout', 'ol', 'envelope'],
    function (ClassUtil, PageLayout, ol, Envelope) {
        function createProject(opt) {
            var code = opt.projection ? opt.projection : 'EPSG:3857';
            var extent = opt.extent;
            if (!!extent) {
                var proj = new ol.proj.Projection({code: opt.projection, extent: opt.extent});
                return proj;
            }
            return code;
        }

        var targetId = null;
        /**
         * @class
         * @classdesc
         * 专题图
         * @alias g2.maps.PageLayout
         * @augments g2.maps.IPageLayout
         * @param {Object} [options] Map options
         * @param {Object} [options.defaultExtent] 默认图
         * @param {Number|undefined} [options.defaultExtent.maxZoom = 15] 最大缩放
         * @param {Number|undefined} [options.defaultExtent.minZoom = 2] 最小缩放
         * @param {g2.geom.Point|undefined} [options.defaultExtent.center = [0 , 0]] 中心点
         * @param {Number|undefined} [options.defaultExtent.level = 6] 缩放级别
         * @param {Number|undefined} [options.defaultExtent.projection = EPSG:3857'] 投影坐标系
         * @param {Object} [options.fullExtent] 全图
         * @param {Number} [options.fullExtent.level] 级别
         * @param {g2.geom.Point} [options.fullExtent.center] 中心点
         * @param {Object|undefined} [options.render = 'canvas'] 渲染
         * @returns {g2.maps.PageLayout} 返回专题图
         */
        var pageLayout = function (opts) {
            var optss = opts || {};
            PageLayout.call(this, opts);
            this.interactions = new ol.Collection();
            this.dragPan = new ol.interaction.DragPan({kinetic: new ol.Kinetic(-0.005, 0.05, 100)});
            this.mouseWheelZoom = new ol.interaction.MouseWheelZoom();
            this.doubleClickZoom = new ol.interaction.DoubleClickZoom();
            this.pinchZoom = new ol.interaction.PinchZoom();
            this.pinchRotate = new ol.interaction.PinchRotate();
            this.keyboardPan = new ol.interaction.KeyboardPan();

            this.interactions.push(this.dragPan);
            this.interactions.push(this.mouseWheelZoom);
            this.interactions.push(this.doubleClickZoom);
            this.interactions.push(this.pinchZoom);
            this.interactions.push(this.pinchRotate);
            this.interactions.push(this.keyboardPan);
            var opt = optss.defaultExtent || {};
            var defaultProj = opt.projection || 'EPSG:3857';
            this.spatialReference = parseInt(defaultProj.split(':')[1]);
            this.fullExtent = optss.fullExtent;
            this.tool = null;
            this.map = new ol.Map({
                view: new ol.View({
                    maxZoom: opt.maxZoom || 15,
                    minZoom: opt.minZoom || 2,
                    center: opt.center || [0, 0],
                    zoom: opt.level || 6,
                    projection: createProject(opt) // opt.projection
                }),
                overlays: [],
                interactions: this.interactions
            });
        }

        ClassUtil.extend2(pageLayout, PageLayout);

        pageLayout.prototype.init = function (opts) {
            this.map.setTarget(opts.targetId);
            targetId = opts.targetId;
            this.map.updateSize();
            var tmap = this.map;
            tmap.getControls().forEach(function (ctr) {
                tmap.removeControl(ctr);
            });
            this.bindEvents();
            this.bindKeyEvent();
        }

        pageLayout.prototype.bindKeyEvent = function () {
            var viewPort = this.map.getViewport();
            var that = this;
            $(viewPort).keydown(function (e) {
                if (!!that.tool) {
                    that.tool.onKeyDown(e.keyCode, e.shiftKey);
                }
            }).keyup(function (e) {
                if (!!that.tool) {
                    that.tool.onKeyUp(e.keyCode, e.shiftKey);
                }
            });
        }

        /**
         * 绑定鼠标事件和事件处理方法以及地图获得焦点与失去焦点的处理方法
         */
        pageLayout.prototype.bindEvents = function () {
            this.map.on('click', this.onClick, this);
            this.map.on('pointermove', this.onMouseMove, this);
            //this.map.on('pointerout', this.onMouseOut, this);
            this.map.on('pointerdown', this.onMouseDown, this);
            this.map.on('pointerup', this.onMouseUp, this);
            //this.map.on('pointerover', this.onMouseOver, this);
            this.map.on('dblclick', this.onDblclick, this);
            this.map.on('moveend', this.onExtentChanged, this);
            this.map.on('change:size', this.onResize, this);
            //this.map.on('focus', this.onFocus, this);
            this.map.on('postcompose', this.onTick, this);
            this.map.getView().on("change:resolution", this.onResolutionChanged, this);
        }

        /**
         * 获取缩放级别
         * @returns {Number} 返回整数表示的缩放级别
         */
        pageLayout.prototype.getZoomLevel = function () {
            var view = this.map.getView();
            return view.getZoom();
        }

        /**
         * 获取视野范围
         * @returns {g2.geom.Envelope} 返回表示视野范围的矩形几何图形
         */
        pageLayout.prototype.getExtent = function () {
            var size = this.map.getSize();
            var view = this.map.getView();
            var extent = view.calculateExtent(size);
            var envelope = new Envelope({
                minx: extent[0],
                miny: extent[1],
                maxx: extent[2],
                maxy: extent[3],
                spatialReference: this.spatialReference
            });
            return envelope;
        }

        /**
         * 地图平移到指定区域
         * @param {g2.geom.Geometry} geometry 几何图形对象
         * @param {Number} padding 范围到边界的距离,像素单位,如[10,10,4,5],如果不设置默认为10
         */
        pageLayout.prototype.pan = function (geometry, padding) {
            var view = this.map.getView();
            var size = this.map.getSize();
            var extent = geometry.envelope();
            view.fit([extent.minx, extent.miny, extent.maxx, extent.maxy], size, {padding: padding || [10, 10, 10, 10]});
        }

        /**
         * 地图缩小
         */
        pageLayout.prototype.zoomOut = function () {
            var view = this.map.getView();
            view.setZoom(view.getZoom() - 1);
        }

        /**
         * 地图放大
         */
        pageLayout.prototype.zoomIn = function () {
            var view = this.map.getView();
            view.setZoom(view.getZoom() + 1);
        }

        /**
         * 地图缩放到指定的级别
         * @param {Number} level 地图缩放级别
         */
        pageLayout.prototype.zoomTo = function (level) {
            var view = this.map.getView();
            view.setZoom(level);
        }

        /**
         * 设置指定的地理坐标点在屏幕中央显示，同时移动地图
         * @param {g2.geom.Point} center 地理坐标点
         */
        pageLayout.prototype.setCenter = function (center) {
            var view = this.map.getView();
            var pan = new ol.animation.pan({
                duration: 100,
                source: view.getCenter()
            });
            this.map.beforeRender(pan);
            view.setCenter([center.x, center.y]);
        }

        pageLayout.prototype.getCenter = function () {
            var view = this.map.getView();
            return view.getCenter();
        }

        /**
         * 获取分辨率
         * @returns 返回浮点数表示的分辨率
         */
        pageLayout.prototype.getResolution = function () {
            var view = this.map.getView();
            return view.getResolution();
        }

        pageLayout.prototype.setResolution = function (resolution) {
            var view = this.map.getView();
            view.setResolution(resolution);
        }

        /**
         * 获取坐标原点
         * @returns {g2.geom.Point} 返回坐标原点
         */
        pageLayout.prototype.getOrigin = function () {
            var view = this.map.getView();
            var projection = view.getProjection();
            var extent = projection.getExtent();
            return ol.extent.getTopLeft(extent);
        }

        /**
         * 返回地图窗口尺寸 px单位
         * @return {Array} 返回地图窗口的尺寸，如[782, 389]
         */
        pageLayout.prototype.getViewSize = function () {
            return this.map.getSize();
        }

        /**
         * openlayer下实现地图全屏
         */
        pageLayout.prototype.fullExtent = function () {
            var view = this.map.getView();
            view.setCenter(this.fullExtent.center);
            view.setZoom(this.fullExtent.level);
        }

        /**
         * 获取指定的地理坐标点在屏幕上的显示位置
         * @@param {Array}  coordinate 地理坐标[x,y]
         * @returns {g2.geom.Point} 返回屏幕坐标
         */
        pageLayout.prototype.getPixelFromCoordinate = function (coordinate) {
            return this.map.getPixelFromCoordinate(coordinate);
        }

        /**
         * 获取屏幕上指定的像素点对应专题图上的地理坐标
         * @param {Array}  pixel 屏幕坐标[x,y]
         * @returns 返回地图坐标
         */
        pageLayout.prototype.getCoordinateFromPixel = function (pixel) {
            return this.map.getCoordinateFromPixel(pixel);
        }

        /**
         * 添加图层
         * @param {g2.lys.ILayer} layer 图层对象
         */
        pageLayout.prototype.addLayer = function (layer) {
            if (layer != null) {
                pageLayout.prototype.uber.addLayer.call(this, layer);
                this.map.addLayer(layer.getLayer());
            }
        }

        /**
         * 删除图层
         * @param {g2.lys.ILayer} layer 要删除的图层
         */
        pageLayout.prototype.removeLayer = function (layer) {
            pageLayout.prototype.uber.removeLayer.call(this, layer);
            this.map.removeLayer(layer.getLayer());
        }

        /**
         * 比例尺改变事件
         * @fires g2.maps.Map#resolutionchanged
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onResolutionChanged = function (e) {
            var oldValue = e.oldValue;
            var view = this.map.getView();
            var newValue = view.getResolution();
            var level = view.getZoom();
            pageLayout.prototype.uber.onResolutionChanged.call(this, newValue, oldValue, level);
        }

        /**
         * 计时器
         * @param time 当前的时间
         */
        pageLayout.prototype.onTick = function (e) {
            var frameState = e.frameState;
            var time = frameState.time;
            this.uber.onTick.call(this, time);
        }

        /**
         * 停止地图拖拽功能
         */
        pageLayout.prototype.stopDragPan = function () {
            this.draggpanFlag ? this.map.removeInteraction(this.dragPan) : null;
            this.draggpanFlag = false;
        }

        /**
         *恢复地图拖拽功能
         */
        pageLayout.prototype.resumeDragpan = function () {
            if (this.removeInteractionsFlag)return;
            !this.draggpanFlag ? this.map.addInteraction(this.dragPan) : null;
            this.draggpanFlag = true;
            this.setCursor('pointer');
        }

        /**
         * 停止双击
         */
        pageLayout.prototype.stopDbClick = function () {
            this.dbClickFlag ? this.map.removeInteraction(this.doubleClickZoom) : null;
            this.dbClickFlag = false;
        }

        /**
         * 继续双击
         */
        pageLayout.prototype.resumeDbClick = function () {
            if (this.removeInteractionsFlag)return;
            var that = this;
            setTimeout(function () {
                !that.dbClickFlag ? that.map.addInteraction(that.doubleClickZoom) : null;
                that.dbClickFlag = true;
            }, 300);
        }

        /**
         * 处理视野范围改变事件
         * @fires g2.maps.Map#extentchanged
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onExtentChanged = function (e) {
            var minErrorValue = 0.00001;
            var view = this.map.getView();
            var extent = e.frameState.extent;
            var centerX = (extent[0] + extent[2]) / 2;
            var centerY = (extent[1] + extent[3]) / 2;
            var fullExtent = view.getProjection().getExtent();
            var minx = fullExtent[0];
            var miny = fullExtent[1];
            var maxx = fullExtent[2];
            var maxy = fullExtent[3];
            var targetX = centerX, targetY = centerY;
            var isNeed = false;
            if (!!fullExtent) {
                if (maxx < centerX && Math.abs(maxx - centerX) > minErrorValue) {
                    targetX = maxx;
                    isNeed = true;
                }
                else if (minx > centerX && Math.abs(minx - centerX) > minErrorValue) {
                    targetX = minx;
                    isNeed = true;
                }
                if (maxy < centerY && Math.abs(maxy - centerY) > minErrorValue) {
                    targetY = maxy;
                    isNeed = true;
                }
                else if (miny > centerY && Math.abs(miny - centerY) > minErrorValue) {
                    targetY = miny;
                    isNeed = true;
                }
                if (isNeed) {
                    this.map.un('moveend', this.onExtentChanged, this);
                    view.setCenter([targetX, targetY]);
                    var that = this;
                    setTimeout(function () {
                        that.map.on('moveend', that.onExtentChanged, that);
                    }, 500);
                }
            }
            pageLayout.prototype.uber.onExtentChanged.call(this, extent[0], extent[3], extent[2], extent[1]);
        }

        /**
         * 处理鼠标单击事件
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onClick = function (e) {
            var button = e.originalEvent.button || 0,
                shift = false, //鏆傛椂鐢╢alse浠ｆ浛
                handle = false,
                screenX = e.pixel[0],
                screenY = e.pixel[1],
                mapX = e.coordinate[0],
                mapY = e.coordinate[1];
            pageLayout.prototype.uber.onMouseClick.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
        }

        /**
         * 处理鼠标按下事件
         * @fires g2.maps.Map#mousedown
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onMouseDown = function (e) {
            var viewPort = this.map.getViewport();
            $(viewPort).attr('tabindex', 1);
            var button = e.originalEvent.button || 0,
                shift = false,
                handle = false,
                screenX = e.pixel[0],
                screenY = e.pixel[1],
                mapX = e.coordinate[0],
                mapY = e.coordinate[1];
            pageLayout.prototype.uber.onMouseDown.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
        }

        /**
         * 处理鼠标抬起事件
         * @fires g2.maps.Map#mouseup
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onMouseUp = function (e) {
            var button = e.originalEvent.button || 0,
                shift = false, //鏆傛椂鐢╢alse浠ｆ浛
                handle = false,
                screenX = e.pixel[0],
                screenY = e.pixel[1],
                mapX = e.coordinate[0],
                mapY = e.coordinate[1];
            pageLayout.prototype.uber.onMouseUp.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
        }

        /**
         * 处理鼠标在地图上方移动事件
         * @fires g2.maps.Map#mousemove
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onMouseMove = function (e) {
            var button = e.originalEvent.button || 0,
                shift = false,
                handle = false,
                screenX = e.pixel[0],
                screenY = e.pixel[1],
                mapX = e.coordinate[0],
                mapY = e.coordinate[1];
            pageLayout.prototype.uber.onMouseMove.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
        }

        /**
         * 处理鼠标双击事件
         * @fires g2.maps.Map#dblclick
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onDblclick = function (e) {
            var pixels = e.pixel;
            var coords = e.coordinate;
            if (this.tool != null) {
                this.tool.onDblclick(e.originalEvent.button);
            }
            pageLayout.prototype.uber.onDblclick.call(this, pixels[0], pixels[1], coords[0], coords[1]);
        }

        /**
         * 恢复地图拖拽功能
         */
        pageLayout.prototype.setCursor = function (cursor) {
            var cur = cursor || 'pointer';
            var viewPort = this.map.getViewport();
            viewPort.style.cursor = cur;
        }

        /**
         * 处理窗口大小改变事件
         * @fires g2.maps.Map#resize
         * @param {Event} e 事件对象
         */
        pageLayout.prototype.onResize = function (e) {
            var newSize = this.getViewSize();
            var oldSize = e.oldValue;
            pageLayout.prototype.uber.onResize.call(this, newSize, oldSize);
        }

        /**
         * 获取当前地图比例尺
         */
        pageLayout.prototype.getScale = function () {
            var resolution = this.map.getView().getResolution();
            return parseInt(resolution * 72 * 39.3701);
        }

        /**
         * 讲页面转换为html元素
         * @param {Function} callback 转换成功回调函数
         * eg:例子中的ele为转换成功后的div元素
         * pageLayout.toHtml(function(ele){});
         */
        pageLayout.prototype.toHtml = function (callback) {
            var element = document.getElementById(targetId);
            html2canvas(element, {
                allowTaint: true,
                taintTest: false,
                onrendered: function (canvas) {
                    var div = document.createElement('div');
                    div.appendChild(canvas);
                    callback(div);
                }
            })
        }

        /**
         * 导出
         * @param {String} name 导出名称
         */
        pageLayout.prototype.export = function (name, callback) {
            var element = document.getElementById(targetId);
            html2canvas(element, {
                allowTaint: true,
                taintTest: false,
                onrendered: function (canvas) {
                    var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
                    var isIE = match ? parseInt(match[1]) : false;
                    var url = canvas.toDataURL();
                    var image = url.replace(/^data:image\/png;base64,/, '');
                    var byteString = atob(image);
                    var buffer = new ArrayBuffer(byteString.length);
                    var intArray = new Uint8Array(buffer);
                    for (var i = 0; i < byteString.length; i++) {
                        intArray[i] = byteString.charCodeAt(i);
                    }
                    var blob= new Blob([intArray], {type: 'image/png'});
                    if (isIE) {
                        if (navigator.msSaveBlob) {
                            return navigator.msSaveBlob(blob, name + ".png");
                        }
                    } else {
                        var alink = document.createElement("a");
                        var objecturl =window.URL.createObjectURL(blob);
                        if ('download' in alink) {
                            alink.setAttribute('download', name);
                        }
                        else {
                            alink.setAttribute('target', '_blank');
                        }
                        alink.href = objecturl;
                        var evt = document.createEvent("MouseEvents");
                        evt.initEvent("click", true, true);
                        alink.dispatchEvent(evt);
                        callback();
                    }
                }
            })
        }
        return pageLayout;
    })