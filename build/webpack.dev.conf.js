const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");

module.exports = merge(baseConfig, {
    module: {
        rules: [

            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 7631,
                        name: "[name].[ext]",
                        outputPath: "image",
                        esModule: false
                    }
                }]
            },
        ]
    },
    mode: "development",
    devServer: {
        open: true,
        hot: true,
        // hotOnly: true,
        port: 5966,
        contentBase: "/",
        compress: true,
        // host: "0.0.0.0",//外网访问
        host: "localhost",
        // https: true,
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://192.168.66.107:80/",
                pathRewrite: { "^/api": "" },
                changeOrigin: true,
            },
            "/api1": {
                target: "http://192.168.66.107:5466/",
                pathRewrite: { "^/api1": "" },
                changeOrigin: true,
            },
        }
    },
    devtool: 'cheap-module-source-map',
})