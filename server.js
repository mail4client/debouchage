// server.js (Node.js + Express Backend for Stripe Checkout + Contact Email)

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')('sk_test_51RHi4lSD9MXPIidLGZIyyvbQOmUZc9BWrVNRon8ZzXEomfXkgIMhYb4zlTGzhQ23UvhzcLiwJuI5xxRDhlVCv6jS00Ngmsx6L0');
const nodemailer = require('nodemailer');

// Middlewares
app.use(cors({
  origin: "https://www.dbdor.com",
  methods: ["GET", "POST"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve HTML/CSS/JS files

// Stripe Routes
app.get("/", (req, res) => {
  res.send("Stripe backend is running!");
});

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
          currency: "cad",
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

// Contact Form Email Endpoint
app.post('/index', async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ success: false, message: 'Missing reCAPTCHA token.' });
  }

  try {
    // Verify reCAPTCHA with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPTCHA_SECRET);
    params.append('response', recaptchaToken);

    const recaptchaRes = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ success: false, message: 'Failed reCAPTCHA validation.' });
    }

    // Send email if reCAPTCHA passes
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.MAIL_TO,
      subject: `Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error("Error in /contact:", error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
