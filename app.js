const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors') //  用于消除try-catch
// const cors = require('cors') // for cross domain access
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    logger.info('connected', result)
  })
  .catch(error => {
    logger.error('error connecting:', error.message)
  })

// 注意app.use的顺序
// for serving static files of frontend
// 每当 express 收到一个 HTTP GET 请求时，它都会首先检查build 目录是否包含与请求地址对应的文件。
// 如果找到正确的文件，express 将返回该文件

// app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


process.on('SIGINT', function () {
  console.log('disconnecting')
  mongoose.connection.close()
  process.exit()
})

console.log(process.env.SECRET)


module.exports = app