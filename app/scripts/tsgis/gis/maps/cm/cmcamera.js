/**
 * author by lidonglin on 2017/2/16.
 */
define(['classUtil', 'defineProperties', 'Cesium', 'camera', 'point', 'vector3', 'projectserviceimpl'],
    function (classUtil, defineProperties, Cesium, Camera, Point, Vector3, ProjectService) {
        var math = Cesium.Math;
        /**
         * @class
         * @classdesc
         * 相机，用于控制视图
         * @alias g2.maps.Camera
         * @augments g2.maps.IMap
         * @param {Object} [options] Map options
         * @param {Object} [options.camera] 相机
         * @param {Object} [options.globe] 三维地球
         * @param {Object} [options.ellipsoid] 椭球体
         * @returns {g2.maps.Camera} 返回相机
         */
        var camera = function (options) {
            var opts = options || {};
            Camera.call(this, opts);

            this._srid = options.srid;
            this._projectService = new ProjectService();

            this._camera = opts.camera;
            this._globe = opts.globe;
            this._ellipsoid = opts.globe._cesiumWidget.scene.globe.ellipsoid;
            this._position = new Point({spatialReference: 4326});
            this._heading = Cesium.Math.toDegrees(this._camera.heading);
            this._pitch = Cesium.Math.toDegrees(this._camera.pitch);
            this._roll = Cesium.Math.toDegrees(this._camera.roll);
        }
        classUtil.extend2(camera, Camera);
        var cartographic = new Cesium.Cartographic();
        defineProperties(camera.prototype, {
            position: {
                get: function () {
                    cartographic = Cesium.Cartographic.fromCartesian(this._camera.positionWC, undefined, cartographic);
                    this._position.x = Cesium.Math.toDegrees(cartographic.longitude);
                    this._position.y = Cesium.Math.toDegrees(cartographic.latitude);
                    this._position.z = cartographic.height;

                    //this._position.x = this._projectService.transform(this._position.x, this._srid);
                    //this._position.y = this._projectService.transform(this._position.y, this._srid);
                    //this._position.z = this._projectService.transform(this._position.z, this._srid);
                    return this._projectService.transform(this._position, this._srid);
                },
                set: function (value) {
                    value = this._projectService.transform(value, 4326);
                    this.lookAt(value, this.heading, this.pitch, this.roll);
                }
            },
            heading: {
                get: function () {
                    this._heading = Cesium.Math.toDegrees(this._camera.heading);
                    return this._heading;
                },
                set: function (value) {
                    this.lookAt(this.position, value, this.pitch, this.roll);
                }
            },
            pitch: {
                get: function () {
                    this._pitch = Cesium.Math.toDegrees(this._camera.pitch);
                    return this._pitch;
                },
                set: function (value) {
                    this.lookAt(this.position, this.heading, value, this.roll);
                }
            },
            roll: {
                get: function () {
                    this._roll = Cesium.Math.toDegrees(this._camera.roll);
                    return this._roll;
                },
                set: function (value) {
                    this.lookAt(this.position, this.heading, this.pitch, value);
                }
            }
        })
        camera.prototype.flyTo = function (position, heading, pitch, roll) {
            position = this._projectService.transform(position, 4326),
                this.validateXY(position);
            this._camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(position.x, position.y, position.z),
                orientation: {
                    heading: Cesium.Math.toRadians(heading),
                    pitch: Cesium.Math.toRadians(pitch),
                    roll: Cesium.Math.toRadians(roll)
                }
            });
        }
        camera.prototype.lookAt = function (position, heading, pitch, roll) {
            position = this._projectService.transform(position, 4326),
                this.validateXY(position);
            if (pitch < -90) {
                pitch = -90;
            }
            if (pitch > 87) {
                pitch = 87;
            }
            this._camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(position.x, position.y, position.z),
                orientation: {
                    heading: Cesium.Math.toRadians(heading),
                    pitch: Cesium.Math.toRadians(pitch),
                    roll: Cesium.Math.toRadians(roll)
                }
            });
        }

        var headingPitchRange = new Cesium.HeadingPitchRange(0, 0, 0);
        camera.prototype.lookAtTransform = function (position, heading, pitch, range) {
            position = this._projectService.transform(position, 4326),
                this.validateXY(position);
            if (pitch < -90) {
                pitch = -90;
            }
            var transform = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(position.x, position.y));
            headingPitchRange.heading = Cesium.Math.toRadians(heading);
            headingPitchRange.pitch = Cesium.Math.toRadians(pitch);
            headingPitchRange.range = range;
            this._camera.lookAtTransform(transform, headingPitchRange);
        }
        camera.prototype.setView = function (extent) {
            extent = this._projectService.transform(extent, 4326);
            if (extent.minx < -180 || extent.maxx > 180) {
                throw new Cesium.DeveloperError('Longitude should between -180 and 180');
            }
            if (position.miny < -90 || position.maxy > 90) {
                throw new Cesium.DeveloperError('Latitude should between -90 and 90');
            }
            var rectangle = Cesium.Rectangle.fromDegrees(extent.minx, extent.miny, extent.maxx, extent.maxy);
            this._camera.setView({
                destination: rectangle
            });
        }

        /**
         * 沿着指定的方向向后移动指定的距离
         * @param {Cartesian3} direction 移动的方向
         * @param {Number} amount 移动的距离，如果为正值，向前移动，为负值向后移动，单位：米
         */
        camera.prototype.move = function (direction, amount) {
            this.validateXY();
            direction = Cesium.Cartesian3.fromDegrees(direction.x, direction.y, direction.z);
            this._camera.move(direction, amount);
        }

        /**
         * 沿着指定的轴向上旋转相机
         * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
         */
        camera.prototype.rotateUp = function (amount) {
            this._camera.rotateUp(Cesium.Math.toRadians(amount));
        }
        /**
         * 沿着指定的轴向下旋转相机
         * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
         */
        camera.prototype.rotateDown = function (amount) {
            this._camera.rotateDown(Cesium.Math.toRadians(amount));
        }
        /**
         * 沿着指定的轴向左旋转相机
         * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
         */
        camera.prototype.rotateLeft = function (amount) {
            this._camera.rotateLeft(Cesium.Math.toRadians(amount));
        }
        /**
         * 沿着指定的轴向右旋转相机
         * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
         */
        camera.prototype.rotateRight = function (amount) {
            this._camera.rotateRight(Cesium.Math.toRadians(amount));
        }

        /**
         * 沿着相机的相反方向移动指相机
         * @param {Number} amount 移动的距离，单位：米
         */
        camera.prototype.moveBackward = function (amount) {
            this._camera.moveBackward(amount);
        }

        /**
         * 沿着相机的方向向前移动相机
         * @param {Number} amount 移动的距离，单位：米
         */
        camera.prototype.moveForward = function (amount) {
            this._camera.moveForward(amount);
        }

        /**
         * 沿着指定的轴旋转相机
         * @param {Number} axis 相机绕着旋转的轴
         * @param {Number} angle 为旋转的角度，当角度为正时，逆时针方向旋转，当角度为负时，顺时针方向旋转，单位：radians
         */
        camera.prototype.rotate = function (axis, angle) {
            axisTemp.x = axis.x;
            axisTemp.y = axis.y;
            axisTemp.z = axis.z;
            this._camera.rotate(axisTemp, Cesium.Math.toRadians(angle));
        }

        /**
         * 绕z轴水平方向旋转相机
         * @param {Number} angle 旋转的角度，当角度为正时，逆时针方向旋转，当角度为负时，顺时针方向旋转，单位：radians
         */
        camera.prototype.rotateHorizontal = function (angle) {
            this._camera.rotateLeft(Cesium.Math.toRadians(angle));
        }

        /**
         * 绕x轴水平方向旋转相机
         * @param {Number} angle 旋转的角度，当角度为正时，逆时针方向旋转，当角度为负时，顺时针方向旋转，单位：radians
         */
        camera.prototype.rotateVertical = function (angle) {
            this._camera.rotateDown(Cesium.Math.toRadians(angle));
        }
        var pixelPos = new Cesium.Cartesian2();
        var coordinates1 = Cesium.Cartesian4.clone(Cesium.Cartesian4.UNIT_W);
        var coordinates2 = Cesium.Cartesian4.clone(Cesium.Cartesian4.UNIT_W);
        var axisTemp = new Cesium.Cartesian3();
        camera.prototype.calculateRotationn = function (startPosition, endPosition) {
            pixelPos.x = startPosition.x;
            pixelPos.y = startPosition.y;
            var startPos = this._camera.pickEllipsoid(pixelPos, this._ellipsoid, coordinates1);
            pixelPos.x = endPosition.x;
            pixelPos.y = endPosition.y;
            var endPos = this._camera.pickEllipsoid(pixelPos, this._ellipsoid, coordinates2);
            startPos = this._camera.worldToCameraCoordinates(startPos, startPos);
            endPos = this._camera.worldToCameraCoordinates(endPos, endPos);
            Cesium.Cartesian3.normalize(startPos, startPos);
            Cesium.Cartesian3.normalize(endPos, endPos);
            var dot = Cesium.Cartesian3.dot(startPos, endPos);
            axisTemp = Cesium.Cartesian3.cross(startPos, endPos, axisTemp);
            var angle = 0;
            if (dot < 1.0 && !Cesium.Cartesian3.equalsEpsilon(axis, Cesium.Cartesian3.ZERO, Cesium.Math.EPSILON14)) { // dot is in [0, 1]
                var angle = Math.acos(dot);
            }
            var axis = new Vector3({
                x: axisTemp.x,
                y: axisTemp.y,
                z: axisTemp.z
            })
            return {
                axis: axis,
                angle: Cesium.Math.toDegrees(angle)
            }
        }
        camera.prototype.calculateRotateAngle = function (startPosition, endPosition) {
            var rho = Cesium.Cartesian3.magnitude(this._camera.position);
            var controller = this._globe._cesiumWidget.scene.screenSpaceCameraController;
            var canvas = this._globe._cesiumWidget.scene.canvas;
            var rotateRate = controller._rotateFactor * (rho - controller._rotateRateRangeAdjustment);
            if (rotateRate > controller._maximumRotateRate) {
                rotateRate = controller._maximumRotateRate;
            }
            if (rotateRate < controller._minimumRotateRate) {
                rotateRate = controller._minimumRotateRate;
            }
            var phiWindowRatio = (endPosition.x - startPosition.x) / canvas.clientWidth;
            var thetaWindowRatio = (endPosition.y - startPosition.y) / canvas.clientHeight;
            phiWindowRatio = Math.min(phiWindowRatio, controller.maximumMovementRatio);
            thetaWindowRatio = Math.min(thetaWindowRatio, controller.maximumMovementRatio);
            var deltaPhi = rotateRate * phiWindowRatio * Math.PI * 2.0;
            var deltaTheta = rotateRate * thetaWindowRatio * Math.PI;
            return {
                horizontalAngle: -Cesium.Math.toDegrees(deltaPhi * 0.01),
                verticalAngle: -Cesium.Math.toDegrees(deltaTheta * 0.01)
            }
        }
        camera.prototype.validateXY = function (position) {
            position = this._projectService.transform(position, 4326);

            if (position.x < -180 || position.x > 180) {
                throw new Cesium.DeveloperError('Longitude should between -180 and 180');
            }
            if (position.y < -90 || position.y > 90) {
                throw new Cesium.DeveloperError('Latitude should between -90 and 90');
            }
        }
        return camera;
    })