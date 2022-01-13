const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: './src/index.vue',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "merge.js",
    library: 'merge'
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.less$/,
      use: ['vue-style-loader','css-loader','less-loader']
    }]
  }
}