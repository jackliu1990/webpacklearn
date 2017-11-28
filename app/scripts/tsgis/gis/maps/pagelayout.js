/**
 * @author by wangyanxin on 2016-07-25.
 */
define(function () {

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
        events.tick = [];
        return events;
    }

    /**
     * @class
     * @classdesc
     * 专题图接口
     * @alias g2.maps.IPageLayout
     * @returns {g2.maps.IPageLayout} 返回专题图接口
     */
    var pageLayout = function () {
        this.tool = null;
        this.layers = [];
        this.cursor = null;
        this.events = createEvents();
    }

    pageLayout.prototype.init = function (opts) {

    }

    /**
     * 添加图层
     * @param {g2.lys.ILayer} layer 图层对象
     */
    pageLayout.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    }

    /**
     * 获取视野范围
     */
    pageLayout.prototype.getExtent = function () {

    }

    /**
     * 删除图层
     * @param {g2.lys.ILayer} layer 要删除的图层
     */
    pageLayout.prototype.removeLayer = function (layer) {
        var index = this.layers.indexOf(layer);
        if (index > 0) {
            this.layers.splice(index, 1);
        }
    }

    /**
     * 设置鼠标样式
     * @param {Object} cursor 鼠标样式
     */
    pageLayout.prototype.setCursor = function (cursor) {

    }

    /**
     * 返回地图窗口尺寸 px单位
     * @return {Array} 返回地图窗口的尺寸，如[782, 389]
     */
    pageLayout.prototype.getViewSize = function () {

    }

    /**
     * 获取图层数量
     * @returns {Number} 返回图层数量
     */
    pageLayout.prototype.getLayerCount = function () {
        return this.layers.length;
    }

    /**
     * 获取指定索引位置的图层
     * @param {Number} index 索引
     * @returns {g2.lys.ILayer} 返回图层
     */
    pageLayout.prototype.getLayer = function (index) {
        return this.layers[index];
    }

    /**
     * 获取所有图层
     * @returns {g2.lys.ILayer} 返回图层数组
     */
    pageLayout.prototype.getLayers = function () {
        return this.layers;
    }

    /**
     * 获取地图缩放级别
     */
    pageLayout.prototype.getZoomLevel = function () {

    }

    /**
     * 获取分辨率
     */
    pageLayout.prototype.getResolution = function () {

    }

    /**
     * 设置分辨率
     */
    pageLayout.prototype.setResolution = function () {

    }

    /**
     * 获取坐标原点
     */
    pageLayout.prototype.getOrigin = function () {

    }

    /**
     * 查找图层
     * @param {String} name 图层名称
     * @returns {g2.lys.ILayer} 返回图层
     */
    pageLayout.prototype.findLayer = function (name) {
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
    pageLayout.prototype.on = function (name, func) {
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
    pageLayout.prototype.un = function (name, func) {
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
     * 获取当前地图比例尺
     */
    pageLayout.prototype.getScale = function () {
    }


    /**
     * 讲页面转换为html元素
     * @param {Function} callback 转换成功回调函数
     * eg:例子中的ele为转换成功后的div元素
     * pageLayout.toHtml(function(ele){});
     */
    pageLayout.prototype.toHtml = function (callback) {

    }

    /**
     * 地图缩放到空间数据定义的全图范围
     */
    pageLayout.prototype.fullExtent = function () {

    }

    /**
     * 地图缩小
     */
    pageLayout.prototype.zoomOut = function () {

    }

    /**
     * 地图放大
     */
    pageLayout.prototype.zoomIn = function () {

    }

    /**
     * 缩放到指定级别
     */
    pageLayout.prototype.zoomTo = function (level) {

    }

    /**
     * 平移几何图形对象
     * @param {g2.geom.Geometry} geometry 几何图形
     */
    pageLayout.prototype.pan = function (geometry) {

    }

    /**
     * 设定指定的坐标点为地图中心点
     * @param {Point} center 地理坐标点
     */
    pageLayout.prototype.setCenter = function (center) {

    }

    /**
     * 获取指定的地理坐标点显示在屏幕上的位置
     * @param {Array} coordinate 地理坐标点[x,y]
     */
    pageLayout.prototype.getPixelFromCoordinate = function (coordinate) {

    }

    /**
     * 获取屏幕上指定像素点对应的地理坐标点
     * @param {Array} pixel 屏幕像素点坐标[x,y]
     */
    pageLayout.prototype.getCoordinateFromPixel = function (pixel) {

    }

    /**
     * 获取当前视图中心点
     */
    pageLayout.prototype.getCenter = function () {

    }

    /**
     * 导出
     * @param {String} name 导出名称
     */
    pageLayout.prototype.export = function (name, callback) {

    }

    /**
     * 停止拖拽
     */
    pageLayout.prototype.stopDragPan = function () {

    }

    /**
     * 继续拖拽
     */
    pageLayout.prototype.resumeDragpan = function () {

    }

    /**
     * 停止双击
     */
    pageLayout.prototype.stopDbClick = function () {

    }

    /**
     * 继续双击
     */
    pageLayout.prototype.resumeDbClick = function () {

    }

    /**
     * 当前正在使用的地图工具
     * @param {g2.cmd.ToolBase} tool 地图工具
     */
    pageLayout.prototype.currentTool = function (tool) {
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
    pageLayout.prototype.onMouseClick = function (button, shift, screenX, screenY, mapX, mapY, handle) {
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
    pageLayout.prototype.onMouseOver = function (e) {
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
    pageLayout.prototype.onMouseDown = function (button, shift, screenX, screenY, mapX, mapY, handle) {
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
    pageLayout.prototype.onMouseUp = function (button, shift, screenX, screenY, mapX, mapY, handle) {
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
    pageLayout.prototype.onMouseMove = function (button, shift, screenX, screenY, mapX, mapY, handle) {
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
    pageLayout.prototype.onExtentChanged = function (left, top, right, bottom) {
        for (var i = 0; i < this.events.extentchanged.length; ++i) {
            var event = this.events.extentchanged[i];
            event(left, top, right, bottom);
        }
    }

    /**
     * 计时器
     * @param time 当前的时间
     */
    pageLayout.prototype.onTick = function (time) {
        for (var i = 0; i < this.events.tick.length; ++i) {
            var event = this.events.tick[i];
            event(time);
        }
    }

    /**
     * 鼠标双击事件
     * @fires g2.maps.IMap#dblclick
     * @param {Number} pixelX 屏幕坐标x
     * @param {Number} pixelY 屏幕坐标y
     * @param {Number} coordinateX 地图坐标x
     * @param {Number} coordinateY 地图坐标y
     */
    pageLayout.prototype.onDblclick = function (pixelX, pixelY, coordinateX, coordinateY) {
        for (var i = 0; i < this.events.dblclick.length; ++i) {
            var event = this.events.dblclick[i];
            event(pixelX, pixelY, coordinateX, coordinateY);
        }
    }

    /**
     * 比例尺改变事件
     * @fires g2.maps.IMap#resolutionchanged
     * @param {Number} newResolution 新的分辨率
     * @param {Number} oldResolution 旧的分辨率值
     * @param {Number} level 当前层级
     */
    pageLayout.prototype.onResolutionChanged = function (newResolution, oldResolution, level) {
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
    pageLayout.prototype.onResize = function (newSize, oldSize) {
        for (var i = 0; i < this.events.resize.length; ++i) {
            var event = this.events.resize[i];
            event(newSize, oldSize);
        }
    }

    //pageLayout.prototype.onFocus = function (e) {
    //}

    return pageLayout;
})