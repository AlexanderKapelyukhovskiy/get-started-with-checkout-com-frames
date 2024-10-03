require('dotenv').config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());


// Insert your secret key here
const SECRET_KEY = process.env.SECRET_KEY;

app.get('/config', (req, res) => {
  res.json({
    apiKey: process.env.PUBLIC_KEY
  });
});

app.post("/save-card", async (req, res) => {
  const { token } = req.body;  // Destructuring the token from the request body

  console.log('Token:', token);  // Output the token for debugging

  const request = await fetch(
    "https://api.sandbox.checkout.com/instruments",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "token",
        token: token,
        customer: {
          email: "john.smith@example.com",
          name: "John Smith"
        }
      }),
    }
  );
  const instrument = await request.json();
  console.log(instrument)

  // Handle the rest of your save-card logic here

  res.send({result: 'Card saved successfully', token, instrument});  // Send a response back to the client
});


app.listen(3000, () =>
  console.log("Node server listening on port 3000: http://localhost:3000/")
);