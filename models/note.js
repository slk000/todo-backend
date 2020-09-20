const mongoose = require('mongoose')

// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false)

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: {
    type: Date,
    // required: true
  },
  important: Boolean,
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
})

// 格式化 Mongoose 返回的对象的一种方法是修改Schema 的 toJSON 方法，这个schema是作用在所有models实例上的。
noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString() // 尽管 Mongoose 对象的 id 属性看起来像一个字符串，但实际上它是一个对象。 为了安全起见，我们定义的 toJSON 方法将其转换为字符串。
    // returnObject.date = Date()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)