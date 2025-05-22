import express from "express";
import cors from "cors";
import taskFunction from "./task-functions.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/tasks/:id", (req, res) => {
  taskFunction
    .findTaskById(req.params.id)
    .then((task) => {
      if (!task) return res.status(404).send("task not found");
      res.send(task);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error fetching task");
    });
});

app.get("/tasks", (req, res) => {
  const { due_date, urgency, ease } = req.query;
  taskFunction
    .getTasks(due_date, urgency, ease)
    .then((tasks) => res.send({ task_list: tasks }))
    .catch((err) => {
      console.error(err);
      res.status(500).send("error fetching tasks");
    });
});

app.post("/tasks", (req, res) => {
  console.log("Received task data:", req.body);
  
  // Validate required fields
  if (!req.body.name || !req.body.category) {
    return res.status(400).json({ error: "Name and category are required" });
  }

  taskFunction
    .addTask(req.body)
    .then((newTask) => {
      console.log("Task added successfully:", newTask);
      res.status(201).json(newTask);
    })
    .catch((err) => {
      console.error("Error adding task:", err);
      res.status(400).json({ error: "Error adding task", details: err.message });
    });
});

app.delete("/tasks/:id", (req, res) => {
  taskFunction
    .deleteTaskById(req.params.id)
    .then((deleted) => {
      if (!deleted) return res.status(404).send("task not found");
      res.status(204).send(); // no content, success
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error deleting task");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
