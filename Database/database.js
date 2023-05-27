var mysql = require("mysql");

var connection = mysql.createPool({
  connectionLimit: 100,
  host: "pmifyp.cmo3hj1bmcvt.ap-northeast-1.rds.amazonaws.com",
  user: "admin",
  password: "dasrttsds",
  database: "cic",
  port: 3306,
});
// var connection = mysql.createPool({
//   connectionLimit: 100,
//   host: "localhost",
//   user: "root",
//   password: "iloveallah",
//   database: "fyp",
//   port: 3306,
// });
module.exports.connection = connection;
