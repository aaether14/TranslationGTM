const path = require('path');
const WrapInScriptPlugin = require('./WrapInScriptPlugin'); 

module.exports = (env, argv) => ({
  mode: argv.mode || 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: argv.mode === 'production' ? 'script.bundle.js' : 'script.dev.js',
  },
  target: ['web', 'es5'],
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          },
    ],
  },
  devtool: argv.mode === 'production' ? false : 'source-map',
  optimization: {
    minimize: argv.mode === 'production',
  },
  plugins: [new WrapInScriptPlugin()], 
});