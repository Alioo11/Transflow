const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.config");
const webpack = require("webpack");

module.exports = merge.merge(common, {
  entry: {
    main: "./src/index.ts",
  },
  mode: "production",
  output: {
    filename: "[name]-[contenthash].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.test.ts$/,
    }),
  ],
});
