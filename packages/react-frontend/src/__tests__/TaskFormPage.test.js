import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TaskFormPage from "../TaskFormPage";

describe("TaskFormPage Component", () => {
  test("renders form elements", () => {
    render(
      <BrowserRouter>
        <TaskFormPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Add a New Task/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Expected time in minutes (e.g. 30)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Task/i })).toBeInTheDocument();
  });
});
