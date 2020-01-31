const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/configs.env" });
mongoose.set("useFindAndModify", false);
let User = require("./models/user.model");
const app = express();
const path = require("path");
const port = process.env.PORT || 8081;
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.once("open", () => {
  console.log("db connected ");
});

const authRouter = require("./routes/authRouter");
app.use("/auth", authRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.render("index", { users });
});

app.all("*", function(req, res) {
  res.redirect("/users");
});

app.listen(port, () => {
  console.log(`server listening in ${port}`);
});
