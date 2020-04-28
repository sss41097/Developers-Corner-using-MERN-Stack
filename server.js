const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

//connect database
connectDB();

//init middleware
app.use(express.json({ extended: false }));

app.use("/api/user", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//server static assests in production, for index.html of client to serve
if (process.env.NODE_ENV === "production") {
  //Set statuc folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.senddFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
