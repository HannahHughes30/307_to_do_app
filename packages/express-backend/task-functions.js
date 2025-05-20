import mongoose from "mongoose";
import taskModel from "./models/task.js";
import dotenv from "dotenv";
dotenv.config();

// mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getTasks(due_date, urgency, ease) {
  const filter = {};
  if (due_date) filter.due_date = due_date;
  if (urgency) filter.urgency = urgency;
  if (ease) filter.ease = ease;
  return taskModel.find(filter);
}

function findTaskById(id) {
  return taskModel.findById(id);
}

function addTask(task) {
  const taskToAdd = new taskModel(task);
  const promise = taskToAdd.save();
  return promise;
}

function findTaskByDueDate(due_date) {
  return taskModel.find({ due_date: due_date });
}

function findTaskByUrgency(urgency) {
  return taskModel.find({ urgency: urgency });
}

function findTaskByEase(ease) {
    return taskModel.find({ ease: ease });
  }

function deleteTaskById(id) {
  return taskModel.findByIdAndDelete(id);
}

export default {
  addTask,
  getTasks,
  findTaskById,
  findTaskByDueDate,
  findTaskByUrgency,
  findTaskByEase,
  deleteTaskById,
};
