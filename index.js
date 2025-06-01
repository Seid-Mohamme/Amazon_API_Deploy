const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
// After installing the express, cors, dotenv, stripe we add here to initialize
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env)
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success!" });
});

// for payement
app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  if (total > 0) {
    // console.log("request received", total);
    // res.send(total);
    // http://127.0.0.1:5001/clone-d1763/us-central1/api/payment/create?total=300
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });
    console.log(paymentIntent);
    // res.status(201).json(paymentIntent)
    res.status(201).json(
        { clientScret: paymentIntent.client_secret 
            
        });
    // http://localhost:5000/payment/create?total=300  on thunder client
  } else {
    res.status(403).json({ message: "total must be greater than 0" });
  }
});

app.listen(5000, (err) => {
  if (err) {
    console.log("unable to start");
  }
  console.log("Amazon started at 5000, http://localhost:5000");
});

exports.api = onRequest(app);
