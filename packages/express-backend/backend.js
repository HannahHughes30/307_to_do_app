import express from "express";
import cors from "cors";
import userService from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors()); // allows backend to respond to calls coming from diff ports (frontend and backend are on diff ports for example)

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  userService
    .findUserById(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send("user not found");
      res.send(user);
    })
    .catch((err) => res.status(500).send("error fetching user"));
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userService
    .getUsers(name, job)
    .then((users) => res.send({ users_list: users }))
    .catch((err) => {
      console.error(err);
      res.status(500).send("error fetching users");
    });
});

app.post("/users", (req, res) => {
  userService
    .addUser(req.body)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => res.status(400).send("error adding user"));
});

app.delete("/users/:id", (req, res) => {
  userService
    .deleteUserById(req.params.id)
    .then((deleted) => {
      if (!deleted) return res.status(404).send("user not found");
      res.status(204).send(); // no content, success ayeeee
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error deleting user");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
