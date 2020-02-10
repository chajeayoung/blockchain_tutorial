//웹핵은 파일들을 최적화시켜주고 코드의 변화가있을때 감지를해서 브라우저에 변경사항을 새로고침없이 반영해주느것
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: 'development',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'dist')   
  },
  plugins: [   
    //이부분 abi address 가져오는것
    new webpack.DefinePlugin({
      DEPLOYED_ADDRESS: JSON.stringify(fs.readFileSync('deployedAddress', 'utf8').replace(/\n|\r/g, "")),
      DEPLOYED_ABI: fs.existsSync('deployedABI') && fs.readFileSync('deployedABI', 'utf8'),
    }),
    //webpack에서 컴파일 타임때 이부분을 실행해서 address 와 abi 전역상수를 설정하는부분.
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html"}])
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true }
}