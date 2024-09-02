

const mongoose = require("mongoose");
const password = "Alaa#ata87"
const uri =
  "mongodb+srv://alaaata25:alaaata87@cluster0.6hmfl.mongodb.net/habbit?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected successfully to MongoDB");
});

module.exports = mongoose;


// const uri =
//   "mongodb+srv://ramighazzawiabed:raez29R6ZYcrd4k9@cluster0.i5yvt.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0";

// mongoose.connect(uri, {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// });