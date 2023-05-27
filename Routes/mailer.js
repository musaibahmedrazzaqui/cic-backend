const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
var mailer = express.Router();
var database = require("../Database/database");
var cors = require("cors");
const { query } = require("express");

mailer.use(cors());
mailer.use(bodyParser.json());
// mailer.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pmifyp@gmail.com",
    pass: "zhdlzpsjqbdajagc",
  },
  from: "pmifyp@gmail.com",
});
setInterval(() => {
  const query = `SELECT * FROM passengerrides join user on user.userID=passengerrides.userID WHERE TIMESTAMPDIFF(MINUTE, createdAt, NOW()) > 5 and passengerrides.idpassengerrides NOT IN (Select idpassengerrides from ridereqpassenger)`;
  database.connection.getConnection(function (err, connection) {
    connection.query(query, (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        const deleteQuery = `DELETE FROM passengerrides WHERE TIMESTAMPDIFF(MINUTE, createdAt, NOW()) > 5 and passengerrides.idpassengerrides NOT IN (Select idpassengerrides from ridereqpassenger) `;
        connection.query(deleteQuery, (err, result) => {
          if (err) throw err;
          console.log(`Deleted ${result.affectedRows} rows`);
          results.forEach((entry) => {
            const mailOptions = {
              from: "Pool Me In Platform <pmifyp@gmail.com>",
              to: entry.emailID,
              subject: "POOL ME IN-Your request has been deleted",
              html: `<p style="font-size: 16px;">Hello, ${entry.firstName},</p>
                 <p style="font-size: 16px;">Your request has been deleted because no driver accepted it within five minutes. You can always try our Take a Ride option which enables YOU to request a ride on driver created rides!</p> <p style="font-size: 16px;">Thankyou for using our platform</p>`,
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) throw err;
              console.log(`Email sent to ${entry.emailID}: ${info.response}`);
            });
            console.log("Entry", entry);
          });
        });
      } else {
        console.log("No entries to delete");
      }
    });
  });
}, 300000);

mailer.post("/send-email-referral", (req, res) => {
  const FromUserID = req.body.FromUserID;
  const ToUserEmail = req.body.ToUserEmail;
  const referralCode = req.body.referralCode;
  let userName;
  let lastName;
  let emailID;
  console.log("HI");
  console.log(FromUserID);
  // console.log(req.body);
  try {
    let url = `https://pmi-backend-production.up.railway.app/rides/getName/${FromUserID}`;
    console.log(url);
    axios.get(url).then((res) => {
      userName = res.data.data[0].firstName;
      lastName = res.data.data[0].lastName;
      emailID = res.data.data[0].emailID;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "pmifyp@gmail.com",
          pass: "zhdlzpsjqbdajagc",
        },
        from: "pmifyp@gmail.com",
      });

      const mailOptions = {
        from: "POOL ME IN PLATFORM <pmifyp@gmail.com>",
        to: ToUserEmail,
        subject: "Recieved a Referral Code! - Pool Me In Platform",
        html: `
    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; margin-bottom: 20px;">
      Dear user,
    </p>

    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; margin-bottom: 20px;">
      You have received a referral code from <strong>${userName.toUpperCase()} ${lastName.toUpperCase()}</strong> bearing email <strong>${emailID}</strong>.
    </p>

    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; margin-bottom: 20px;">
      Please enter <strong>${referralCode}</strong> after you register on our app to start using the Pool Me In Platform.
    </p>

    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; margin-bottom: 20px;">
      Note: We require referrals to allow users to use our app!
    </p>
  `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res
            .status(500)
            .send({ message: "Error occurred while sending email." });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send({ message: "Email sent successfully!" });
        }
      });
    });
    // res.json(response.data);
    // console.log("RES", response);
    // userName = res.firstName;
    // lastName = res.lastName;
    // emailID = res.emailID;
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from API");
  }
});
mailer.post("/send-email", (req, res) => {
  const email = req.body.email;
  console.log("HI");
  // console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pmifyp@gmail.com",
      pass: "zhdlzpsjqbdajagc",
    },
    from: "pmifyp@gmail.com",
  });
  // console.log(id);
  const mailOptions = {
    from: "Pool Me In Platform <pmifyp@gmail.com>",
    to: email,
    subject: "Email verification -POOL ME IN!",
    html: `
    <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #0077b6; font-size: 28px; margin-bottom: 30px;">Verify your email address</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #4d4d4d;">Dear user,</p>
      <p style="font-size: 16px; line-height: 1.5; color: #4d4d4d;">Thank you for signing up with POOL ME IN!</p>
      <p style="font-size: 16px; line-height: 1.5; color: #4d4d4d;">To complete your registration, please verify your email address by clicking the link below:</p>
      <div style="background-color: #0077b6; padding: 10px 20px; display: inline-block; margin: 20px 0;">
        <a href="https://pmi-backend-production.up.railway.app/rides/verify-email/${email}" style="color: #fff; text-decoration: none; font-size: 16px;">Verify Email</a>
      </div>
      <p style="font-size: 16px; line-height: 1.5; color: #4d4d4d;">Thank you,</p>
      <p style="font-size: 16px; line-height: 1.5; color: #4d4d4d;">The POOL ME IN Team</p>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ message: "Error occurred while sending email." });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({ message: "Email sent successfully!" });
    }
  });
});
mailer.post("/send-email-ride", (req, res) => {
  const email = req.body.email;
  console.log("body", req.body);
  const driverid = req.body.driverid;
  var driveremail;
  var appData = {};
  database.connection.getConnection(function (err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
    } else {
      var query = `Select * from user where userID=${driverid}`;
      connection.query(query, function (err, rows, fields) {
        if (!err) {
          console.log("Rows", rows);
          appData["error"] = 0;
          appData["data"] = rows;
          // driveremail = rows.emailID;
          res.status(200).json(appData);
          // console.log(appData.data);
        } else {
          appData["error"] = 1;
          appData["data"] = "No data found";
          res.status(204).json(appData);
          console.log(err);
          // console.log(res);
        }
      });
      connection.release();
    }
  });
  console.log(appData.data);
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "pmifyp@gmail.com",
  //     pass: "zhdlzpsjqbdajagc",
  //   },
  // });
  // console.log(id);
  // const mailOptions = {
  //   from: "your_gmail_username",
  //   to: email,
  //   subject: "Email verification",
  //   html:
  //     '<p>Click<a href="https://pmi-backend-production.up.railway.app/rides/verify-email/' +
  //     email +
  //     '">here</a> to verify your email on the POOL ME IN PLATFORM.</p>',
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send({ message: "Error occurred while sending email." });
  //   } else {
  //     console.log("Email sent: " + info.response);
  //     res.status(200).send({ message: "Email sent successfully!" });
  //   }
  // });
});
module.exports = mailer;
