const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const path = require('path');
module.exports = {
  entry: './src/app/entry.js',

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '..', 'node_modules/lit-element'),
          path.resolve(__dirname, '..', 'node_modules/lit-html'),
          path.resolve(__dirname, '..', 'src/app')
        ],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|ttf|otf|eot|svg|woff|woff2)$/i,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/app/index.html' })]
};
