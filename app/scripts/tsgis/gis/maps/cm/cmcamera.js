/**
 * author by lidonglin on 2017/2/16.
 */
define(['../../../g2/lang/classUtil', 'Cesium',"../camera"],
    function (classUtil, Cesium, Camera) {

        var camera = function (options) {
            var opts = options || {};
            Camera.call(this, opts);


        }
        classUtil.extend2(camera, Camera);

        return camera;
    })