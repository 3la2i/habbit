const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// MongoDB connection URI
const uri = 'mongodb+srv://alaaata25:alaaata87@cluster0.6hmfl.mongodb.net/habbit?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected successfully to MongoDB');
});

// Middleware
app.use(cors());
app.use(express.json());

// Define a schema and model
const taskSchema = new mongoose.Schema({
  name: String,
  category: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
      });

// POST a new task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT (update) a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});









// // habbit first
// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();
// const port = 5000;

// // MongoDB connection URI
// const uri = 'mongodb+srv://alaaata25:alaaata87@cluster0.6hmfl.mongodb.net/habbit?retryWrites=true&w=majority';

// // Connect to MongoDB
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('Connected successfully to MongoDB');
// });

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Define a schema and model
// const taskSchema = new mongoose.Schema({
//   name: String,
//   category: String,
//   completed: Boolean,
//   createdAt: Date,
//   completionHistory: [Object], // Adjust according to your requirements
// });

// const Task = mongoose.model('Task', taskSchema);

// // POST endpoint to create a new task
// app.post('/tasks', async (req, res) => {
//   try {
//     const task = new Task(req.body);
//     await task.save();
//     res.status(201).json(task);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });






































// rami
// const mongoose = require("./index");
// const express = require("express");
// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Define a schema for the 'movies' collection
// const movieSchema = new mongoose.Schema({}, { strict: false });

// // Create a model based on the schema
// const Movie = mongoose.model("Movie", movieSchema, "movies");

// // Define a schema for the 'users' collection 
// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: String,
//   },
//   { timestamps: true }
// );

// // Create a model for the 'users' collection
// const User = mongoose.model("User", userSchema, "users");

// async function run() {
//   try {
//     console.log("Fetching documents from collection...");
//     const allData = await Movie.find().limit(100).exec();

//     console.log(`Number of documents retrieved: ${allData.length}`);

//     if (allData.length > 0) {
//       console.log("First document:");
//       console.log(allData[0].toObject());
//     } else {
//       console.log("No documents found in the collection.");
//     }

//     return allData;
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// }

// app.get("/data", async (req, res) => {
//   try {
//     const allData = await run();
//     res.json(allData);
//   } catch (error) {
//     res.status(500).send("An error occurred. Please check the logs.");
//   }
// });

// // Updated route to create a user without password
// app.post("/users", async (req, res) => {
//   try {
//     // Create a new user document
//     const newUser = new User(req.body);

//     // Save the user to the database
//     const savedUser = await newUser.save();

//     res.status(201).json(savedUser);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).send("An error occurred while creating the user.");
//   }
// });

// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });

