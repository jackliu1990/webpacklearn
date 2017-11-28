
define(function () {

    /***
     * 定义地图要处理的事件列表
     * @returns 返回事件列表
     */
    function createEvents() {
        var events = {};
        events.click = [];
        events.mousemove = [];
        //events.mouseout = [];
        events.mousedown = [];
        events.mouseup = [];
        events.dblclick = [];
        events.extentchanged = [];
        events.resize = [];
        events.resolutionchanged = [];
        events.precompose = [];
        events.postrender = [];
        events.postcompose = [];
        //events.tick = [];
        events.prerender = [];
        events.wheel = [];
        events.position3d=[];
        return events;
    }
    /**
     * @class
     * @classdesc
     * 地图类型接口
     * @alias g2.maps.IMap
     * @returns {g2.maps.IMap} 地图类型接口
     */
    var map = function () {
        //定义地图图层列表
        this.layers = [];
        //定义地图工具对象
        this.tool = null;
        //定义地图鼠标的图标
        this.cursor = null;
        //定义地图事件列表
        this.events = createEvents();
    }

    /**
     * 定义带参数的地图初始化
     * @param {Anonymous} opts 包含初始化参数的复杂对象
     */
    map.prototype.init = function (opts) {
    }

    /**
     * 定义添加图层方法
     * @param {g2.lys.ILayer} layer 添加的图层
     */
    map.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    }
    /**
     * 获取可视范转
     */
    map.prototype.getExtent = function () {
    }
    /**
     * 删除图层
     * @param {g2.lys.ILayer} layer 要删除的图层
     */
    map.prototype.removeLayer = function (layer) {
        var index = this.layers.indexOf(layer);
        if (index >= 0) {
            this.layers.splice(index, 1);
        }
    }
    /**
     * 设置鼠标样式
     * @param {Object} cursor 鼠标样式
     */
    map.prototype.setCursor = function (cursor) {

    }
    /**
     * 返回地图窗口尺寸 px单位
     * @return {Array} 返回地图窗口的尺寸，如[782, 389]
     */
    map.prototype.getViewSize = function () {
    };

    /**
     * 设置地图窗口尺寸大小 px单位
     * @param width  地图宽度
     * @param height 地图高度
     */
    map.prototype.setViewSize=function(width,height){

    };
    /**
     * 获取图层数量
     * @returns {Number} 返回图层数量
     */
    map.prototype.getLayerCount = function () {
        return this.layers.length;
    }

    /**
     * 获取指定索引位置的图层
     * @param {Number} index 索引
     * @returns {g2.lys.ILayer} 返回图层
     */
    map.prototype.getLayer = function (index) {
        return this.layers[index];
    }

    /**
     * 获取所有图层
     * @returns {g2.lys.ILayer} 返回图层数组
     */
    map.prototype.getLayers = function () {
        return this.layers;
    }

    /**
     * 获取地图缩放级别
     */
    map.prototype.getZoomLevel = function () {
    }

    /**
     * 获取分辨率
     */
    map.prototype.getResolution = function () {
    }

    /**
     * 设置分辨率
     */
    map.prototype.setResolution = function () {
    }

    /**
     * 获取坐标原点
     */
    map.prototype.getOrigin = function () {

    }

    /**
     * 查找图层
     * @param {String} name 图层名称
     * @returns {g2.lys.ILayer} 返回图层
     */
    map.prototype.findLayer = function (name) {
        for (var i = 0; i < this.layers.length; ++i) {
            var layer = this.layers[i];
            if (layer.name == name || layer.id == name) {
                return layer;
            }
        }
        return null;
    }

    /**
     * 监听指定名称的鼠标事件并设置关联的事件处理方法
     * @param {String} name 事件名称
     * @param {Function} func 处理方法名称
     */
    map.prototype.on = function (name, func) {
        if (name in this.events) {
            var events = this.events[name];
            events.push(func);
        }
    }

    /**
     * 取消监听指定名称的鼠标事件并取消事件处理方法的关联
     * @param {String} name 事件名称
     * @param {Function} func 处理方法名称
     */
    map.prototype.un = function (name, func) {
        if (name in  this.events) {
            var events = this.events[name];
            for (var i = 0, len = events.length; i < len; ++i) {
                var event = events[i];
                if (event === func) {
                    events.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    /**
     * 地图缩放到空间数据定义的全图范围
     */
    map.prototype.fullExtent = function () {
    }

    /**
     * 地图缩小
     */
    map.prototype.zoomOut = function () {
    }

    /**
     * 地图放大
     */
    map.prototype.zoomIn = function () {
    }

    /**
     * 缩放到指定级别
     */
    map.prototype.zoomTo = function (level) {

    }

    /**
     * 平移几何图形对象
     * @param {g2.geom.Geometry} geometry 几何图形
     */
    map.prototype.pan = function (geometry) {
    }

    /**
     * 地图旋转by陈林
     */
    map.prototype.rotate = function (){

    }

    /**
     * 设定指定的坐标点为地图中心点
     * @param {Point} center 地理坐标点
     */
    map.prototype.setCenter = function (center) {
    }

    /**
     * 获取指定的地理坐标点显示在屏幕上的位置
     * @param {Array} coordinate 地理坐标点[x,y]
     */
    map.prototype.getPixelFromCoordinate = function (coordinate) {
    }

    /**
     * 获取屏幕上指定像素点对应的地理坐标点
     * @param {Array} pixel 屏幕像素点坐标[x,y]
     */
    map.prototype.getCoordinateFromPixel = function (pixel) {
    }

    /**
     * 导出
     * @param {String} name 导出名称
     */
    map.prototype.export = function (name) {
    }

    /**
     * 停止拖拽
     */
    map.prototype.stopDragPan = function () {
    }

    /**
     * 继续拖拽
     */
    map.prototype.resumeDragpan = function () {
    }

    /**
     * 停止双击
     */
    map.prototype.stopDbClick = function () {
    }

    /**
     * 继续双击
     */
    map.prototype.resumeDbClick = function () {
    }

    /**
     * 停止放大缩小
     */
    map.prototype.stopMouseWheelZoom = function () {
    }

    /**
     * 继续放大缩小
     */
    map.prototype.resumeMouseWheelZoom = function () {
    }

    /**
     * 添加地图相关控件
     * @param {Object} ctl 控件
     */
    map.prototype.addControl = function (ctl) {
    }
    /**
     * 当前正在使用的地图工具
     * @param {g2.cmd.ToolBase} tool 地图工具
     */
    map.prototype.currentTool = function (tool) {
        if (this.tool != tool) {
            if (this.tool != null) {
                this.tool.deactivate();
            }
            this.tool = tool;
            if (this.tool != null) {
                this.cursor = this.tool.cursor;
            }
        }
    }

    /**
     * 鼠标单击事件
     * @fires g2.maps.IMap#mouseclick
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseClick = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseClick(button, shift, screenX, screenY, mapX, mapY, handle);
        }
        for (var i = 0; i < this.events.click.length; ++i) {
            var event = this.events.click[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标悬停事件
     * @fires IMap#mouseover
     * @param {Event} e 事件对象
     */
    map.prototype.onMouseOver = function (e) {
        if (this.tool != null) {
            this.tool.onMouseOver(e);
        }
    }

    /**
     * 鼠标按键按下时的事件处理方法
     * @fires IMap#mousedown
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseDown = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseDown(button, shift, screenX, screenY, mapX, mapY, handle);
        }

        for (var i = 0; i < this.events.mousedown.length; ++i) {
            var event = this.events.mousedown[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标按键按下后抬起的事件的处理方法
     * @fires g2.maps.IMap#mouseup
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseUp = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseUp(button, shift, screenX, screenY, mapX, mapY, handle);
        }

        for (var i = 0; i < this.events.mouseup.length; ++i) {
            var event = this.events.mouseup[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标移动事件处理方法
     * @fires g2.maps.IMap#mousemove
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseMove = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseMove(button, shift, screenX, screenY, mapX, mapY, handle);
        }

        for (var i = 0; i < this.events.mousemove.length; ++i) {
            var event = this.events.mousemove[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 地图可视范围改变事件
     * @fires g2.maps.IMap#extentchanged
     * @param {Number} left 左上角X坐标
     * @param {Number} top 左上角Y坐标
     * @param {Number} right 右下角X坐标
     * @param {Number} bottom 右下角Y坐标
     */
    map.prototype.onExtentChanged = function (left, top, right, bottom) {
        for (var i = 0; i < this.events.extentchanged.length; ++i) {
            var event = this.events.extentchanged[i];
            event(left, top, right, bottom);
        }
    }
    ///**
    // * 计时器
    // * @param time 当前的时间
    // */
    //map.prototype.onTick = function (time) {
    //    for (var i = 0; i < this.events.tick.length; ++i) {
    //        var event = this.events.tick[i];
    //        event(time);
    //    }
    //}//
    /**
     * 鼠标双击事件
     * @fires g2.maps.IMap#dblclick
     * @param {Number} pixelX 屏幕坐标x
     * @param {Number} pixelY 屏幕坐标y
     * @param {Number} coordinateX 地图坐标x
     * @param {Number} coordinateY 地图坐标y
     */
    map.prototype.onDblclick = function (pixelX, pixelY, coordinateX, coordinateY) {
        for (var i = 0; i < this.events.dblclick.length; ++i) {
            var event = this.events.dblclick[i];
            event(pixelX, pixelY, coordinateX, coordinateY);
        }
    }
    /***
     * 返回第三方的map对象，该对象不受平台维护
     */
    map.prototype.getMapControl = function () {
    }
    /**
     * 比例尺改变事件
     * @fires g2.maps.IMap#resolutionchanged
     * @param {Number} newResolution 新的分辨率
     * @param {Number} oldResolution 旧的分辨率值
     * @param {Number} level 当前层级
     */
    map.prototype.onResolutionChanged = function (newResolution, oldResolution, level) {
        for (var i = 0; i < this.events.resolutionchanged.length; ++i) {
            var event = this.events.resolutionchanged[i];
            event(newResolution, oldResolution, level);
        }
    }

    /**
     * 浏览器窗口大小改变事件
     * @fires g2.maps.IMap#resize
     * @param {Number} newSize 新的窗口尺寸,如：[782, 389]
     * @param {Number} oldSize 旧的窗口尺寸，如：[1440,719]
     */
    map.prototype.onResize = function (newSize, oldSize) {

        for (var i = 0; i < this.events.resize.length; ++i) {
            var event = this.events.resize[i];
            event(newSize, oldSize);
        }
    }
    /**
     *
     */
    map.prototype.onWheel = function (wheel) {
        for (var i = 0; i < this.events.wheel.length; ++i) {
            var event = this.events.wheel[i];
            event(wheel);
        }
    }
    /**
     * 渲染前
     * @fires g2.maps.Map#precompose
     * @param {Event} e 事件对象
     */
    map.prototype.onPreCompose = function (e) {
        for (var i = 0; i < this.events.precompose.length; ++i) {
            var event = this.events.precompose[i];
            event(e);
        }
    }

    /**
     * 渲染完成
     * @fires g2.maps.Map#postrender
     * @param {Event} e 事件对象
     */
    map.prototype.onPostRender = function (e) {
        for (var i = 0; i < this.events.postrender.length; ++i) {
            var event = this.events.postrender[i];
            event(e);
        }
    }

    /**
     * 正在渲染
     * @fires g2.maps.Map#postcompose
     * @param {Event} e 事件对象
     */
    map.prototype.onPostCompose = function (e) {
        for (var i = 0; i < this.events.postcompose.length; ++i) {
            var event = this.events.postcompose[i];
            event(e);
        }
    }
    /**
     * 地图获得焦点的事件
     * @param {Event} e 事件对象
     */
    //map.prototype.onFocus = function (e) {
    //}
    /**
     * 移除地图相关的交互
     */
    map.prototype.removeInteractions = function () {
    }
    /**
     * 重置地图相关的交互
     */
    map.prototype.resumeInteractions = function () {
    }

    /**
     * 开启或关闭图层聚类的散射效果，对所有的聚类图层都起作用，开启后地图处于选择要素状态，地图不能拖动，
     * @param {Boolean} flag true或false
     */
    map.prototype.setClusterScatter = function (flag) {
    }

    return map;

})