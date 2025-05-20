import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    due_date: {
      type: Date,
      required: true,
      trim: true,
      validate(value) {
        if (value > new Date())
          throw new Error("Invalid Due Date, must be due in the future.");
      },
    },
    urgency: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value >= 0 && value <= 10)
              throw new Error("Invalid Urgency, must be a number between 0 and 10");
        },
    }, 
    ease: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value >= 0 && value <= 10)
              throw new Error("Invalid Ease, must be a number between 0 and 10");
        },
    },
  },
  { collection: "task_list" },
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
