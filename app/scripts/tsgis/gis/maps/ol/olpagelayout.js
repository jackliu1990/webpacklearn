/**
 * @author by wangyanxin on 2016-07-25.
 */
define(['../../../g2/lang/classUtil', '../pagelayout', 'ol'],function (ClassUtil,PageLayout,ol) {
        var pageLayout1 = function (opts) {
            var optss = opts || {};
            PageLayout.call(this, opts);
        }

        ClassUtil.extend2(pageLayout1, PageLayout);

        return pageLayout1;
    })