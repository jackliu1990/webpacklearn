/**
 * Created by liufeng on 2017/11/3.
 */
var webpack = require('webpack')
var path =require('path')
module.exports = {
    entry:{
        app:path.join(__dirname,'src','index.js')
    },
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'dist'),
		libraryTarget: "amd"
    },
    resolve:{
        //模块别名
        alias:getModuleAlias(),
        //模块目录
        modules:[
            path.resolve('./app/scripts/tsgis')
        ],
        extensions:['.js']
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port:8089,
        inline:true,
        hot:true
    }
}

function getModuleAlias(){
    var rootpath = path.resolve("./app/scripts/tsgis");
    var jsRegex = /.*\.js$/,
    indexRegex = /^index\.js$/;
    var obj = {};

}