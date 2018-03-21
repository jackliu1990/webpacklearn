/**
 * Created by liufeng on 2017/11/28.
 */
define(["./map","./globe","./camera","./cm/cmglobe","./cm/cmcamera"],
    function (Map,Globe,Camera,CMGlobe,CMCamera) {
        var g2 = window.g2 || {};
        window.g2 = g2;
        g2.map = g2.map || {};
        //map
        g2.map.IMap = Map;
        g2.map.IGlobe = Globe;
        g2.map.ICamera = Camera;
        g2.map.Globe = CMGlobe;
        g2.map.Camera= CMCamera;
    })