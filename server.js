var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
var Mailer = require("./Routes/mailer");
var Users = require("./Routes/Users");

app.use("/mailer", Mailer);
// app.use("/blockchain", Multichain);
app.use("/users", Users);

var port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port: ` + port);
});
