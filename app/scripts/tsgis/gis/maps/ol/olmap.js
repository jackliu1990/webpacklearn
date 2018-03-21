/**
 * @author by ligang on 2014/10/14
 */
define(['../../../g2/lang/classUtil', '../map', 'ol', 'jquery'], function (ClassUtil, Map, ol, $) {
    var olmap = function (opts) {
        var optss = opts || {};
        Map.call(this, optss);
    }
    ClassUtil.extend2(olmap, Map);

    return olmap;
})