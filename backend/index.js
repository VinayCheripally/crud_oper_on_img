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
  img: { data: Buffer, contentType: String },
});

const a = mongoose.model("a", schema);
app.post("/", (req, res) => {
  console.log(req.body);
  const imagetemp = new Image(req.body);
  imagetemp
    .save()
    .then(() => {
      res.send("good");
    })
    .catch(() => {
      res.send("bad");
    });
});

app.get("/", (req, res) => {
  Image.find()
    .then((images) => {
      res.json(images);
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
      res.status(500).send("Internal Server Error");
    });
});
var imgpath = "Screenshot 2023-10-03 183456.png";
app.post("/addphotos", (req, res) => {
  const imge = new a();
  imge.img.data = fs.readFileSync(imgpath);
  imge.img.contentType = "image/png";
  imge
    .save()
    .then(() => {
      console.log("saved");
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
