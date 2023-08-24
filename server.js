const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const PORT = 8000;
require('dotenv').config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'toDos';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then(client => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  })
  .catch(err => console.error(err));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  db.collection('toDos')
    .find()
    .toArray()
    .then(data => {
      res.render('index.ejs', { items: data });
    })
    .catch(err => console.error(err));
});

app.post('/addToDo', (req, res) => {
  db.collection('toDos')
    .insertOne({ toDo: req.body.toDo, completed: false })
    .then(result => {
      console.log('To do added');
      res.redirect('/');
    })
    .catch(err => console.error(err));
});

app.put('/markCompleted', (req, res) => {
  db.collection('toDos')
    .updateOne(
      {
        _id: new ObjectId(req.body.toDo),
      },
      {
        $set: {
          completed: true,
        },
      }
    )
    .then(result => {
      console.log('Todo marked completed');
      res.json('Todo marked completed');
    })
    .catch(err => console.error(err));
});

app.delete('/deleteToDo', (req, res) => {
  db.collection('toDos')
    .deleteOne({ _id: new ObjectId(req.body.toDo) })
    .then(result => {
      console.log('To do deleted');
      res.json('Todo Deleted');
    })
    .catch(err => console.error(err));
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}.`);
});
