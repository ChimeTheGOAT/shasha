const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();
const path = require('path');
const CryptoConvert = require("crypto-convert").default;

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

app.set('views', [ path.join(__dirname, 'views'),
  path.join(__dirname, 'views/dashboard/deposit'),
  path.join(__dirname, 'views/dashboard/investment'),
  path.join(__dirname, 'views/dashboard/investment/history'),
  path.join(__dirname, 'views/dashboard/investment/transactions'),
  path.join(__dirname, 'views/dashboard/profile'),
  path.join(__dirname, 'views/dashboard/transaction'),
  path.join(__dirname, 'views/dashboard/transactions'),
  path.join(__dirname, 'views/dashboard/transactio'),
  path.join(__dirname, 'views/frontend'),
  path.join(__dirname, 'views/frontend/staking'),
  path.join(__dirname, 'views/frontend/supported-chains'),
]);

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


const convert = new CryptoConvert({
	cryptoInterval: 30000, //Crypto prices update interval in ms (default 5 seconds on Node.js & 15 seconds on Browsers)
	calculateAverage: true, //Calculate the average crypto price from exchanges
	binance: true, //Use binance rates
	bitfinex: true, //Use bitfinex rates
	coinbase: true, //Use coinbase rates
	kraken: true, //Use kraken rates //Callback on every crypto update
	HTTPAgent: null //HTTP Agent for server-side proxies (Node.js only)
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/staking", (req, res) => {
  res.render("staking");
});

app.get("/supported-chains", (req, res) => {
  res.render("supported-chains");
});
app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});
app.get("/staking/basic-plan", (req, res) => {
  res.render("staking/basic-plan");
});
app.get("/staking/premium-plan", (req, res) => {
  res.render("staking/premium-plan");
});
app.get("/staking/professional-plan", (req, res) => {
  res.render("staking/professional-plan");
});
app.get("/supported-chains/binance-smart-chain", (req, res) => {
  res.render("supported-chains/binance-smart-chain");
});
app.get("/supported-chains/bitcoin", (req, res) => {
  res.render("supported-chains/bitcoin");
});
app.get("/supported-chains/chainlink", (req, res) => {
  res.render("supported-chains/chainlink");
});
app.get("/supported-chains/dai", (req, res) => {
  res.render("supported-chains/dai");
});
app.get("/supported-chains/ethereum", (req, res) => {
  res.render("supported-chains/ethereum");
});
app.get("/supported-chains/litecoin", (req, res) => {
  res.render("supported-chains/litecoin");
});
app.get("/supported-chains/ripple", (req, res) => {
  res.render("supported-chains/ripple");
});
app.get("/supported-chains/solana", (req, res) => {
  res.render("supported-chains/solana");
});
app.get("/supported-chains/tether", (req, res) => {
  res.render("supported-chains/tether");
});
app.get("/user/dashboard", (req, res) => {
  res.render("dashboard/dashboard");
});

app.get("/user/referrals", (req, res) => {
  const referral_link = "09908789"
  res.render("dashboard/referrals", 
  { 
    referral_link
  });
});
app.get("/user/withdraw", (req, res) => {
  res.render("dashboard/withdraw");
});
app.get("/user/transactions", (req, res) => {
  res.render("dashboard/transactions");
});    
app.get("/user/terms-and-condition", (req, res) => {
  res.render("dashboard/terms-and-condition");
});
app.get("/user/withdraw-newwallet", (req, res) => {
  res.render("dashboard/withdraw-newwallet");
});
app.get("/user/congratulation", (req, res) => {
  res.render("dashboard/congratulation");
});
app.get("/user/404", (req, res) => {
  res.render("dashboard/404");
});
app.get("/user/withdraw-newwallet", (req, res) => {
  res.render("dashboard/withdraw-newwallet");
});
app.get("/user/newuserdash", (req, res) => {
  res.render("dashboard/newuserdash");
});
app.get("/user/welcome", (req, res) => {
  res.render("dashboard/welcome");
});
app.get("/user/contact-us", (req, res) => {
  res.render("dashboard/contact-us");
});
app.get("/user/deposit", (req, res) => {
  res.render("dashboard/deposit");
});
app.get("/user/faqs", (req, res) => {
  res.render("dashboard/faqs");
});
app.get("/user/invest", (req, res) => {
  res.render("dashboard/invest");
});
app.get("/user/investment", (req, res) => {
  res.render("dashboard/investment");
});
app.get("/user/privacy-policy", (req, res) => {
  res.render("dashboard/privacy-policy");
});
app.get("/user/profile", (req, res) => { 
  res.render("dashboard/profile");
}); 
app.get("/user/refferrals", (req, res) => {
  res.render("dashboard/refferrals");
});
app.get("/user/transactions", (req, res) => {
  res.render("dashboard/transactions");
});
app.get("/user/deposit/confirm-payment", (req, res) => {
  res.render("dashboard/deposit/confirm-payment");
});
app.get("/user/deposit/preview", checkRoute, async (req, res) => {
  await convert.ready();  
  const amount = req.session.amount;
  const currency = req.session.network;
  let nativeAmount = [];
  let exchangeRate = [];
  


  if (currency === "BTC") {
    const btc = convert.USD.BTC(amount).toFixed(4);
    const baseBtc = convert.BTC.USD(1);
    nativeAmount.push(btc);
    exchangeRate.push(baseBtc);
    

  } else if (currency === "ETH") {
    const eth = convert.USD.ETH(amount).toFixed(4);
    const baseEth = convert.ETH.USD(1);
    nativeAmount.push(eth);
    exchangeRate.push(baseEth);
    

  } else if (currency === "BNB") {
    const bnb = convert.USD.BNB(amount).toFixed(4);
    const baseBnB = convert.BNB.USD(1);
    nativeAmount.push(bnb);
    exchangeRate.push(baseBnB);
    

  }
  else if (currency === "LTC") {
    const ltc = convert.USD.LTC(amount).toFixed(4);
    const baseLtc = convert.LTC.USD(1);
    nativeAmount.push(ltc);
    exchangeRate.push(baseLtc);
    


  }
  else if (currency === "SOL") {
    const sol = convert.USD.SOL(amount).toFixed(4);
    const baseSol = convert.SOL.USD(1);
    nativeAmount.push(sol);
    exchangeRate.push(baseSol);
    


  }
  else if (currency === "XRP") {
    const xrp = convert.USD.XRP(amount).toFixed(4);
    const baseXrp = convert.XRP.USD(1);
    nativeAmount.push(xrp);
    exchangeRate.push(baseXrp);
    


  }
  else if (currency === "DAI") {
    const dai = convert.USD.DAI(amount).toFixed(4);
    const baseDai = convert.DAI.USD(1);
    nativeAmount.push(dai);
    exchangeRate.push(baseDai);
    


  }

  else if (currency === "LINK") { 
    const link = convert.USD.LINK(amount).toFixed(4);
    const baseLink = convert.LINK.USD(1);
    nativeAmount.push(link);
    exchangeRate.push(baseLink);
    


  }
  else if (currency === "USDT") {
    nativeAmount.push(amount);
    exchangeRate.push("1");
    

  }
  else if (currency === "USDC (ERC20)") {
    nativeAmount.push(amount);
    exchangeRate.push("1");
    

  } else if (currency === "USDC (SLP)") {
    nativeAmount.push(amount);
    exchangeRate.push("1");
    

  }


  res.render("dashboard/deposit/preview", {
    amount , currency , nativeAmount, exchangeRate

  });
});

app.get("/user/dashboard", checkAuthenticated, (req, res) => {
    res.render("dashboard");
  });
  app.get("/user/deposit/success", checkAuthenticated, (req, res) => {
    res.render("dashboard/deposit/success");
  });
  app.get("/user/investment/history/active", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/history/active");
  });
  app.get("/user/investment/history/completed", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/history/completed");
  });
  app.get("/user/investment/history/pending", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/history/pending");
  });
  app.get("/user/investment/transactions/profit", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/transactions/profit");
  });
  app.get("/user/investment/transactions/transfer", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/transactions/transfer");
  });
  app.get("/user/investment/basic-plan", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/basic-plan");
  });
  app.get("/user/investment/history", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/history");
  });
  app.get("/user/investment/transactions", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/transactions");
  });
  app.get("/user/investment/plans", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/plans");
  });
  app.get("/user/investment/IV006SJP", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/IV006SJP");
  });
  app.get("/user/investment/premium-plan", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/premium-plan");
  });
  app.get("/user/investment/pro-plan", checkAuthenticated, (req, res) => {
    res.render("dashboard/investment/pro-plan");
  }); 
  app.get("/user/profile/accounts", checkAuthenticated, (req, res) => {
    res.render("dashboard/profile/accounts");
  });
  app.get("/user/profile/accounts", checkAuthenticated, (req, res) => {
    res.render("dashboard/profile/accounts");
  });
  
  app.get("/user/profile/security", checkAuthenticated, (req, res) => {
    res.render("dashboard/profile/security");
  });
  app.get("/user/profile/settings", checkAuthenticated, (req, res) => {
    res.render("dashboard/profile/settings");
  });  
  app.get("/user/transaction/cancel", checkAuthenticated, (req, res) => {
    res.render("dashboard/transaction/cancel");
  });
  app.get("/user/transaction/maximum-limit", checkAuthenticated, (req, res) => {
    res.render("dashboard/transaction/maximum-limit");
  });
  app.get("/user/transactions/deposit", checkAuthenticated, (req, res) => {
    res.render("dashboard/transactions/deposit");
  });
  app.get("/user/transactions/scheduled", checkAuthenticated, (req, res) => {
    res.render("dashboard/transactions/scheduled");
  });
  app.get("/user/transactions/withdraw", checkAuthenticated, (req, res) => {
    res.render("dashboard/transactions/withdraw");
  });
  app.get("/user/", checkAuthenticated, (req, res) => {
    res.render("dashboard/dashboard");
  });

  // app.get("/user/invest/preview", checkAuthenticated, (req, res) => {
  //   res.render("dashboard/invest/preview");
  // });

  app.get("/user/invest/transaction-complete", checkAuthenticated, (req, res) => {
    const amount = req.session.amount;
    const plan = req.session.plan;
    res.render("dashboard/invest/transaction-complete",);
  });


  app.get("/forgot-password", checkAuthenticated, (req, res) => {
    res.render("forgot-password");
  });  

 
app.get("/register", checkAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/hello", (req, res) =>{
  res.render("hello")
} )

app.get("/login", checkAuthenticated, (req, res) => {   
  res.render("login");
});

app.get("/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("dashboard", { user: req.user.name });
});
 
app.get("/user/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

app.post("/user/profile/personal", (req, res) => {
  const firstName = req.body.first_name; 
  const lastName = req.body.last_name;
  const phone_no = req.body.phone;
  const  gender = req.body.gender;
  const date_of_birth = req.body.date_of_birth;
  
  console.log(req.body);
  res.render('dashboard/profile');

});

app.post("/user/invest/transaction", (req, res) => {
  const plan = req.body.plan;
  const amount = req.body.amount;
  console.log(req.body);
  res.render('dashboard/invest/transaction-complete', {plan , amount})
}) 

app.post("/user/profile/unverified-email", (req, res) => {
  
});

app.post("/user/profile/settings/email/resend", (req, res) => {
  console.log('hello');

});

app.post("/user/profile/settings/email/cancel", (req, res) => {
  console.log('nooooo');
});

app

app.post("/user/profile/settings/email", (req, res) => {
  const current_email = req.body.current_email;
  const new_email = req.body.new_email;
  const password = req.body.password;

  console.log(req.body);

  res.render('dashboard/profile/settings')

});

app.post("/user/profile/settings/password", (req, res) => {
  const password = req.body.password;
  const password1 = req.body.new_password;
  const password2 = req.body.confirm_new_password
  console.log(req.body);
  // res.render('dashboard/profile/settings');

});

app.post("/user/invest/preview", (req, res) => {
  const amount = req.body.amount;
  const plan = req.body.plan;
  const profit = req.body.profit;
  const non = profit/100; 
  const profitEarn = amount * non * 30;
  const profNum = parseFloat(profitEarn); 
  const amountNum = parseFloat(amount)
  const totalReturn = profNum + amountNum;
  const sanProfEarn = profitEarn.toFixed(2);
  const sanTotalReturn = totalReturn.toFixed(2);


  
  console.log(
    amount , profit , sanProfEarn, sanTotalReturn, plan)
  res.render('dashboard/invest/preview',{
    amount , profit , sanProfEarn, sanTotalReturn, plan});

})



app.post("/user/profile/wallet", (req, res) => {
  const currency = req.body.currency; 
  const wallet = req.body.wallet_address;
  const label = req.body.label;
  console.log(req.body);
  res.render('dashboard/profile/accounts');

})

app.post("/user/deposit", (req, res) => {
  let {amount, network} = req.body;
   req.session.amount = req.body.amount;
   req.session.network = req.body.network;
   
   res.redirect('/user/deposit/preview');
});

// app.post("/user/deposit/preview", (req, res) => {

//   req.redirect('/user/deposit/confirm-payment')

// });


app.post("/user/deposit/invoice", (req, res) => {
  

});


app.post("/user/deposit/confirm-payment", (req, res) => {
  const network = req.session.network;
  const amount = req.session.amount;
  const nativeAmount = req.body.nativeAmount;
  const tnx = Math.floor(100000 + Math.random()*999999);
  let qr = [];
  let wallet = [];
  let walletAddress = [];

  if (network === "BTC") {
    qr.push("/dashboard/images/btc.png")
    wallet.push("BITCOIN")
    walletAddress.push("bc1qx485c6e3zf0e38pnszdcuwhkz5y4qnegwhskfh")

  } else if (network === "ETH") {
    qr.push("/dashboard/images/eth.png")
    wallet.push("ETHEREUM")
    walletAddress.push("0x97cCd395F54754180fFF15107BEFBf2bd4d482B4")

  } else if (network === "BNB") {
    qr.push("/dashboard/images/eth.png")
    wallet.push("BINANCE COIN")
    walletAddress.push("0x97cCd395F54754180fFF15107BEFBf2bd4d482B4")

  } else if (network === "LTC") {
    qr.push("/dashboard/images/ltc.png")
    wallet.push("LITE COIN")
    walletAddress.push("ltc1q3aylfggmsnvds7mvmu5jy6k5kctk9hyl4xns6n")

  } else if (network === "SOL") {
    qr.push("/dashboard/images/sol.png")
    wallet.push("SOLANA")
    walletAddress.push("DpHkJRJwyzVHoXExK8RVTj8cUsTJU3MvAvAjM4ajfEpX")

  } else if (network === "XRP") {
    qr.push("/dashboard/images/xrp.png")
    wallet.push("RIPPLE")
    walletAddress.push("rPKHar19V5BK6cZr9Ze38drc645m9sCGPs")

  } else if (network === "DAI") {
    qr.push("/dashboard/images/eth.png")
    wallet.push("DAI")
    walletAddress.push("0x97cCd395F54754180fFF15107BEFBf2bd4d482B4")

  } else if (network === "LINK") {
    qr.push("/dashboard/images/eth.png")
    wallet.push("CHAINLINK")
    walletAddress.push("0x97cCd395F54754180fFF15107BEFBf2bd4d482B4")

  } else if (network === "USDT") {
    qr.push("/dashboard/images/usdt.png")
    wallet.push("USDT")
    walletAddress.push("TVaMhTfFDuMwfMFBPF3weWMMzYXmeZBYwx")

  } else if (network === "USDC (ERC20)"){
    qr.push("/dashboard/images/eth.png")
    wallet.push("USDC (ERC 20)")
    walletAddress.push("0x97cCd395F54754180fFF15107BEFBf2bd4d482B4")

  } else if (network === "USDC (SLP)"){
    qr.push("/dashboard/images/sol.png")
    wallet.push("USDC (SLP)")
    walletAddress.push("DpHkJRJwyzVHoXExK8RVTj8cUsTJU3MvAvAjM4ajfEpX")
  }


  console.log("body",req.body);
  console.log("session", req.session);
  console.log(tnx);
  res.render('dashboard/deposit/confirm-payment', {
    amount , network, nativeAmount, tnx, qr, wallet , walletAddress
  });
  
}); 

app.post("/user/profile/address", (req, res) => {
  const address1 = req.body.address_line_1;
  const address2 = req.body.address_line_2;
  const city = req.body.city;
  const state_province = req.body.state_province;
  const zip_postal_code = req.body.zip_postal_code;
  const country = req.body.country;
  console.log(req.body);
  res.render('dashboard/profile')
});


app.post("/user/submit-form", (req, res) => {
  let {subject, message} = req.body;
  const mailSubject = req.body.subject;
  const mailMessage = req.body.message;
  console.log(req.body)

  async function sendForm() {
  const mail = await transporter.sendMail({
    from: '"Evastaking" <info@evastaking.com>', // sender address
    to: "admin@evastaking.com",
    subject: mailSubject, // Subject line
    html: mailMessage
  });

  console.log("message sent: %s", mail)
}

sendForm().catch(console.error);

});



app.post("/register", async (req, res) => {
  let { first_name, last_name, email, password, confirm_password, country, country_code, phone } = req.body;

  let errors = []; 

  console.log({
    first_name, last_name, email, password, confirm_password, country, country_code, phone
  });

  if ( !first_name || !last_name || !email || !password || !confirm_password || !country || !country_code || !phone) {
    errors.push({ message: "Please enter all fields" });    
  }
 
  if (password.length < 8) {
    errors.push({ message: "Password must be a least 8 characters long" });
  }

  if (password !== confirm_password) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, first_name, last_name, email, password, confirm_password, country, country_code, phone });
  } 
  else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    
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
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [first_name, last_name, email, password, country, country_code, phone],
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
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


function checkRoute(req, res, next){
  const route = req.get('Referrer');

  if (route && route.includes('/user/deposit')) {
    next();
  } else {
    res.redirect('/user/deposit');
  }
};




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});