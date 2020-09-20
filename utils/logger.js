// 将日志记录功能提取到一个单独的模块是个不错的实践。
// 如果我们后来想将日志写入一个文件，或者将它们发送到一个外部日志服务中，
// 比如 graylog 或者 papertrail ，我们只需要在一个地方进行修改就可以了。

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
  
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info, error
}