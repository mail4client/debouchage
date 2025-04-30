// server.js (Node.js + Express Backend for Stripe Checkout)

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')('sk_test_51RHi4lSD9MXPIidLGZIyyvbQOmUZc9BWrVNRon8ZzXEomfXkgIMhYb4zlTGzhQ23UvhzcLiwJuI5xxRDhlVCv6jS00Ngmsx6L0');

// Middlewares
app.use(cors({
  origin: "https://www.dbdor.com",
  methods: ["GET", "POST"],
}));

app.use(express.json());
app.use(express.static('public')); // This will serve HTML files from /public

// Routes
app.get("/", (req, res) => {
  res.send("Stripe backend is running!");
});

// This handles Stripe redirect
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/success.html'));
});

app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/cancel.html'));
});

app.post("/create-checkout-session", async (req, res) => {
  const { amount, plan } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "cad", // or "usd" based on your region
          product_data: {
            name: `${plan} Subscription`
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: "https://debouchagetest.onrender.com/success",
    cancel_url: "https://debouchagetest.onrender.com/cancel",
  });

  res.json({ url: session.url, id: session.id });  
});

// Important: use process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



