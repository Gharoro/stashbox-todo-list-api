const Todo = require("../model/Todo");

module.exports = class TodoServices {
  // saved todo to database
  static async createTodo(data) {
    try {
      const newTodo = {
        name: data.name,
        status: data.status,
      };
      const response = await new Todo(newTodo).save();
      return response;
    } catch (error) {
      return error;
    }
  }

  // get all todos from database orderd by most recently added
  static async fetchTodos() {
    try {
      const response = await Todo.find().sort({
        createdAt: -1,
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  // get todo by id
  static async fetchTodoById(id) {
    try {
      const response = await Todo.findById(id);
      return response;
    } catch (error) {
      return error;
    }
  }

  // edit task name and status
  static async updateTodo(data) {
    try {
      const newTodo = {
        name: data.name,
        status: data.status,
      };
      const response = await Todo.updateOne(
        { _id: data.id },
        { $set: newTodo }
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  // delete task
  static async deleteTodoFromDb(id) {
    try {
      const response = await Todo.deleteOne({ _id: id });
      return response;
    } catch (error) {
      return error;
    }
  }
};
