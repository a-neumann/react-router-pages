var path = require("path");
var webpack = require("webpack");
var merge = require("webpack-merge");
var nodeExternals = require("webpack-node-externals");
var AssetsPlugin = require("assets-webpack-plugin");

var commonConfig = {
    output: {
        path: path.join(__dirname, "public"),
        publicPath: "/public/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "./example/tsconfig.json",
                    useBabel: true,
                    useCache: true,
                    sourceMap: true
                }
            }
        ]
    }
};

// var ssrConfig = merge(commonConfig, {
//     entry: {
//         app: "./example/client/App.tsx"
//     },
//     output: {
//         filename: "index-ssr.js",
//         libraryTarget: "commonjs"
//     },
//     target: "node",
//     externals: [nodeExternals()]
// });

var clientConfig = merge(commonConfig, {
    entry: {
        index: "./example/client/index.tsx"
    },
    output: {
        filename: "[name].js"
    },
    target: "web",
    plugins: [
        new AssetsPlugin({
            filename: "assets.json",
            path: path.join(__dirname, "public"),
            includeManifest: "manifest"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
            exclude: ["vendor", "manifest"]
        })
    ]
});

// None of them are production configs. Don't use for prod builds!
//module.exports = [ssrConfig, clientConfig];
module.exports = clientConfig;