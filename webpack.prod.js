// const path = require("path");
// const merge = require("webpack-merge");
// const common = require("./webpack.config");
// const webpack = require("webpack");


const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.config");
const webpack = require("webpack");

module.exports = merge.merge(common, {
  entry: {
    main: "./src/index.ts",
  },
  mode: "production",
  target: 'web',
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    libraryTarget: "umd",
    globalObject: 'this',
    library: {
      type: "module",
    },
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.test.ts$/,
    }),
  ],
});
