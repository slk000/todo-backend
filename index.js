const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
]

const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(n => n.id === id)
  if (note) {
    res.json(note)
  }
  else {
    res.status(404).end() // 使用end方法来响应request而不发送任何数据
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(n => n.id != id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  if (!req.body) {
    return res.status(400).json({error: 'contetnt missing'})
  }

  const note = req.body

  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  
  note.id = maxId + 1
  note.important = note.important || false
  notes = notes.concat(note)
  res.json(note)
})

app.listen(PORT, () => {
  console.log(`server at ${PORT}`)
})