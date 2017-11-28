/**
 * @author by ligang on 2014/10/14
 */
define(['classUtil', 'map', 'ol', 'envelope', 'jquery'], function (ClassUtil, Map, ol, Envelope, $) {

    /***
     * 创建指定坐标系和视野范围的地图
     * @param {Anonymous} [options] 创建地图时传入的参数组成的复杂对象
     * @param {Object} [options.projection]
     * @param {Object} [options.extent]
     * @returns 返回创建的地图
     */
    function createProject(opt) {
        var code = opt.projection ? opt.projection : 'EPSG:3857';
        var extent = opt.extent;
        if (!!extent) {
            var proj = new ol.proj.Projection({code: opt.projection, extent: opt.extent});
            return proj;
        }
        return code;
    }

    /**
     * @class
     * @classdesc
     * 地图类型
     * @alias g2.maps.Map
     * @augments g2.maps.IMap
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
     * @returns {g2.maps.Map} 返回创建的地图
     */
    var olmap = function (opts) {
        var optss = opts || {};
        Map.call(this, optss);
        //缩放和平移等事件处理对象与方法的集合
        this.interactions = new ol.Collection();
        //地图拖曳参数
        this.dragPan = new ol.interaction.DragPan({kinetic: new ol.Kinetic(-0.005, 0.05, 100)});
        //鼠标滚轮滚动事件处理（放大或缩小地图）
        this.mouseWheelZoom = new ol.interaction.MouseWheelZoom();
        //双击事件处理（放大地图）
        this.doubleClickZoom = new ol.interaction.DoubleClickZoom();
        //缩放
        this.pinchZoom = new ol.interaction.PinchZoom();
        //旋转
        //选择
        var invisibleFill = new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.01)'
        });

        this.select = new ol.interaction.Select({
            condition: function (evt) {
                return evt.originalEvent.type == 'mousemove' || evt.type == 'singleclick';
            },
            style: function selectStyleFunction(feature, resolution) {
                var originalFeatures = feature.get('features');
                if (originalFeatures.length > 10)
                    return [feature.getStyle()];
                var styles = [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: feature.get('radius'),
                        fill: invisibleFill
                    })
                })];
                var originalFeature;
                for (var i = originalFeatures.length - 1; i >= 0; --i) {
                    originalFeature = originalFeatures[i];
                    var style = originalFeature.getStyle();
                    style.setGeometry(originalFeature.getGeometry());
                    styles.push(style);
                }
                return styles;
            }
        });
        var opt = optss.defaultExtent || {};
        this.tempControl = [];
        //qaqqqthis.pinchRotate = new ol.interaction.PinchRotate();
        this.keyboardPan = new ol.interaction.KeyboardPan();
        var defaultProj = opt.projection || 'EPSG:3857';
        this.spatialReference = parseInt(defaultProj.split(':')[1]);
        this.interactions.push(this.select);
        this.interactions.push(this.dragPan);
        this.interactions.push(this.mouseWheelZoom);
        this.interactions.push(this.doubleClickZoom);
        this.interactions.push(this.pinchZoom);
        //this.interactions.push(this.pinchRotate);
        this.interactions.push(this.keyboardPan);
        //全图
        this._fullExtent = optss.fullExtent;
        //地图
        this.map = new ol.Map({
            view: new ol.View({
                maxZoom: opt.maxZoom == undefined ? 15 : opt.maxZoom,
                minZoom: opt.minZoom == undefined ? 2 : opt.minZoom,
                center: opt.center || [0, 0],
                zoom: opt.level == undefined ? 6 : opt.level,
                projection: createProject(opt) // opt.projection
            }),
            overlays: [],
            interactions: this.interactions,
            renderer: optss.renderer || 'canvas'
        });
        this.map.setSize([window.innerWidth, window.innerHeight]);
        //是否可以拖动地图
        this.draggpanFlag = true;
        //是否双击放大地图
        this.dbClickFlag = true;
        //是否可以禁止鼠标放大缩小
        this.mouseWheelZoomFlag = true;
        this.removeInteractionsFlag = false;
        this.clusterScatterFlag = true;
        this.tool = null;
        this.setClusterScatter(false);
    }

    ClassUtil.extend2(olmap, Map);

    /**
     * OpenLayer地图初始化
     * @param {Anonymous} opts 初始化使用的参数
     */
    olmap.prototype.init = function (opts) {
        this.map.setTarget(opts.targetId);
        this.map.updateSize();
        for (i = 0; i < this.tempControl.length; i++) {
            this.map.addControl(this.tempControl[i]);
        }
        this.bindKeyEvent();
        this.bindEvents();
    }
    olmap.prototype.addControl = function (control) {
        this.tempControl.push(control)
    }

    olmap.prototype.addScaleLineControl = function (className) {
        var sc = new ol.control.ScaleLine({
            className: className
        });
        this.map.addControl(sc);
    };

    olmap.prototype.bindKeyEvent = function () {
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
    olmap.prototype.bindEvents = function () {
        /*
         BROWSER_EVENTS: [
         2     "mouseover",        //鼠标位于对象或区域上
         3     "mouseout",          //鼠标移出
         4     "mousedown",      //鼠标按下
         5     "mouseup",           //鼠标抬起
         6     "mousemove",      //鼠标移动
         7     "click",                   //鼠标单击
         8     "dblclick",             //鼠标双击
         11    "resize",               //调整大小
         12    "focus",               //获得焦点
         13    "blur"                  //
         14 ],
         */
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
        //this.map.on('postcompose',this.onTick,this);
        this.map.getView().on("change:resolution", this.onResolutionChanged, this);
        this.map.on('precompose',this.onPreCompose,this);//准备渲染
        this.map.on('postrender',this.onPostRender,this);//渲染完成
        this.map.on('postcompose',this.onPostCompose,this);//正在渲染
    }
    /**
     * 添加图层
     * @param {g2.lys.ILayer} layer 图层对象
     */
    olmap.prototype.addLayer = function (layer) {
        if (layer != null) {
            olmap.prototype.uber.addLayer.call(this, layer);
            this.map.addLayer(layer.getLayer());
            if (layer.hasOwnProperty('map') && layer['map'] == null) {
                layer.map = this;
            }
            layer.init();
        }
    }
    /**
     * 处理鼠标单击事件
     * @param {Event} e 事件对象
     */
    olmap.prototype.onClick = function (e) {
        var button = e.originalEvent.button || 0,
            shift = false, //鏆傛椂鐢╢alse浠ｆ浛
            handle = false,
            screenX = e.pixel[0],
            screenY = e.pixel[1],
            mapX = e.coordinate[0],
            mapY = e.coordinate[1];
        olmap.prototype.uber.onMouseClick.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
    }

    /**
     * 开启或关闭图层聚类的散射效果，对所有的聚类图层都起作用，开启后地图处于选择要素状态，地图不能拖动
     * @param {Boolean} flag true或false
     */
    olmap.prototype.setClusterScatter = function (flag) {
        if (!!flag && !this.clusterScatterFlag) {
            this.interactions.insertAt(0, this.select);
            this.clusterScatterFlag = true;
        }
        else {
            if (this.clusterScatterFlag) {
                this.interactions.removeAt(0);
                this.clusterScatterFlag = false;
            }
        }
    }

    /**
     * 获取视野范围
     * @returns {g2.geom.Envelope} 返回表示视野范围的矩形几何图形
     */
    olmap.prototype.getExtent = function () {
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
     * 获取缩放级别
     * @returns {Number} 返回整数表示的缩放级别
     */
    olmap.prototype.getZoomLevel = function () {
        var view = this.map.getView();
        return view.getZoom();
    }
    /**
     * 获取分辨率
     * @returns {Number} 返回浮点数表示的分辨率
     */
    olmap.prototype.getResolution = function () {
        var view = this.map.getView();
        return view.getResolution();
    }

    olmap.prototype.setResolution = function (resolution) {
        var view = this.map.getView();
        view.setResolution(resolution);
    }
    /**
     * 返回第三方的map对象，该对象不受平台维护
     * @deprecated
     */
    olmap.prototype.getMapControl = function () {
        olmap.prototype.uber.getMapControl.call(this);
        return this.map;
    }
    /**
     * 获取坐标原点
     * @returns {g2.geom.Point} 返回坐标原点
     */
    olmap.prototype.getOrigin = function () {
        var view = this.map.getView();
        var projection = view.getProjection();
        var extent = projection.getExtent();
        return ol.extent.getTopLeft(extent);
    }
    /**
     * 返回地图窗口尺寸 px单位
     * @return {Array} 返回地图窗口的尺寸，如[782, 389]
     */
    olmap.prototype.getViewSize = function () {
        return this.map.getSize();
    };


    /**
     * 设置地图窗口尺寸大小 px单位
     * @param width  地图宽度
     * @param height 地图高度
     */
    olmap.prototype.setViewSize = function (width, height) {
        this.map.setSize([width, height]);
    };
    ///**
    // * 处理鼠标悬停事件
    // * @param Event e 事件对象
    // */
    //olmap.prototype.onMouseOver = function (e) {
    //    olmap.prototype.uber.onMouseOver.call(this, e);
    //}
    ///**
    // * 处理鼠标移出地图的事件
    // * @param Event e 事件对象
    // */
    //olmap.prototype.onMouseOut = function (e) {
    //    olmap.prototype.uber.onMouseOver.call(this, e);
    //}
    /**
     * 处理鼠标按下事件
     * @fires g2.maps.Map#mousedown
     * @param {Event} e 事件对象
     */
    olmap.prototype.onMouseDown = function (e) {
        var viewPort = this.map.getViewport();
        $(viewPort).attr('tabindex', 1);
        var button = e.originalEvent.button || 0,
            shift = false, //鏆傛椂鐢╢alse浠ｆ浛
            handle = false,
            screenX = e.pixel[0],
            screenY = e.pixel[1],
            mapX = e.coordinate[0],
            mapY = e.coordinate[1];
        olmap.prototype.uber.onMouseDown.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
    }
    /**
     * 处理鼠标抬起事件
     * @fires g2.maps.Map#mouseup
     * @param {Event} e 事件对象
     */
    olmap.prototype.onMouseUp = function (e) {
        var button = e.originalEvent.button || 0,
            shift = false, //鏆傛椂鐢╢alse浠ｆ浛
            handle = false,
            screenX = e.pixel[0],
            screenY = e.pixel[1],
            mapX = e.coordinate[0],
            mapY = e.coordinate[1];
        olmap.prototype.uber.onMouseUp.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
    }
    /**
     * 处理鼠标在地图上方移动事件
     * @fires g2.maps.Map#mousemove
     * @param {Event} e 事件对象
     */
    olmap.prototype.onMouseMove = function (e) {
        var button = e.originalEvent.button || 0,
            shift = false, //鏆傛椂鐢╢alse浠ｆ浛
            handle = false,
            screenX = e.pixel[0],
            screenY = e.pixel[1],
            mapX = e.coordinate[0],
            mapY = e.coordinate[1];
        olmap.prototype.uber.onMouseMove.call(this, button, shift, screenX, screenY, mapX, mapY, handle);
    }
    /**
     * 处理视野范围改变事件
     * @fires g2.maps.Map#extentchanged
     * @param {Event} e 事件对象
     */
    olmap.prototype.onExtentChanged = function (e) {
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
        olmap.prototype.uber.onExtentChanged.call(this, extent[0], extent[3], extent[2], extent[1]);
    }
    /**
     * 处理鼠标双击事件
     * @fires g2.maps.Map#dblclick
     * @param {Event} e 事件对象
     */
    olmap.prototype.onDblclick = function (e) {
        var pixels = e.pixel;
        var coords = e.coordinate;
        if (this.tool != null) {
            this.tool.onDblclick(e.originalEvent.button);
        }
        olmap.prototype.uber.onDblclick.call(this, pixels[0], pixels[1], coords[0], coords[1]);
    }
    /**
     * 处理窗口大小改变事件
     * @fires g2.maps.Map#resize
     * @param {Event} e 事件对象
     */
    olmap.prototype.onResize = function (e) {
        var newSize = this.getViewSize();
        var oldSize = e.oldValue;
        olmap.prototype.uber.onResize.call(this, newSize, oldSize);
    }
    /**
     * 比例尺改变事件
     * @fires g2.maps.Map#resolutionchanged
     * @param {Event} e 事件对象
     */
    olmap.prototype.onResolutionChanged = function (e) {
        var oldValue = e.oldValue;
        var view = this.map.getView();
        var newValue = view.getResolution();
        var level = view.getZoom();
        olmap.prototype.uber.onResolutionChanged.call(this, newValue, oldValue, level);
    }

    /**
     * 准备渲染
     * @fires g2.maps.Map#precompose
     * @param {Event} e 事件对象
     */
    olmap.prototype.onPreCompose = function (e) {
        olmap.prototype.uber.onPreCompose.call(this,e);
    }

    /**
     * 渲染完成
     * @fires g2.maps.Map#postrender
     * @param {Event} e 事件对象
     */
    olmap.prototype.onPostRender = function (e) {
        olmap.prototype.uber.onPostRender.call(this,e);
    }

    /**
     * 正在渲染
     * @fires g2.maps.Map#postcompose
     * @param {Event} e 事件对象
     */
    olmap.prototype.onPostCompose = function (e) {
        olmap.prototype.uber.onPostCompose.call(this,e);
    }
    /**
     * 处理导出地图为图片的事件
     * @param {String} name 名称
     */
    olmap.prototype.export = function (name) {
        this.map.once('postcompose', function (e) {
            var canvas = e.context.canvas;
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
                //IE10+
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
            }
        });
        this.map.renderSync();
    };
    ///**
    // * 处理地图获取焦点事件
    // //* @param Event e 事件对象
    // */
    //olmap.prototype.onFocus = function (e) {
    //    this.uber.onFocus.call(this, e);
    //}
    ///**
    // * 计时器
    // * @param time 当前的时间
    // */
    //olmap.prototype.onTick = function(e){
    //    var frameState = e.frameState;
    //    var time = frameState.time;
    //    this.uber.onTick.call(this, time);
    //}
    /**
     *   停止地图拖拽功能
     */
    olmap.prototype.stopDragPan = function () {
        this.draggpanFlag ? this.map.removeInteraction(this.dragPan) : null;
        this.draggpanFlag = false;
    }
    /**
     *   恢复地图拖拽功能
     */
    olmap.prototype.resumeDragpan = function () {
        if (this.removeInteractionsFlag)return;
        !this.draggpanFlag ? this.map.addInteraction(this.dragPan) : null;
        this.draggpanFlag = true;
        this.setCursor('pointer');
    }
    /**
     * 停止双击
     */
    olmap.prototype.stopDbClick = function () {
        this.dbClickFlag ? this.map.removeInteraction(this.doubleClickZoom) : null;
        this.dbClickFlag = false;
    }
    /**
     * 继续双击
     */
    olmap.prototype.resumeDbClick = function () {
        if (this.removeInteractionsFlag)return;
        var that = this;
        setTimeout(function () {
            !that.dbClickFlag ? that.map.addInteraction(that.doubleClickZoom) : null;
            that.dbClickFlag = true;
        }, 300);
    }

    /**
     * 停止放大缩小
     */
    olmap.prototype.stopMouseWheelZoom = function () {
        this.mouseWheelZoomFlag ? this.map.removeInteraction(this.mouseWheelZoom) : null;
        this.mouseWheelZoomFlag = false;
    }

    /**
     * 继续放大缩小
     */
    olmap.prototype.resumeMouseWheelZoom = function () {
        if (this.removeInteractionsFlag)return;
        !this.mouseWheelZoomFlag ? this.map.addInteraction(this.mouseWheelZoom) : null;
        this.mouseWheelZoomFlag = true;
    }


    /**
     * 移除地图相关的交互
     */
    olmap.prototype.removeInteractions = function () {
        var that = this;
        this.interactions.forEach(function (interaction) {
            that.map.removeInteraction(interaction);
        });
        this.dbClickFlag = false;
        this.draggpanFlag = false;
        this.removeInteractionsFlag = true;
    }
    /**
     * 重置地图相关的交互
     */
    olmap.prototype.resumeInteractions = function () {
        var that = this;
        setTimeout(function () {
            that.interactions.forEach(function (interaction) {
                that.map.addInteraction(interaction);
            });
        }, 300);

        this.dbClickFlag = true;
        this.draggpanFlag = true;
        this.removeInteractionsFlag = false;
    }
    /**
     *   openlayer下实现地图全屏
     */
    olmap.prototype.fullExtent = function () {
        var view = this.map.getView();
        view.setCenter(this._fullExtent.center);
        view.setZoom(this._fullExtent.level);
    }
    /**
     * 地图缩小
     */
    olmap.prototype.zoomOut = function () {
        var view = this.map.getView();
        view.setZoom(view.getZoom() - 1);
    }
    /**
     * 地图放大
     */
    olmap.prototype.zoomIn = function () {
        var view = this.map.getView();
        view.setZoom(view.getZoom() + 1);
    }
    /**
     * 地图缩放到指定的级别
     * @param {Number} level 地图缩放级别
     */
    olmap.prototype.zoomTo = function (level) {
        var view = this.map.getView();
        view.setZoom(level);
    }
    /**
     * 设置当前地图工具，常用于标绘工具的设置
     * @param {ToolBase} tool 地图标绘工具对象
     */
    /*olmap.prototype.currentTool = function (tool) {
     olmap.prototype.uber.currentTool.call(this, tool);
     this.tool = tool;
     if (tool != null) {
     var cursor = tool.cursor;
     this.setCursor(cursor);
     }
     }*/

    olmap.prototype.setCursor = function (cursor) {
        var cur = cursor || 'pointer';
        var viewPort = this.map.getViewport();
        viewPort.style.cursor = cur;
    }

    olmap.prototype.removeLayer = function (layer) {
        olmap.prototype.uber.removeLayer.call(this, layer);
        this.map.removeLayer(layer.getLayer());
    }

    /**
     * 设置指定的地理坐标点在屏幕中央显示，同时移动地图
     * @param {g2.geom.Point} center 地理坐标点
     */
    olmap.prototype.setCenter = function (center) {
        var view = this.map.getView();
        var pan = new ol.animation.pan({
            duration: 100,
            source: view.getCenter()
        });
        this.map.beforeRender(pan);
        view.setCenter([center.x, center.y]);
    }

    olmap.prototype.getCenter = function () {
        var view = this.map.getView();
        return view.getCenter();
    }
    /**
     * 地图平移到指定区域
     * @param {g2.geom.Geometry} geometry 几何图形对象
     * @param {Number} padding 范围到边界的距离,像素单位,如[10,10,4,5],如果不设置默认为10
     */
    olmap.prototype.pan = function (geometry, padding) {
        var view = this.map.getView();
        var size = this.map.getSize();
        var extent = geometry.envelope();
        view.fit([extent.minx, extent.miny, extent.maxx, extent.maxy], size, {padding: padding || [10, 10, 10, 10]});
    }
    /**
     * 获取指定的地理坐标点在屏幕上的显示位置
     * @param {Array} coordinate 地理坐标点[x,y]
     * @returns {g2.geom.Point} 返回屏幕坐标
     */
    olmap.prototype.getPixelFromCoordinate = function (coordinate) {
        return this.map.getPixelFromCoordinate(coordinate);
    }
    /**
     * 获取屏幕上指定的像素点对应地图上的地理坐标
     * @param {Array} pixel 屏幕坐标[x,y]
     * @returns 返回地图坐标
     */
    olmap.prototype.getCoordinateFromPixel = function (pixel) {
        return this.map.getCoordinateFromPixel(pixel);
    }
    return olmap;

})