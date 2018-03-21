/**
 * Created by liufeng on 2017/11/28.
 */
define(["./map","./pagelayout","./ol/olmap","./ol/olpagelayout"],
    function (Map,PageLayOut,OlMap,OlPageLayOut) {
        var g2 = window.g2 || {};
        window.g2 = g2;
        g2.map = g2.map || {};
        //map
        g2.map.IMap = Map;
        g2.map.IPageLayOut = PageLayOut;
        g2.map.Map = OlMap;
        g2.map.PageLayOut = OlPageLayOut;
    })