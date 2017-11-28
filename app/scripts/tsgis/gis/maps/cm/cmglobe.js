/**
 * author by lidonglin on 2016/11/14.
 */
define(['Cesium', 'classUtil', 'globe', 'map', 'cmcamera', 'layertype', 'jquery', 'point', 'envelope', 'projectserviceimpl', 'defineProperties'],
    function (Cesium, classUtil, Globe, Map, Camera, LayerType, $, Point, Envelope, ProjectService, defineProperties) {
        'use strict';
        var boundingSphereScratch = new Cesium.BoundingSphere();
        /*function trackDataSourceClock(timeline, clock, dataSource) {
         if (Cesium.defined(dataSource)) {
         var dataSourceClock = dataSource.clock;
         if (Cesium.defined(dataSourceClock)) {
         dataSourceClock.getValue(clock);
         if (Cesium.defined(timeline)) {
         timeline.updateFromClock();
         timeline.zoomTo(dataSourceClock.startTime, dataSourceClock.stopTime);
         }
         }
         }
         }*/
        var maxDistance = 80000000;

        /**
         * @class
         * @classdesc
         * 三维Globe对象
         * @alias g2.maps.Globe
         * @augments g2.maps.IMap
         * @augments g2.maps.IGlobe
         * @param {Object} [options] Globe options
         * @param {Array} [options.defaultExtent] 默认范围数例如：[120, 30, 120.5, 30.1]
         * @param {Array} [options.fullExtent] 全图范围数例如：[120, 30, 120.5, 30.1]
         * @param {Number} [options.srid] 坐标参考例如：3857
         * @returns {g2.maps.Globe} 返回创建的Globe对象
         */
        var globe =function(options) {
            options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
            Globe.call(this, options);
            Map.call(this, options);
            this._srid = options.srid;
            this._projectService = new ProjectService();

            var defaultExtent = options.defaultExtent;
            var extent = new Envelope({
                minx: defaultExtent[0],
                miny: defaultExtent[1],
                maxx: defaultExtent[2],
                maxy: defaultExtent[3],
                spatialReference: this._srid
            });
            extent = this._projectService.transform(extent, 4326);
            Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(extent.minx, extent.miny, extent.maxx, extent.maxy);

            var fullExtent = options.fullExtent;
            extent = new Envelope({
                minx: fullExtent[0],
                miny: fullExtent[1],
                maxx: fullExtent[2],
                maxy: fullExtent[3],
                spatialReference: this._srid
            });
            this._fullExtent = this._projectService.transform(extent, 4326);

            var that = this;
            var scene3DOnly = Cesium.defaultValue(options.scene3DOnly, false);
            // Cesium widget
            var cesiumWidget = new Cesium.CesiumWidget({
                clock: options.clock,
                skyBox: options.skyBox,
                skyAtmosphere: options.skyAtmosphere,
                sceneMode: options.sceneMode,
                mapProjection: options.mapProjection,
                globe: options.globe,
                orderIndependentTranslucency: options.orderIndependentTranslucency,
                contextOptions: options.contextOptions,
                useDefaultRenderLoop: options.useDefaultRenderLoop,
                targetFrameRate: options.targetFrameRate,
                showRenderLoopErrors: options.showRenderLoopErrors,
                scene3DOnly: scene3DOnly,
                terrainExaggeration: options.terrainExaggeration,
                shadows: options.shadows,
                terrainShadows: options.terrainShadows,
                mapMode2D: options.mapMode2D
            });

            var dataSourceCollection = options.dataSources;
            var destroyDataSourceCollection = false;
            if (!Cesium.defined(dataSourceCollection)) {
                dataSourceCollection = new Cesium.DataSourceCollection();
                destroyDataSourceCollection = true;
            }
            var dataSourceDisplay = new Cesium.DataSourceDisplay({
                scene: cesiumWidget.scene,
                dataSourceCollection: dataSourceCollection
            });

            /*var entities =  dataSourceDisplay.defaultDataSource.entities;

             this._entities = entities;*/

            var clock = cesiumWidget.clock;
            var eventHelper = new Cesium.EventHelper();
            //eventHelper.add(clock.onTick, globe.prototype._onTick, this);
            //eventHelper.add(cesiumWidget.scene.morphStart, globe.prototype._clearTrackedObject, this);
            //Assign all properties to this instance.  No "this" assignments should
            this._dataSourceChangedListeners = {};
            this._automaticallyTrackDataSourceClocks = Cesium.defaultValue(options.automaticallyTrackDataSourceClocks, true);
            this._cesiumWidget = cesiumWidget;
            this._dataSourceCollection = dataSourceCollection;
            this._destroyDataSourceCollection = destroyDataSourceCollection;
            this._dataSourceDisplay = dataSourceDisplay;
            this._eventHelper = eventHelper;
            this._lastWidth = 0;
            this._lastHeight = 0;
            this._allowDataSourcesToSuspendAnimation = true;
            this._entityView = undefined;
            this._clockTrackedDataSource = undefined;
            this._trackedEntity = undefined;
            this._needTrackedEntityUpdate = false;
            this._selectedEntity = undefined;
            this._clockTrackedDataSource = undefined;
            this._forceResize = false;
            var ellipsoid = this._cesiumWidget.scene.globe.ellipsoid;
            this._camera = new Camera({camera: this._cesiumWidget.scene.camera, globe: this});
            this._animationFun = undefined;
            //Cesium.knockout.track(this, ['_trackedEntity', '_selectedEntity', '_clockTrackedDataSource']);
            //Listen to data source events in order to track clock changes.
            eventHelper.add(dataSourceCollection.dataSourceAdded, globe.prototype._onDataSourceAdded, this);
            eventHelper.add(dataSourceCollection.dataSourceRemoved, globe.prototype._onDataSourceRemoved, this);
            // Prior to each render, check if anything needs to be resized.
            eventHelper.add(cesiumWidget.scene.preRender, globe.prototype.resize, this);
            var dataSourceLength = dataSourceCollection.length;
            for (var i = 0; i < dataSourceLength; i++) {
                this._dataSourceAdded(dataSourceCollection, dataSourceCollection.get(i));
            }
            this._dataSourceAdded(undefined, dataSourceDisplay.defaultDataSource);
            // Hook up events so that we can subscribe to future sources.
            eventHelper.add(dataSourceCollection.dataSourceAdded, globe.prototype._dataSourceAdded, this);
            eventHelper.add(dataSourceCollection.dataSourceRemoved, globe.prototype._dataSourceRemoved, this);
            this.draggpanFlag = true;
            //是否双击放大地图
            this.dbClickFlag = true;
            addMouseEvent.call(this);
            addKeyEvent.call(this);
            var scene = this._cesiumWidget.scene;
            scene.preRender.addEventListener(function (scene, time) {
                for (var i = 0, len = that.events.prerender.length; i < len; ++i) {
                    var event = that.events.prerender[i];
                    event(that, Cesium.JulianDate.toDate(time));
                }
            });
            var camera = this._cesiumWidget.scene.camera;
            camera.moveEnd.addEventListener(function () {
                var _camera = that._camera;
                var pos = _camera.position;
                if (!!pos && pos.z > maxDistance) {
                    var heading = _camera.heading;
                    var pitch = _camera.pitch;
                    var roll = _camera.roll;
                    pos.z = maxDistance;
                    _camera.lookAt(pos, heading, pitch, roll);
                }
                var extent = that.getExtent();
                if (!!extent) {
                    globe.prototype.uber.onExtentChanged.call(that, extent.minx, extent.maxy, extent.maxx, extent.miny);
                }
            })
        }

        classUtil.extend2(globe, Globe);
        classUtil.extend2(globe, Map);
        function addMouseEvent() {
            var cesiumWidget = this._cesiumWidget;
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 0, 'onMouseClick'), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 2, 'onMouseClick'), Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 0, 'onMouseDown'), Cesium.ScreenSpaceEventType.LEFT_DOWN);
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 2, 'onMouseDown'), Cesium.ScreenSpaceEventType.RIGHT_DOWN);
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 1, 'onMouseDown'), Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 0, 'onMouseUp'), Cesium.ScreenSpaceEventType.LEFT_UP);
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 2, 'onMouseUp'), Cesium.ScreenSpaceEventType.RIGHT_UP);
            cesiumWidget.screenSpaceEventHandler.setInputAction(globeEvent.call(this, 1, 'onMouseUp'), Cesium.ScreenSpaceEventType.MIDDLE_UP);
            cesiumWidget.screenSpaceEventHandler.setInputAction(dbClickEvent.call(this, 1), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            cesiumWidget.screenSpaceEventHandler.setInputAction(mouseMoveEvent.call(this, 1), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            cesiumWidget.screenSpaceEventHandler.setInputAction(wheelEvent.call(this, 1), Cesium.ScreenSpaceEventType.WHEEL);
        }

        function createParameters(pixel, button, ellipsoid, mousePosition) {
            /*var scene = this._cesiumWidget.scene;
             var cartesian = scene.camera.pickEllipsoid(pixel, scene.globe.ellipsoid);
             if (cartesian) {
             var coordX = 0, coordY = 0;
             var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
             coordX = cartographic.longitude;
             coordY = cartographic.latitude;
             return {
             button: button,
             handle: false,
             shift: false,
             screenX: pixel.x,
             screenY: pixel.y,
             mapX: Cesium.Math.toDegrees(coordX),
             mapY: Cesium.Math.toDegrees(coordY),
             mapZ:cartographic.height
             }
             }*/
            var scene = this._cesiumWidget.scene;
            var ray = scene.camera.getPickRay(pixel);
            var cartesian = scene.globe.pick(ray, scene);
            if (Cesium.defined(cartesian)) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var position = cartesian2Position.call(this, cartesian, mousePosition);
                return {
                    button: button,
                    handle: false,
                    shift: false,
                    screenX: pixel.x,
                    screenY: pixel.y,
                    mapX: position.x,
                    mapY: position.y,
                    mapZ: cartographic.height
                }
            }
        }

        function addKeyEvent() {
            var container = this._container;
            var that = this;
            $(document).keydown(function (e) {
                if (!!that.tool) {
                    that.tool.onKeyDown(e.keyCode, e.shiftKey);
                }
            }).keyup(function (e) {
                if (!!that.tool) {
                    that.tool.onKeyUp(e.keyCode, e.shiftKey);
                }
            });
        }

        function globeEvent(button, eventName) {
            var hander = this;
            var mousePosition = new Point({x: 0, y: 0, spatialReference: 4326});
            return function click(e) {
                var ellipsoid = hander._cesiumWidget.scene.globe.ellipsoid;
                var p = createParameters.call(hander, e.position, button, ellipsoid, mousePosition);
                if (!!p) {
                    Globe.prototype.onPosition3d.call(hander, p.mapX, p.mapY, p.mapZ);
                    globe.prototype.uber[eventName].call(hander, p.button, p.shift, p.screenX, p.screenY, p.mapX, p.mapY, p.handle);
                }
                else {
                    var eventName3d = eventName + '3d';
                    Globe.prototype[eventName3d].call(hander, button, false, e.position.x, e.position.y, false);
                }
            }
        }

        function mouseMoveEvent(button) {
            var hander = this;
            var mousePosition = new Point({x: 0, y: 0, spatialReference: 4326});
            return function click(e) {
                var ellipsoid = hander._cesiumWidget.scene.globe.ellipsoid;
                var p = createParameters.call(hander, e.endPosition, button, ellipsoid, mousePosition);
                if (!!p) {
                    Globe.prototype.onPosition3d.call(hander, p.mapX, p.mapY, p.mapZ);
                    globe.prototype.uber.onMouseMove.call(hander, p.button, p.shift, p.screenX, p.screenY, p.mapX, p.mapY, p.handle);
                }
                else {
                    Globe.prototype.onMouseMove3d.call(hander, button, false, e.endPosition.x, e.endPosition.y, false);
                }
            }
        }

        function dbClickEvent(button) {
            var hander = this;
            var mousePosition = new Point({x: 0, y: 0, spatialReference: 4326});
            return function clickEvent(e) {
                var ellipsoid = hander._cesiumWidget.scene.globe.ellipsoid;
                if (!!hander.dbClickFlag) {
                    var cameraHeight = ellipsoid.cartesianToCartographic(hander._cesiumWidget.scene.camera.position).height;
                    var moveRate = cameraHeight / 10.0;
                    hander._cesiumWidget.scene.camera.moveForward(moveRate);
                }
                var p = createParameters.call(hander, e.position, button, ellipsoid, mousePosition);
                if (!!p) {
                    Globe.prototype.onPosition3d.call(hander, p.mapX, p.mapY, p.mapZ);
                    globe.prototype.uber.onDblclick.call(hander, p.button, p.shift, p.screenX, p.screenY, p.mapX, p.mapY, p.handle);
                }
                else {
                    Globe.prototype.onDblclick3d.call(hander, button, false, e.position.x, e.position.y, false);
                }
            }
        }

        function wheelEvent(button) {
            var hander = this;
            return function wheel(e) {
                globe.prototype.uber.onWheel.call(hander);
            }
        }

        defineProperties(globe.prototype, {
            container: {
                get: function () {
                    return this._container;
                }
            },
            canvas: {
                get: function () {
                    return this._cesiumWidget.canvas;
                }
            },
            camera: {
                get: function () {
                    return this._camera;
                }
            },
            /**
             * Gets or sets a scaling factor for rendering resolution.  Values less than 1.0 can improve
             * performance on less powerful devices while values greater than 1.0 will render at a higher
             * resolution and then scale down, resulting in improved visual fidelity.
             * For example, if the widget is laid out at a size of 640x480, setting this value to 0.5
             * will cause the scene to be rendered at 320x240 and then scaled up while setting
             * it to 2.0 will cause the scene to be rendered at 1280x960 and then scaled down.
             * @memberof globe.prototype
             *
             * @type {Number}
             * @default 1.0
             */
            resolutionScale: {
                get: function () {
                    return this._cesiumWidget.resolutionScale;
                },
                set: function (value) {
                    this._cesiumWidget.resolutionScale = value;
                    this._forceResize = true;
                }
            }
        });
        /**
         * 初始化globe
         * @param {Object} [options] 初始化三维所需参数
         * @param {String} [options.targetId] 初始化DOMID
         */
        globe.prototype.init = function (options) {
            var targetId = options.targetId;
            var container = Cesium.getElement(targetId);
            this._container = container;
            this._cesiumWidget.setTarget(container);
        }

        /**
         * 添加图层
         * @param {g2.lys.ILayer} layer 图层对象
         */
        globe.prototype.addLayer = function (layer) {
            if (!layer)return;
            globe.prototype.uber.addLayer.call(this, layer);
            var scene = this._cesiumWidget.scene;
            switch (layer.getLayerType()) {
                case LayerType.TileLayer:
                case LayerType.ImageLayer:
                {
                    var lyr = scene.imageryLayers.addImageryProvider(layer.getLayer());
                    layer.layer = lyr;
                }
                    break;
                case LayerType.VectorLayer:
                case LayerType.FeatureLayer:
                case LayerType.ElementLayer:
                case LayerType.CanvasLayer:
                case LayerType.BuildingLayer:
                case LayerType.ModelLayer:
                {
                    scene.primitives.add(layer.getLayer());
                }
                    break;
                case LayerType.TerrainLayer:
                {
                    scene.terrainProvider = layer.getLayer();
                }
                    break;
            }
            layer.map = this;
            layer.init();
        }

        /**
         * 删除图层
         * @param {g2.lys.ILayer} layer 图层对象
         */
        globe.prototype.removeLayer = function (layer) {
            if (!layer)return;
            globe.prototype.uber.removeLayer.call(this, layer);
            var scene = this._cesiumWidget.scene;
            switch (layer.getLayerType()) {
                case LayerType.TileLayer:
                case LayerType.ImageLayer:
                {
                    var lyr = scene.imageryLayers.addImageryProvider(layer.getLayer());
                    layer.Layer = lyr;
                    scene.imageryLayers.removeLayer(layer.Layer);
                }
                    break;
                case LayerType.VectorLayer:
                case LayerType.FeatureLayer:
                case LayerType.ElementLayer:
                case LayerType.CanvasLayer:
                case LayerType.BuildingLayer:
                case LayerType.ModelLayer:
                {
                    scene.primitives.remove(layer.getLayer());
                }
                    break;
                case LayerType.TerrainLayer:
                {
                    scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
                }
                    break;
            }
        }

        /**
         * 禁止双击事件
         */
        globe.prototype.stopDbClick = function () {
            this.dbClickFlag = false;
        }
        /**
         * 恢复双击事件
         */
        globe.prototype.resumeDbClick = function () {
            var that = this;
            setTimeout(function () {
                that.dbClickFlag = true;
            }, 300);
        }

        /**
         * 禁止地图拖拽功能
         */
        globe.prototype.stopDragPan = function () {
            this.draggpanFlag = false;
            this._cesiumWidget.scene.screenSpaceCameraController.enableRotate = false;
        }
        /**
         *   恢复地图拖拽功能
         */
        globe.prototype.resumeDragpan = function () {
            this.draggpanFlag = true;
            this._cesiumWidget.scene.screenSpaceCameraController.enableRotate = true;
            this.setCursor('pointer');
        }

        /**
         *   获取当前三维范围
         */
        globe.prototype.getExtent = function () {
            var camera = this._cesiumWidget.scene.camera;
            var extent = camera.computeViewRectangle();
            if (!extent) {
                this.zoomIn();
                return;
            }
            var math = Cesium.Math;
            var west = math.toDegrees(extent.west), north = math.toDegrees(extent.north), south = math.toDegrees(extent.south), east = math.toDegrees(extent.east);
            var envelope = new Envelope({
                minx: west,
                miny: south,
                maxx: east,
                maxy: north,
                spatialReference: 4326
            });
            envelope = this._projectService.transform(envelope, this._srid);
            return envelope;
        }

        /**
         * 获取地理坐标
         * @param {Array} [pixels] 屏幕坐标例如：[0,0]
         * @returns {g2.geom.Point} 返回地理坐标
         */
        globe.prototype.pickPosition = function (pixels) {
            var scene = this._cesiumWidget.scene;
            var pickedObject = scene.pick(pixels);
            if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
                var cartesian = scene.pickPosition(pixels);
                if (Cesium.defined(cartesian)) {
                    return cartesian2Position.call(this, cartesian);
                }
            }
        }
        var position2 = new Cesium.Cartesian2();

        /**
         * 获取地表坐标
         * @param {Array} [pixels] 屏幕坐标例如：[0,0]
         * @returns {g2.geom.Point} 返回地表的地理坐标
         */
        globe.prototype.pickSurfacePosition = function (pixels) {
            var scene = this._cesiumWidget.scene;
            /*position2.x = pixels.x;
             position2.y = pixels[1];*/
            var ray = scene.camera.getPickRay(pixels);
            var cartesian = scene.globe.pick(ray, scene);
            if (Cesium.defined(cartesian)) {
                return cartesian2Position.call(this, cartesian);
            }
        }
        function cartesian2Position(cartesian, mousePosition) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            if (!mousePosition) {
                mousePosition = new Point({spatialReference: 4326});
            }
            mousePosition.x = longitude;
            mousePosition.y = latitude;
            mousePosition.z = cartographic.height;
            var point = this._projectService.transform(mousePosition, this._srid);
            return point;
        }

        var that = null;
        globe.prototype.getAltitude = function (points) {
            var terrainProvider = this._cesiumWidget.scene.terrainProvider;
            var positions = [];
            for (var i = 0, len = points.length; i < len; i++) {
                var point = points[i];
                point = this._projectService.transform(point, 4326);
                positions.push(Cesium.Cartographic.fromDegrees(point.x, point.y));
            }
            var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions).then(function (positions) {
                for (var i = 0, len = positions.length; i < len; ++i) {
                    points[i].z = positions[i].height;
                }
                return points;
            });
            return promise;
        }
        /**
         * 暂停飞行
         */
        globe.prototype.pauseFly = function () {
            if (this._cesiumWidget._clock._shouldAnimate) {
                this._cesiumWidget._clock._shouldAnimate = false;
            } else {
                this._cesiumWidget._clock._shouldAnimate = true;
            }
        };

        /**
         * 停止飞行
         */
        globe.prototype.stopFly = function () {
            this.stopAnimation();
            if (!!model) {
                var scene = this._cesiumWidget.scene;
                scene.primitives.remove(model);
                model = undefined;
            }
        };

        function distance(pnt1, pnt2) {
            return Math.sqrt(Math.pow(pnt1.x - pnt2.x, 2) + Math.pow(pnt1.y - pnt2.y, 2));
        }

        var model;
        /**
         * 飞行路线
         * @param {g2.geom.Polyline} [path] 几何对象线
         * @param {Number} [timeLong] 飞行时长
         * @param {String} [uri] 模型的路径
         * @param {Boolean} [following] 视野是否跟随
         */
        globe.prototype.flyPath = function (path, timeLong, uri, following) {
            var clock = this._cesiumWidget.clock;
            var multiplier = clock.multiplier;
            path = this._projectService.transform(path, 4326);
            path = path.getGeometry(0);
            timeLong = timeLong || 10;
            var scene = this._cesiumWidget.scene;
            var camera = scene.camera;
            if (!!model) {
                scene.primitives.remove(model);
            }
            model = Cesium.Model.fromGltf({
                url: uri,
                scale: 3
            });
            var point = path.getPoint(0);
            var position = Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z);
            var headingPitchRoll = new Cesium.HeadingPitchRoll(0, 0, 0);
            var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, headingPitchRoll);
            model.modelMatrix = modelMatrix;
            model.readyPromise.then(function (model) {
                model.activeAnimations.addAll({
                    speedup: 1,
                    loop: Cesium.ModelAnimationLoop.REPEAT
                });
            }).otherwise(function (error) {
                window.alert(error);
            });
            scene.primitives.add(model);
            var length = path.length();
            var count = path.getPointCount();
            var timeArr = [], total = 0;
            for (var i = 0; i < count - 1; ++i) {
                timeArr.push(timeLong * (total / length));
                total += distance(path.getPoint(i), path.getPoint(i + 1));
            }
            timeArr.push(timeLong);
            var positions = new Cesium.SampledPositionProperty();
            var currentTime = Cesium.JulianDate.now();
            var startTime = Cesium.JulianDate.addSeconds(currentTime, -timeLong, new Cesium.JulianDate());
            var startMiliSeconds = Cesium.JulianDate.toDate(currentTime).getTime();
            for (var i = 0, len = timeArr.length; i < len; ++i) {
                var time = Cesium.JulianDate.addSeconds(startTime, timeArr[i], new Cesium.JulianDate());
                var point = path.getPoint(i);
                var position = Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z);
                positions.addSample(time, position);
            }
            var orientation = new Cesium.VelocityOrientationProperty(positions);
            var velocity = new Cesium.VelocityVectorProperty(positions, true);

            var position;
            var positionScratch = new Cesium.Cartesian3();
            var velocityScratch = new Cesium.Cartesian3();
            var Wup = new Cesium.Cartesian3();
            var Weast = new Cesium.Cartesian3();
            var Wnorth = new Cesium.Cartesian3();
            var Lup = new Cesium.Cartesian3(0, 0, 1);
            var Least = new Cesium.Cartesian3(1, 0, 0);
            var Lnorth = new Cesium.Cartesian3(0, 1, 0);
            var Lvelocity = new Cesium.Cartesian3();
            this._cesiumWidget._clock._shouldAnimate = true;
            var that = this;
            var renderListener = function (scene, time) {
                var timePast = (time.getTime() - startMiliSeconds) / 1000.0;
                if (timePast > timeLong) {
                    that.stopFly();
                    clock.multiplier = multiplier;
                    return;
                }
                var timeNow = Cesium.JulianDate.addSeconds(startTime, timePast, new Cesium.JulianDate());
                position = Cesium.Property.getValueOrUndefined(positions, timeNow);
                if (!position)
                    return;
                var orientation1 = Cesium.Property.getValueOrUndefined(orientation, timeNow);
                var pos = Cesium.Cartographic.fromCartesian(position);

                var matrix;
                if (!Cesium.defined(orientation1)) {
                    matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, matrix);
                } else {
                    matrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation1, new Cesium.Matrix3()), position, matrix);
                }
                var heading = Cesium.Quaternion.computeAngle(orientation1);
                model.modelMatrix = Cesium.Matrix4.clone(matrix, model.modelMatrix);

                var Wvelocity = velocity.getValue(timeNow, velocityScratch);
                if (!Wvelocity)
                    return;
                Cesium.Cartesian3.normalize(Wvelocity, Wvelocity);
                Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(position, Wup);
                Cesium.Cartesian3.cross({x: 0, y: 0, z: 1}, Wup, Weast);
                Cesium.Cartesian3.cross(Wup, Weast, Wnorth);

                Lvelocity.x = Cesium.Cartesian3.dot(Wvelocity, Weast);
                Lvelocity.y = Cesium.Cartesian3.dot(Wvelocity, Wnorth);
                Lvelocity.z = Cesium.Cartesian3.dot(Wvelocity, Wup);
                //angle of travel
                var x = Cesium.Cartesian3.dot(Lvelocity, Least);
                var y = Cesium.Cartesian3.dot(Lvelocity, Lnorth);
                var z = Cesium.Cartesian3.dot(Lvelocity, Lup);
                var angle = Math.atan2(x, y);//math: y b4 x, heading: x b4 y
                var pitch = Math.asin(z);//make sure Lvelocity is unitized
                //angles offsets
                angle += 0 / 180 * Math.PI;
                pitch += -20 / 180 * Math.PI;
                var range = 80;
                var offset = new Cesium.HeadingPitchRange(angle, pitch, range);

                var x = Cesium.Math.toDegrees(pos.longitude);
                var y = Cesium.Math.toDegrees(pos.latitude);
                if (!!following) {
                    camera.lookAt(position, offset);
                }
            }
            clock.multiplier = 1;
            this.startAnimation(renderListener);
        }
        /**
         * 设置鼠标样式
         * @param {Object} cursor 鼠标样式
         */
        globe.prototype.setCursor = function (cursor) {
            var cur = cursor || 'pointer';
            this._container.style.cursor = cur;
        }
        /**
         * 返回地图窗口尺寸 px单位
         * @return {Array} 返回地图窗口的尺寸，如[782, 389]
         */
        globe.prototype.getViewSize = function () {
            var container = this._container;
            var width = container.clientWidth;
            var height = container.clientHeight;
            return [width, height];
        }
        /**
         * 获取分辨率
         */
        globe.prototype.getResolution = function () {
        }
        /**
         * 设置分辨率
         */
        globe.prototype.setResolution = function () {
        }
        globe.prototype.startAnimation = function (animationFun) {
            this.stopAnimation();

            if (!!animationFun) {
                this._animationFun = animationFun;
                this.on('prerender', this._animationFun);
            }
        }
        globe.prototype.stopAnimation = function () {
            if (!!this._animationFun) {
                this.un('prerender', this._animationFun);
                this._animationFun = undefined;
                var camera = this._cesiumWidget.scene.camera;
                camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            }
        }
        /**
         * 获取坐标原点
         */
        globe.prototype.getOrigin = function () {

        }
        /**
         * 地球全图范围显示
         */
        globe.prototype.fullExtent = function () {
            var fullExtent = this._fullExtent;
            var rectangle = Cesium.Rectangle.fromDegrees(fullExtent.minx, fullExtent.miny, fullExtent.maxx, fullExtent.maxy);
            var camera = this._cesiumWidget.scene.camera;
            camera.flyTo({
                destination: rectangle
            })
        }
        /**
         * 地图缩小
         */
        globe.prototype.zoomOut = function () {
            if (this._camera.position.z > maxDistance) {
                return;
            }
            var camera = this._cesiumWidget.scene.camera;
            var ellipsoid = this._cesiumWidget.scene.globe.ellipsoid;
            var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
            var moveRate = cameraHeight / 10.0;
            camera.moveBackward(moveRate);
        }
        /**
         * 地图放大
         */
        globe.prototype.zoomIn = function () {
            var camera = this._cesiumWidget.scene.camera;
            var ellipsoid = this._cesiumWidget.scene.globe.ellipsoid;
            var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
            var moveRate = cameraHeight / 10.0;
            camera.moveForward(moveRate);
        }
        /**
         * 缩放到指定级别
         */
        globe.prototype.zoomTo = function (level) {

        }
        /**
         * 平移几何图形对象
         * @param {g2.geom.Geometry} geometry 几何图形
         */
        globe.prototype.pan = function (geometry) {
            geometry = this._projectService.transform(geometry, 4326);
            var extent = geometry.getExtent();
            if (extent.minx < -180 || extent.maxx > 180) {
                throw new Cesium.DeveloperError('Longitude should between -180 and 180');
            }
            if (position.miny < -90 || position.maxy > 90) {
                throw new Cesium.DeveloperError('Latitude should between -90 and 90');
            }
            var rectangle = Cesium.Rectangle.fromDegrees(extent.minx, extent.miny, extent.maxx, extent.maxy);
            var camera = this._cesiumWidget.scene.camera;
            camera.flyTo({
                destination: rectangle
            })
        }
        /**
         * 设定指定的坐标点为地图中心点
         * @param {Point} center 地理坐标点
         */
        globe.prototype.setCenter = function (center) {
            center = this._projectService.transform(center, 4326);
            this._camera.validateXY(center);
            var camera = this._cesiumWidget.scene.camera;
            camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(center.x, center.y, center.z)
            });
        }
        /**
         * 获取指定的地理坐标点显示在屏幕上的位置
         * @param {g2.geom.Point} coordinate 地理坐标点
         */
        globe.prototype.getPixelFromCoordinate = function (coordinate) {
        }
        var pixelPos = new Cesium.Cartesian2();
        var coordinates = Cesium.Cartesian4.clone(Cesium.Cartesian4.UNIT_W);
        /**
         * 获取屏幕上指定像素点对应的地理坐标点
         * @param {g2.geom.Point} pixel 屏幕像素点坐标
         */
        globe.prototype.getCoordinateFromPixel = function (pixel) {
            pixelPos.x = pixel.x;
            pixelPos.y = pixel.y;
            var scene = this._cesiumWidget.scene;
            var cartesian = scene.camera.pickEllipsoid(pixelPos, scene.globe.ellipsoid, coordinates);
            if (cartesian) {
                return cartesian2Position.call(this, cartesian);
            }
        }
        /***
         * Extends the base globe functionality with the provided mixin.
         * A mixin may add additional properties, functions, or other behavior
         * to the provided globe instance.
         *
         * @param {globe~ViewerMixin} mixin The Viewer mixin to add to this instance.
         * @param {Object} [options] The options object to be passed to the mixin function.
         *
         * @see viewerDragDropMixin
         */
        globe.prototype.extend = function (mixin, options) {
            //>>includeStart('debug', pragmas.debug);
            if (!Cesium.defined(mixin)) {
                throw new DeveloperError('mixin is required.');
            }
            //>>includeEnd('debug')
            mixin(this, options);
        };

        /**
         * 调整三维控件尺寸
         */
        globe.prototype.resize = function () {
            var cesiumWidget = this._cesiumWidget;
            var container = this._container;
            var width = container.clientWidth;
            var height = container.clientHeight;
            var animationExists = Cesium.defined(this._animation);
            var timelineExists = Cesium.defined(this._timeline);
            if (!this._forceResize && width === this._lastWidth && height === this._lastHeight) {
                return;
            }
            cesiumWidget.resize();
            this._forceResize = false;
            var panelMaxHeight = height - 125;
            var baseLayerPickerDropDown = this._baseLayerPickerDropDown;
            if (Cesium.defined(baseLayerPickerDropDown)) {
                baseLayerPickerDropDown.style.maxHeight = panelMaxHeight + 'px';
            }
            if (Cesium.defined(this._infoBox)) {
                this._infoBox.viewModel.maxHeight = panelMaxHeight;
            }
            var animationContainer;
            var animationWidth = 0;
            var creditLeft = 0;
            var creditBottom = 0;

            if (animationExists && window.getComputedStyle(this._animation.container).visibility !== 'hidden') {
                var lastWidth = this._lastWidth;
                animationContainer = this._animation.container;
                if (width > 900) {
                    animationWidth = 169;
                    if (lastWidth <= 900) {
                        animationContainer.style.width = '169px';
                        animationContainer.style.height = '112px';
                        this._animation.resize();
                    }
                } else if (width >= 600) {
                    animationWidth = 136;
                    if (lastWidth < 600 || lastWidth > 900) {
                        animationContainer.style.width = '136px';
                        animationContainer.style.height = '90px';
                        this._animation.resize();
                    }
                } else {
                    animationWidth = 106;
                    if (lastWidth > 600 || lastWidth === 0) {
                        animationContainer.style.width = '106px';
                        animationContainer.style.height = '70px';
                        this._animation.resize();
                    }
                }
                creditLeft = animationWidth + 5;
            }
            if (timelineExists && window.getComputedStyle(this._timeline.container).visibility !== 'hidden') {
            }
            //this._bottomContainer.style.left = creditLeft + 'px';
            //this._bottomContainer.style.bottom = creditBottom + 'px';
            var newSize = [width, height];
            var oldSize = [this._lastWidth, this._lastHeight];
            this._lastWidth = width;
            this._lastHeight = height;
            globe.prototype.uber.onResize.call(this, newSize, oldSize);
        };
        /**
         * 强制重新调整大小
         */
        globe.prototype.forceResize = function () {
            this._lastWidth = 0;
            this.resize();
        };
        /**
         * 渲染场景
         */
        globe.prototype.render = function () {
            this._cesiumWidget.render();
        };

        /**
         * 是否销毁三维控件
         * @returns {Boolean} true 三维控件已销毁, false 没有销毁.
         */
        globe.prototype.isDestroyed = function () {
            return false;
        };
        /**
         * 销毁三维控件
         */
        globe.prototype.destroy = function () {
            var i;

            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

            // Unsubscribe from data sources
            var dataSources = this.dataSources;
            var dataSourceLength = dataSources.length;
            for (i = 0; i < dataSourceLength; i++) {
                this._dataSourceRemoved(dataSources, dataSources.get(i));
            }
            this._dataSourceRemoved(undefined, this._dataSourceDisplay.defaultDataSource);

            this._eventHelper.removeAll();

            this._dataSourceDisplay = this._dataSourceDisplay.destroy();
            this._cesiumWidget = this._cesiumWidget.destroy();

            if (this._destroyDataSourceCollection) {
                this._dataSourceCollection = this._dataSourceCollection.destroy();
            }
            return destroyObject(this);
        };
        /***
         * @private
         */
        globe.prototype._dataSourceAdded = function (dataSourceCollection, dataSource) {
            /*var entityCollection = dataSource.entities;
             entityCollection.collectionChanged.addEventListener(globe.prototype._onEntityCollectionChanged, this);*/
        };
        /***
         * @private
         */
        globe.prototype._dataSourceRemoved = function (dataSourceCollection, dataSource) {
            var entityCollection = dataSource.entities;
            entityCollection.collectionChanged.removeEventListener(globe.prototype._onEntityCollectionChanged, this);
        };
        /***
         * @private
         */
        globe.prototype._onDataSourceChanged = function (dataSource) {
            /*if (this.clockTrackedDataSource === dataSource) {
             trackDataSourceClock(this.timeline, this.clock, dataSource);
             }*/
        };
        /***
         * @private
         */
        globe.prototype._onDataSourceAdded = function (dataSourceCollection, dataSource) {
            if (this._automaticallyTrackDataSourceClocks) {
                this.clockTrackedDataSource = dataSource;
            }
            var id = dataSource.entities.id;
            var removalFunc = this._eventHelper.add(dataSource.changedEvent, globe.prototype._onDataSourceChanged, this);
            this._dataSourceChangedListeners[id] = removalFunc;
        };
        /***
         * @private
         */
        globe.prototype._onDataSourceRemoved = function (dataSourceCollection, dataSource) {
            var resetClock = (this.clockTrackedDataSource === dataSource);
            var id = dataSource.entities.id;
            this._dataSourceChangedListeners[id]();
            this._dataSourceChangedListeners[id] = undefined;
            if (resetClock) {
                var numDataSources = dataSourceCollection.length;
                if (this._automaticallyTrackDataSourceClocks && numDataSources > 0) {
                    this.clockTrackedDataSource = dataSourceCollection.get(numDataSources - 1);
                } else {
                    this.clockTrackedDataSource = undefined;
                }
            }
        };

        globe.prototype.export = function(name){
               /* var canvas = this._cesiumWidget.canvas;
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
                }*/

            // First create a dataURL string from the canvas in jpeg format.
            var dataURL = this._cesiumWidget.canvas.toDataURL("image/png");

            // Split the dataURL and decode it from ASCII to base-64 binary.
            var binArray = atob(dataURL.split(',')[1]);

            // Create an 8-bit unsigned array
            var array = [];
            // Add the unicode numeric value of each element to the new array.
            for (var i = 0; i < binArray.length; i++) {
                array.push(binArray.charCodeAt(i));
            }

            var blobObject = new Blob([new Uint8Array(array)], { type: 'image/png' });

            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(blobObject, 'warpedphoto.png');
            }else if (window.navigator.saveBlob) {
                window.navigator.saveBlob(blobObject, 'warpedphoto.png');
            }
            else {
                dataURL = dataURL.replace("image/png", "image/octet-stream");
                window.location.href = dataURL;
                // alert("Sorry, your browser does not support navigator.saveBlob");
            }
        }
        return globe;
    })