const merge = require('webpack-merge');
const common = require('./webpack/webpack.common.js/index.js');
const path = require('path');
module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 1234
  }
});
