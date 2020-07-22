require('dotenv').config() // 使用 .env 文件中定义的环境变量。您可以在代码中引用它们，就像引用普通环境变量一样，使用熟悉的 process.env.MONGODB_URI语法。
const express = require('express')
const cors = require('cors') // for cross domain access
const mongoose = require('mongoose')
const Note = require('./models/note')
const app = express()
// 注意app.use的顺序
// for serving static files of frontend
// 每当 express 收到一个 HTTP GET 请求时，它都会首先检查build 目录是否包含与请求地址对应的文件。
// 如果找到正确的文件，express 将返回该文件

app.use(express.static('build'))
// app.use(cors())
app.use(express.json())

// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false) 


const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>')
})

app.get('/api/notes', (req, res) => {
  console.log('get all')
  Note.find({}).then(notes => {
    console.log(notes)
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id).then(note =>{
    if (note) {
      res.json(note)
    }
    else {
      res.status(404).end() // id格式正确但找不到
    }
  })
  .catch(error => next(error)) // 使用next 函数向下传递错误
})

app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(console.error()))
})

app.post('/api/notes', (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({error: 'contetnt missing'})
  }
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
    date: new Date()
  })

  note.save().then(savedNote => {
    res.json(savedNote)
  })
  .catch(error => next(error))
})

app.patch('/api/notes/:id', (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({error: 'contetnt missing'})
  }
  const id = req.params.id

  const note = {
    // content: res.body.content,
    important: req.body.important
  }
  Note.findByIdAndUpdate(id, note, {new: true})
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

app.listen(PORT, () => {
  console.log(`server at ${process.env.PORT}`)
})
process.on('SIGINT', function () {
  console.log('disconnecting');
  mongoose.connection.close()
  process.exit()
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({error: 'malformatted id'})
  }
  next(error)
}
app.use(errorHandler)