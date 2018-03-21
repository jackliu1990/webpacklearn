define([], function () {

    var camera = function (options) {
    }

    camera.prototype.flyTo = function (destination, heading, pitch, roll) {
    }
    camera.prototype.lookAt = function (position, heading, pitch, roll) {
    }
    camera.prototype.lookAtTransform = function (position, heading, pitch, range) {
    }
    camera.prototype.setView = function (extent) {
    }
    /**
     * 沿着指定的方向向后移动指定的距离
     * @param {Cartesian3} direction 移动的方向
     * @param {Number} amount 移动的距离，如果为正值，向前移动，为负值向后移动，单位：米
     */
    camera.prototype.move = function (direction, amount) {
    }

    /**
     * 沿着指定的轴向上旋转相机
     * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
     */
    camera.prototype.rotateUp = function (amount) {
    }

    /**
     * 沿着指定的轴向下旋转相机
     * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
     */
    camera.prototype.rotateDown = function (amount) {
    }

    /**
     * 沿着指定的轴向左旋转相机
     * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
     */
    camera.prototype.rotateLeft = function (amount) {
    }

    /**
     * 沿着指定的轴向右旋转相机
     * @param {Number} amount 旋转的距离，如果为正值，向前移动，为负值向后移动，单位：米
     */
    camera.prototype.rotateRight = function (amount) {
    }

    /**
     * 沿着相机的相反方向移动指相机
     * @param {Number} amount 移动的距离，单位：米
     */
    camera.prototype.moveBackward = function (amount) {
    }

    /**
     * 沿着相机的方向向前移动相机
     * @param {Number} amount 移动的距离，单位：米
     */
    camera.prototype.moveForward = function (amount) {
    }

    /**
     * 沿着指定的轴旋转相机
     * @param {Number} axis 相机绕着旋转的轴
     * @param {Number} angle 为旋转的角度，当角度为正时，逆时针方向旋转，当角度为负时，顺时针方向旋转，单位：radians
     */
    camera.prototype.rotate = function (axis, angle) {
    }

    /**
     * 绕z轴水平方向旋转相机
     * @param {Number} angle 旋转的角度，当角度为正时，逆时针方向旋转，当角度为负时，顺时针方向旋转，单位：radians
     */
    camera.prototype.rotateHorizontal = function (angle) {
    }

    /**
     * 绕x轴水平方向旋转相机
     * @param {Number} angle 旋转的角度，当角度为正时，逆时针方向旋转，当角度为负时，顺时针方向旋转，单位：radians
     */
    camera.prototype.rotateVertical = function (angle) {
    }
    camera.prototype.calculateRotationn = function(startPosition, endPosition){
    }
    camera.prototype.calculateRotateAngle = function(startPosition, endPosition){
    }
    return camera;
})