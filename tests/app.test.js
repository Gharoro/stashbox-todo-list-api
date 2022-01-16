const db = require("../config/dbconnection");
const request = require("supertest");
const server = require("../server");
const TodoServices = require("../services/TodoServices");

beforeAll(async () => {
  await db.connectDB();
});
afterEach(async () => {
  await db.clearDatabase();
});
afterAll(async () => {
  await db.closeDatabase();
  server.close();
});

describe("POST Endpoint - Create a Task", () => {
  jest.setTimeout(30000);
  // success
  it("should create a new task", async () => {
    const res = await request(server).post("/api/v1/todos").send({
      name: "Build a house",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
    expect(res.body).toHaveProperty("message");
  });
  // failure
  it("should not create a new task if name is empty", async () => {
    const res = await request(server).post("/api/v1/todos").send({
      name: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Please enter a task");
  });
});

describe("GET Endpoint - Fetch All Tasks", () => {
  jest.setTimeout(30000);

  it("fetch all tasks", async () => {
    await TodoServices.createTodo({ name: "Wash the dishes" });
    const res = await request(server).get("/api/v1/todos");

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual("Fetched All Tasks");
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });
});

describe("PUT Endpoint - Edit A Task", () => {
  jest.setTimeout(30000);
  // success
  it("should update a task name and status", async () => {
    const todo = await TodoServices.createTodo({ name: "Wash the dishes" });

    const res = await request(server).put(`/api/v1/todos/${todo._id}`).send({
      name: "Do house chores",
      status: "completed",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Task successfully updated");
    return res;
  });
  // failure
  it("should not update a task if task ID is invalid", async () => {
    const id = 123;
    const res = await request(server).put(`/api/v1/todos/${id}`).send({
      name: "Do house chores",
      status: "completed",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Please select a task to edit");
  });
});

describe("DELETE Endpoint - Delete A Task", () => {
  jest.setTimeout(30000);
  // success
  it("should delete a task", async () => {
    const todo = await TodoServices.createTodo({
      name: "Visit Dubai next year",
    });

    const res = await request(server).delete(`/api/v1/todos/${todo._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toEqual(true);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Task successfully deleted");
    return res;
  });
  // failure
  it("should not delete a task if task ID is invalid", async () => {
    const id = 889;
    const res = await request(server).delete(`/api/v1/todos/${id}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Please select a task to delete");
  });
});
