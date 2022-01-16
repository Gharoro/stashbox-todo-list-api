const express = require("express");
const router = express.Router();
const TodoController = require("../controller/TodoController");

router.post("/", TodoController.addTodo);
router.get("/", TodoController.getAllTodos);
router.put("/:id", TodoController.editTodo);
router.delete("/:id", TodoController.deleteTodo);

module.exports = router;
