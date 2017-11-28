/**
 *  @author by ligang on 2014/8/13.
 *  modify }{yellow
 */

define(function () {

    var id = 10000;
    /**
     * @class
     * @classdesc
     * 定义类型工具，实现类型继承
     * @alias g2.lang.classUtil
     * @returns {g2.lang.classUtil} 返回类型工具
     */
    var util = function () {
    }

    /*  util.extend = function (child, parent) {
     var F = function () {
     };
     F.prototype = parent.prototype;
     child.prototype = new F();
     child.prototype.constructor = child;
     child.uber = parent.prototype;
     }*/

    function inherts(child, parent) {
        var p = parent.prototype;
        var c = child.prototype;
        for (var i in p) {
            c[i] = p[i];
        }
        c.uber = p;
        inherts2(child);
    }

    function inherts2(type) {
        type.extend = function (child) {
            var that = this;
            var F = typeof child.initialize == 'function' ? child.initialize : function (opts) {
                that.call(this, opts || {});
            };
            inherts(F, this);
            for (var i in child) {
                if (child.hasOwnProperty(i) && i !== 'prototype') {
                    if (i != 'initialize') {
                        F.prototype[i] = child[i];
                    }
                }
            }
            return F;
        }
    }

    util.extend2 = function (child, parent) {
        inherts(child, parent);
        /*
         var p = parent.prototype;
         var c = child.prototype;
         for (var i in p) {
         c[i] = p[i];
         }
         c.uber = p;
         */
    }

    util.extend = function (parent, child) {
        var F = typeof child.initialize == 'function' ? child.initialize : function (opts) {
            var options = opts || {};
            parent.call(this, options);
        };

        util.extend2(F, parent);
        for (var i in child) {
            if (child.hasOwnProperty(i) && i !== 'prototype') {
                if (i != "initialize") {
                    F.prototype[i] = child[i];
                }
            }
        }
        return F;
    };

    util.isArray = function (obj) {
        return (!!obj && obj.constructor == Array);
    }

    util.newId = function () {
        return id++;
    }

    util.extendCopy = function (p) {
        var c = {};
        for (var i in p) {
            c[i] = p[i];
        }
        c.uber = p;
        return c;
    }

    util.deepCopy = deepCopy;

    util.objectPlus = function (o, stuff) {
        var n;

        function F() {
        };
        F.prototype = o;
        n = new F();
        n.uber = o;

        for (var i in stuff) {
            n[i] = stuff[i];
        }

        return n;
    }

    util.extendMulti = function () {
        var n = {}, stuff, j = 0, len = arguments.length;
        for (j = 0; j < len; j++) {
            stuff = arguments[j];
            for (var i in stuff) {
                n[i] = stuff[i];
            }
        }
        return n;
    }

    function deepCopy(p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            }
            else {
                c[i] = p[i];
            }
        }
        return c;
    }

    return util;

});
