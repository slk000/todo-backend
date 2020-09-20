// 路由处理程序也被移动到一个专用的模块中。 路由的事件处理程序通常称为controllers，
// 出于这个原因，我们创建了一个新的controllers 目录。
// 所有与便笺相关的路由现在都在controllers 目录下的notes.js 模块中定义。

// 路由实际上是一个中间件，可用于在某个位置定义“相关路由” ，通常放置在单独的模块中。
// 下面的app.js 是一个创建实际应用的文件，对路由对象使用use方法，按如下方式使用:
// const notesRouter = require('./controllers/notes')
// app.use('/api/notes', notesRouter)
// 如果请求的 URL 以 /api/notes开头，则会使用之前定义的路由。 由于这个原因，notesRouter 对象**必须**只定义路由的相对部分，即空路径/或仅仅定义参数/:id。
const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

const getTokenfrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}



notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username:1, name:1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id
  // Note.findById(id)
  //   .then(note => {
  //     note
  //       ? response.json(note)
  //       : response.status(404).end() // id格式正确但找不到
  //   })
  //   .catch(error => next(error)) // 使用next 函数向下传递错误

  // 改为 await/async 并用库消除try-catch
  // try {
  const note = await Note.findById(id)
  if (note) {
    response.json(note)
  }
  else {
    response.status(404).end()
  }
  // } catch (exception) {
  //   next(exception)
  // }
})

notesRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  // Note.findByIdAndRemove(id)
  //   .then(result => {
  //     response.status(204).end()
  //   })
  //   .catch(error => next(error))
  //try {
  await Note.findByIdAndRemove(id)
  response.status(204).end()
  // } catch (exception) {
  //   next(exception)
  // }
})

notesRouter.post('/', async (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({ error: 'contetnt missing' })
  }

  const token = getTokenfrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: request.body.content,
    important: request.body.important || false,
    date: new Date(),
    user: user._id
  })

  // note
  //   .save()
  //   .then(savedNote => savedNote.toJSON()) // 在这个例子中，承诺链没有提供多少好处。
  //   .then(savedAndFormattedNote => { // 但要是有许多必须按顺序进行的异步操作，情况就会发生变化。
  //     response.json(savedAndFormattedNote) //  我们不会进一步深入探讨这个议题。 在本课程的下一章节中，
  //   })                                // 我们将学习 JavaScript 中的async/await语法，这将使编写后续的异步操作变得容易得多。
  //   .catch(error => next(error))
  // 改用async、await
  // try {
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.json(savedNote)
  // } catch(exception) {
  //   next(exception)
  // }

})

notesRouter.patch('/:id', (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({ error: 'contetnt missing' })
  }
  const id = request.params.id

  const note = {
    // content: response.body.content,
    important: request.body.important
  }
  Note.findByIdAndUpdate(id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter