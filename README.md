# zen9.js
简捷的前端框架

## 新项目创建步骤：
1.创建目录xxx
2.在目录xxx下执行npm init
3.在目录xxx下执行 npm install @teamsupercell/typings-for-css-modules-loader @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser compression-webpack-plugin copy-webpack-plugin css-loader eslint eslint-loader" eslint-webpack-plugin html-loader html-webpack-plugin style-loader svg-inline-loader svg-url-loader ts-loader ts-node typescript url-loader webpack webpack-cli -D
4.在目录xxx下执行 tsc --init
5.在目录xxx下执行 eslint --init
6.复制demo的webpack.js到目录xxx下
7.复制demo的common目录到目录xxx中指定位置

## 其它
所有代码目录/名称都是自定义的，入口文件名在webpack.js中指定
编译命令在package.json中由scripts项指定，demo项目中每次写完代码，需执行 npm run build，编译完成后才可以从浏览器中调试
ts中指定的html文件是模板文件，所有语法均需符合eval函数调用规则

#### 框架待完善