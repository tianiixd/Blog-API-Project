import express from "express";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = Number(process.env.portServer);
const API_URL = process.env.API_URL;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route to display the homepage
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    const result = response.data;
    res.render("index", { posts: result });
    console.log(result);
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to display the edit page or modify.ejs
app.get("/new", (req, res) => {
  res.render("modify", { heading: "New Post", submit: "Create Post" });
});

// Route to render from the modify.ejs
app.get("/edit/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const response = await axios.get(`${API_URL}/posts/${id}`);
    const result = response.data;
    res.render("modify", {
      heading: "Edit Post",
      submit: "Update Post",
      post: result,
    });
    console.log(result);
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Error editing post" });
  }
});

// Create post eto it sends the data that was submitted from the form to the API server that which handles the request
// Which is the index.ts
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response);
    res.redirect("/");
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Error editing post" });
  }
});

// Update the post by Patch method, and get's the data form from modify.ejs and sends the data to the index.ts or the API server
// It's a patch method request from index.ts
app.post("/api/posts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const response = await axios.patch(`${API_URL}/posts/${id}`, req.body);
    const result = response.data;
    console.log(result);
    res.redirect("/");
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Error editing post" });
  }
});
// Delete post by params again
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const response = await axios.delete(`${API_URL}/posts/${id}`);
    const result = response.data;
    console.log(result);
    res.redirect("/");
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Error editing post" });
  }
});

app.listen(port, () => {
  console.log(`Backend Server is running on https://localhost:${port}`);
});
