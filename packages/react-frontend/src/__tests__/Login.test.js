import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import { BrowserRouter } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.spyOn(window, "alert").mockImplementation(() => {});

describe("Login Component", () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders username and password inputs", () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("🧈 Sign In")).toBeInTheDocument();
  });

  test("successful login triggers alert and redirects", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<BrowserRouter><Login /></BrowserRouter>);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "user" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass" } });
    fireEvent.click(screen.getByText("🧈 Sign In"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login successful!");
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("failed login triggers error alert", async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Invalid credentials" }) });

    render(<BrowserRouter><Login /></BrowserRouter>);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "baduser" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "badpass" } });
    fireEvent.click(screen.getByText("🧈 Sign In"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login failed: Invalid credentials");
    });
  });

  test("signup link navigates to /signup", () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    fireEvent.click(screen.getByText("New? Sign Up →"));
    expect(mockedNavigate).toHaveBeenCalledWith("/signup");
  });
});
