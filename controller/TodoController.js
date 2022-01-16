const ObjectId = require("mongoose").Types.ObjectId;
const TodoServices = require("../services/TodoServices");
const { errorResponse, successResponse } = require("../utils/responses");

module.exports = class TodoController {
  /** Create ToDo */
  static async addTodo(req, res) {
    try {
      const { name } = req.body;
      /** Validation */
      if (!name || name === "") {
        return errorResponse(res, 400, "Please enter a task");
      }

      const dbParams = {
        name,
        status: "in-progress", // this is the default status for newly added task.
      };
      const saveTaskToDb = await TodoServices.createTodo(dbParams);
      if (saveTaskToDb.errors) {
        return errorResponse(res, 400, saveTaskToDb._message);
      }
      return successResponse(res, 201, "Task successfully added");
    } catch (error) {
      return errorResponse(res, 500, `Server Error: ${error.message}`);
    }
  }

  /** List all Todos */
  static async getAllTodos(req, res) {
    try {
      const result = await TodoServices.fetchTodos();
      return successResponse(res, 200, "Fetched All Tasks", result);
    } catch (error) {
      return errorResponse(res, 500, `Server Error: ${error.message}`);
    }
  }

  /** Update ToDo */
  static async editTodo(req, res) {
    try {
      const { id } = req.params;
      let { name, status } = req.body;

      // validate id passed
      if (!ObjectId.isValid(id)) {
        return errorResponse(res, 400, "Please select a task to edit");
      }

      // find todo with given id
      const todo = await TodoServices.fetchTodoById(id);
      if (!todo) {
        return errorResponse(res, 400, "Please enter a valid Task Id");
      }
      /** Keep previous values if not changed */
      name = !name || name === "" ? todo.name : name;
      status = status === undefined || status === "" ? todo.status : status;

      const allowedStatus = ["in-progress", "completed"];

      if (allowedStatus.indexOf(status) === -1) {
        return errorResponse(
          res,
          400,
          "Please select a valid status: 'in-progress' or 'completed'"
        );
      }

      const dbParams = {
        id,
        name,
        status,
      };
      const updateTaskInDb = await TodoServices.updateTodo(dbParams);
      if (updateTaskInDb.errors) {
        return errorResponse(res, 400, updateTaskInDb._message);
      }
      return successResponse(res, 200, "Task successfully updated");
    } catch (error) {
      return errorResponse(res, 500, `Server Error: ${error.message}`);
    }
  }

  /** Delete ToDo */
  static async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      // validate id passed
      if (!ObjectId.isValid(id)) {
        return errorResponse(res, 400, "Please select a task to delete");
      }
      // find todo with given id
      const todo = await TodoServices.fetchTodoById(id);
      if (!todo) {
        return errorResponse(res, 400, "Please enter a valid Task Id");
      }
      const deleteTaskFromDb = await TodoServices.deleteTodoFromDb(id);

      if (deleteTaskFromDb.errors) {
        return errorResponse(res, 400, deleteTaskFromDb._message);
      }
      return successResponse(res, 200, "Task successfully deleted");
    } catch (error) {
      return errorResponse(res, 500, `Server Error: ${error.message}`);
    }
  }
};
