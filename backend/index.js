const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
var fs = require("fs");

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const imageSchema = new mongoose.Schema({
  url: String,
});

const Image = mongoose.model("Image", imageSchema);

var schema = new mongoose.Schema({
  name: String,
  img: { data: Buffer, contentType: String },
});

const a = mongoose.model("a", schema);

var imgpath = "Screenshot 2023-10-03 183456.png";
app.post("/addphotos", (req, res) => {
  const imge = new a();
  imge.name = req.body.name;
  imge.img.data = fs.readFileSync(imgpath);
  imge.img.contentType = "image/png";
  imge
    .save()
    .then(() => {
      console.log("saved");
      res.send("good");
    })
    .catch(() => {
      console.log("error");
    });
});

app.get("/getphotos", (req, res) => {
  a.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/deletephoto", (req, res) => {
  a.deleteOne({ name: req.body.name })
    .then(() => {
      console.log("good");
    })
    .catch((err) => {
      console.log(err);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
