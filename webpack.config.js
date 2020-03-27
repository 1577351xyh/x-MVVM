const path=require('path');
//分割
const Strip=require('strip-loader');

module.exports=function (env={}){
  const dev=env.dev;

  return {
    //编译模式
    mode: dev?'development':'production',
    //编译入口
    entry: dev?['@babel/polyfill', './src/index.js']:'./src/axios.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: dev?'axios.js':'axios.min.js',
      sourceMapFilename: dev?'axios.map':'axios.min.map',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {test: /\.js$/i, use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          //去掉不用的
          ...dev?[]:[{
            loader: Strip.loader('alert', 'assert')
          }],
        ]}
      ]
    },
    devtool: 'source-map',
    devServer: {
      port: 8080,
      open: true,
    }
  };
};
