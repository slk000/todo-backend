// mongodb+srv://my-react-notes:<password>@cluster0.dmw1u.azure.mongodb.net/<dbname>?retryWrites=true&w=majority

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('argv: node mongo.js <passwd>')
  process.exit(1)
}

const password = process.argv[2]
const dbname = 'test'

// const url =
//   `mongodb+srv://my-react-notes:${password}@cluster0.dmw1u.azure.mongodb.net/${dbname}?retryWrites=true&w=majority`
const url =
  `mongodb://my-react-notes:${password}0@ds147073.mlab.com:47073/heroku_xtj8nj0d`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

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
  },
  {
    content: "from db",
    date: new Date(),
    important: true
  }
]
notes.forEach(n => {
  const note = new Note({
    content: n.content,
    date: n.date,
    important: n.important
  })
  note.save().then(result => {
      console.log(`=======note ${n.id} saved===========`)
  })
})

mongoose.connection.close()


// Note.find({}).then(res => {
//   res.forEach(n => {
//     console.log(n)
//   })
//   mongoose.connection.close()
// })