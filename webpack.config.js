/**
 * Created by liufeng on 2017/11/3.
 */
var webpack = require('webpack')
var path =require('path')
module.exports = {
    entry:{
        tsgis2d: './app/scripts/tsgis/index2d.js',
        tsgis3d: './app/scripts/tsgis/index3d.js',
        tsgis: './app/scripts/tsgis/index.js'
    },
    output:{
        filename: '[name].js',
        path:path.join(__dirname,'dist'),
		libraryTarget: "umd"
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
    externals:{
        "jquery": "jQuery",
        "ol":"ol",
        "Cesium":"Cesium"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port:8089,
        inline:true,
        hot:true
    }
}