const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log(`connecting to ${url}`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected')
  })
  .catch(error => {
    console.log('error connecting:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

// 格式化 Mongoose 返回的对象的一种方法是修改Schema 的 toJSON 方法，这个schema是作用在所有models实例上的。
noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString() // 尽管 Mongoose 对象的 id 属性看起来像一个字符串，但实际上它是一个对象。 为了安全起见，我们定义的 toJSON 方法将其转换为字符串。
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)