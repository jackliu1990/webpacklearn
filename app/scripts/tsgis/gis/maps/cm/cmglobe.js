/**
 * author by lidonglin on 2016/11/14.
 */
define(['Cesium', '../../../g2/lang/classUtil', '../globe', '../map', './cmcamera'],
    function (Cesium, classUtil, Globe, Map, Camera) {
        var globe =function(options) {
            Globe.call(this, options);
            Map.call(this, options);
        }

        classUtil.extend2(globe, Globe);
        classUtil.extend2(globe, Map);

        return globe;
    })