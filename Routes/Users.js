var express = require("express");
var users = express.Router();
var database = require("../Database/database");
var cors = require("cors");
var jwt = require("jsonwebtoken");
var token;

users.use(cors());
SECRET_KEY = "poolmein";

users.post("/register", function (req, res) {
  var today = new Date();
  //   var isEmailVerified = 1;
  var appData = {
    error: 1,
    data: "",
  };
  var userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    insitituteID: req.body.insitituteID,
    levelID: 1,
    gender: req.body.gender,
    emailID: req.body.emailID,
    password: req.body.password,
    profileImageUrl: "ss",
    dateJoined: today,
    isEmailVerified: 0,
    numOfReferrals: 0,
  };
  // const userID = 2;
  // console.log(insitituteID);
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const instituteID = req.body.instituteID;
  const levelID = 1;
  const gender = req.body.gender;
  const emailID = req.body.emailID;
  const password = req.body.password;
  const profileImageUrl = "ss";
  const dateJoined = "2022-12-22";
  const isEmailVerified = 0;
  const numOfReferrals = 0;
  const phone = req.body.phone;
  database.connection.getConnection(function (err, connection) {
    console.log(userData);
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
      console.log(err);
    } else {
      connection.query(
        "SELECT * FROM user where emailID=?",
        [emailID],
        function (err, rows, fields) {
          if (err) {
            appData.error = 1;
            appData["data"] = "Error Occused";
            res.status(400).json(appData);
          } else {
            if (rows.length > 0) {
              console.log(rows);
              appData.error = 2;
              appData["data"] = "Email already exists";
              res.status(201).json(appData);
            } else {
              connection.query(
                "INSERT INTO user (firstName, lastName, instituteID, levelID, gender, emailID, password, profileImageUrl, dateJoined, isEmailVerified, numOfReferrals,phone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  firstName,
                  lastName,
                  instituteID,
                  levelID,
                  gender,
                  emailID,
                  password,
                  profileImageUrl,
                  dateJoined,
                  isEmailVerified,
                  numOfReferrals,
                  phone,
                ],
                function (err, rows, fields) {
                  if (!err) {
                    appData.error = 0;
                    appData["data"] = rows;
                    console.log("rows", rows);
                    res.status(201).json(appData);
                  } else {
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                    console.log(err);
                  }
                }
              );
              connection.release();
            }
          }
        }
      );
    }
  });
});
users.post("/login", function (req, res) {
  var appData = {};
  var emailID = req.body.emailID;
  var password = req.body.password;

  database.connection.getConnection(function (err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
      console.log(err);
    } else {
      connection.query(
        "SELECT userID, emailID, password, isEmailVerified, isReferralEntered FROM user WHERE emailID = ?",
        [emailID],
        function (err, rows, fields) {
          if (err) {
            appData.error = 1;
            appData["data"] = "Error Occused";
            res.status(400).json(appData);
            console.log(rows);
            console.log(err);
          } else {
            if (rows.length > 0) {
              if (rows[0].password == password) {
                // let token = jwt.sign(rows[0], SECRET_KEY, {
                //   expiresIn: 1440,
                // });
                if (rows[0].isEmailVerified == 1) {
                  if (rows[0].isReferralEntered == 1) {
                    appData.error = 0;
                    appData["data"] = rows;
                    res.header("Access-Control-Allow-Origin");
                    res.status(200).json(appData);
                    console.log(rows);
                  } else {
                    appData.error = 5;
                    appData["data"] = rows;
                    res.status(200).json(appData);
                    console.log(appData.data);
                  }
                } else {
                  appData.error = 3;
                  appData["data"] = "Not verified email";
                  res.status(200).json(appData);
                  console.log(appData.data);
                }
              } else {
                appData.error = 4;
                appData["data"] = "Password do not match";

                res.status(200).json(appData);
                console.log("rows in else block", rows);
              }
            } else {
              appData.error = 2;
              appData["data"] = "Email does not exists!";
              res.status(204).json(appData);
              console.log(rows);
            }
            console.log(appData);
          }
        }
      );
      connection.release();
    }
  });
});

users.get("/verify-email/:email", function (req, res) {
  //   var today = new Date();
  //   var isEmailVerified = 1;
  console.log("ooper");
  var appData = {
    error: 1,
    data: "",
  };
  console.log("neeche");
  // const userID = 2;
  // const email = req.body.email;

  database.connection.getConnection(function (err, connection) {
    // console.log(userData);
    if (err) {
      console.log("in error");
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
      console.log(appData);
    } else {
      console.log("HERE");
      connection.query(
        "UPDATE user SET isEmailVerified=1 WHERE email=?",
        [req.params.email],
        function (err, rows, fields) {
          if (!err) {
            console.log("in first");
            appData.error = 0;
            appData["data"] = "Row updated!";
            res.status(201).json(appData);
            console.log(appData);
          } else {
            console.log("in second");
            appData["data"] = "Error Occured!";
            res.status(400).json(appData);
            console.log(err);
          }
        }
      );
      connection.release();
    }
  });
});
users.get("/getName", function (req, res) {
  var appData = {};
  console.log("sdaaaaaaaaa");
  // var emailID = req.body.emailID;
  database.connection.getConnection(function (err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      console.log("sdaaaaaaaaa");
      res.status(500).json(appData);
    } else {
      connection.query("SELECT * FROM roles", [], function (err, rows, fields) {
        if (!err) {
          appData["error"] = 0;
          appData["data"] = rows;
          res.status(200).json(appData);
          console.log(rows);
        } else {
          appData["data"] = "No data found";
          res.status(204).json(appData);
          console.log(err);
          console.log(res);
        }
      });
      connection.release();
    }
  });
});

module.exports = users;
