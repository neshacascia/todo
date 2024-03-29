const ToDo = require('../models/ToDo');

module.exports = {
  getToDos: async (req, res) => {
    console.log(req.user);

    try {
      const toDoItems = await ToDo.find({ userId: req.user.id });
      const itemsLeft = await ToDo.countDocuments({
        userId: req.user.id,
        completed: false,
      });
      res.render('todos.ejs', {
        items: toDoItems,
        left: itemsLeft,
        user: req.user,
      });
    } catch (err) {
      console.error(err);
    }
  },
  addToDo: async (req, res) => {
    try {
      await ToDo.create({
        toDo: req.body.toDo,
        completed: false,
        userId: req.user.id,
      });
      console.log('Todo has been added');
      res.redirect('/todos');
    } catch (err) {
      console.error(err);
    }
  },
  markCompleted: async (req, res) => {
    try {
      await ToDo.findOneAndUpdate(
        {
          _id: req.body.toDo,
        },
        {
          completed: true,
        }
      );
      console.log('Todo marked completed');
      res.json('Todo marked completed');
    } catch (err) {
      console.error(err);
    }
  },
  markIncompleted: async (req, res) => {
    try {
      await ToDo.findOneAndUpdate(
        {
          _id: req.body.toDo,
        },
        {
          completed: false,
        }
      );
      console.log('Todo marked incompleted');
      res.json('Todo marked incompleted');
    } catch (err) {
      console.error(err);
    }
  },
  deleteToDo: async (req, res) => {
    try {
      await ToDo.findOneAndDelete({ _id: req.body.toDo });
      console.log('Todo deleted');
      res.json('Todo deleted');
    } catch (err) {
      console.error(err);
    }
  },
  clearCompleted: async (req, res) => {
    try {
      await ToDo.deleteMany({ completed: true });
      console.log('Completed todos deleted');
      res.json('Completed todos deleted');
    } catch (err) {
      console.error(err);
    }
  },
};
