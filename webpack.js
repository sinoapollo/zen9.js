/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
//const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = (env, argv) => ({
  entry: {
    'index': './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {/* Loader options go here */}
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
                  esModule: false,
                  sources: {
                      //list: ["..."],
                      urlFilter: (attribute, value, resourcePath) => {
                          // The `attribute` argument contains a name of the HTML attribute.
                          // The `value` argument contains a value of the HTML attribute.
                          // The `resourcePath` argument contains a path to the loaded HTML file.
                          if (/\$\{/.test(value) || /\$\{/.test(attribute)) {
                              return false;
                          }
                          return true;
                      },
                  },
            },
          },
        ],

      },
      {
        test: /\.css$/,
        use: [
            "style-loader",
            {
              loader: '@teamsupercell/typings-for-css-modules-loader',
              options: {
              }
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
                esModule: false,
              }
            },
          ]
      },
      {
        test: /\.svg$/,
        use: 'svg-url-loader',
      },
      {
        test: /\.(jpe?g|png|ttf|eot|otf|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
  },
  plugins: [
    new htmlWebpackPlugin({
       template:'src/index.html',
       filename: 'index.html'
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          {from: 'data', to: 'data'} //复制目录，把data目录里的内容复制到网站目录data里
        ]
      },
    ),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  target: 'node',
  devtool: false,
  externals: [], // in order to ignore all modules in node_modules folder
});