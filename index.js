//index.js 文件只从 app.js 文件导入实际的应用，
// 然后启动应用。

const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on ${config.PORT}`)
})