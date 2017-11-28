define([],function(){
    var globe = function(options){
    }

    /**
     * @param position
     * @param height
     * @param orientation
     */
    globe.prototype.flyTo = function(position, height, orientation){
    }

    globe.prototype.flyPath = function(path, starttime, endtime){
    }

    /**
     * @param geomety
     */
    globe.prototype.flyToGeometry = function(geomety){
    }
    globe.prototype.getAltitude = function(path,cartographicArr){

    }
    globe.prototype.flyPath = function(path, timelong, markerSymbol, following){
    }
    globe.prototype.stopFly = function () {
    }
    globe.prototype.pauseFly = function () {
    }
    /**
     * @param flag
     */
    globe.prototype.enableSkyAtmosphere = function(flag){
    }

    /**
     *
     * @param flag
     */
    globe.prototype.enableLight = function(flag){
    }
    globe.prototype.pickPosition = function(pixels){
    }
    globe.prototype.pickSurfacePosition = function(pixels){
    }
    /**
     *
     * @param flag
     */
    globe.prototype.enableShadows = function(flag){
    }
    globe.prototype.startAnimation = function(){
    }
    globe.prototype.stopAnimation = function(){
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
    globe.prototype.onMouseClick3d = function (button, shift, screenX, screenY, handle) {
        if (!!this.tool && !!this.tool.onMouseClicked) {
            this.tool.onMouseClicked(button, shift, screenX, screenY, handle);
        }
        for (var i = 0; i < this.events.click.length; ++i) {
            var event = this.events.click[i];
            event(button, shift, screenX, screenY, 0, 0, handle);
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
    globe.prototype.onMouseDown3d = function (button, shift, screenX, screenY, handle) {
        if (!!this.tool && !!this.tool.onMouseDown3d) {
            this.tool.onMouseDown3d(button, shift, screenX, screenY, handle);
        }
        for (var i = 0; i < this.events.mousedown.length; ++i) {
            var event = this.events.mousedown[i];
            event(button, shift, screenX, screenY, 0, 0, handle);
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
    globe.prototype.onMouseUp3d = function (button, shift, screenX, screenY, handle) {
        if (!!this.tool && !!this.tool.onMouseUp3d) {
            this.tool.onMouseUp3d(button, shift, screenX, screenY, handle);
        }

        for (var i = 0; i < this.events.mouseup.length; ++i) {
            var event = this.events.mouseup[i];
            event(button, shift, screenX, screenY, 0, 0, handle);
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
    globe.prototype.onMouseMove3d = function (button, shift, screenX, screenY, handle) {
        if (!!this.tool && !!this.tool.onMouseMove3d) {
            this.tool.onMouseMove3d(button, shift, screenX, screenY, handle);
        }
        for (var i = 0; i < this.events.mousemove.length; ++i) {
            var event = this.events.mousemove[i];
            event(button, shift, screenX, screenY, 0, 0, handle);
        }
    }
    globe.prototype.onPosition3d = function(mapx, mapy, mapz){
        if (!!this.tool && !! this.tool.onPosition3d) {
            this.tool.onPosition3d(mapx, mapy, mapz);
        }
        for (var i = 0, len = this.events.position3d.length; i < len; ++i) {
            var event = this.events.position3d[i];
            event(mapx, mapy, mapz);
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
    globe.prototype.onDblclick3d = function (pixelX, pixelY) {
        if (!!this.tool && !!this.tool.onDblclick3d) {
            this.tool.onDblclick3d(screenX, screenY);
        }
        for (var i = 0; i < this.events.dblclick.length; ++i) {
            var event = this.events.dblclick[i];
            event(pixelX, pixelY, coordinateX, coordinateY);
        }
    }
    return globe;
})