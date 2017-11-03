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
		libraryTarget: "amd",
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