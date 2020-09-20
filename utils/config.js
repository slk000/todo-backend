// 环境变量的处理被提取到一个单独的utils/config.js 文件中:
// 应用的其他部分可以通过导入配置模块来访问环境变量: const config = require('./utils/config')

require('dotenv').config() // 使用 .env 文件中定义的环境变量。您可以在代码中引用它们，就像引用普通环境变量一样，使用熟悉的 process.env.MONGODB_URI语法。

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV == 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}