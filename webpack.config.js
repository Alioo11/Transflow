const path = require("path");

module.exports = {
  output: {
    filename: "js/[name]-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: `img/[name][ext]`,
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@_types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
};
