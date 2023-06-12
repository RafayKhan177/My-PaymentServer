import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send(
    "Hello, world! Oh My! Server is live, Client Site live on: 'https://leigonsoft.site'"
  );
});

// SSL credentials
const ssl_merchant_id = "0023024";
const ssl_user_id = "apiuser";
const ssl_pin =
  "KABX047M4VXOEV2U3JS7X7J5BZB6LQZSKFFFORJWM1JDAP1W6WWN9WOVAM3LV7FP";

app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://leigonsoft.site",
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.options("/create-payment-session", cors());

app.post("/create-payment-session", async (req, res) => {
  try {
    const orderData = {
      total: {
        amount: req.body.amount,
        currencyCode: "EUR",
      },
      description: "Product purchase",
    };

    const orderResponse = await axios.post(
      "https://api.eu.convergepay.com/orders",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${ssl_pin}`,
          merchant_id: ssl_merchant_id,
          user_id: ssl_user_id,
        },
      }
    );

    const orderUrl = orderResponse.data.href;

    const paymentSessionData = {
      order: orderUrl,
      returnUrl: "https://leigonsoft.site/return",
      cancelUrl: "https://leigonsoft.site/cancel",
      doCreateTransaction: true,
    };

    const paymentSessionResponse = await axios.post(
      "https://api.convergepay.com/payment-sessions",
      paymentSessionData,
      {
        headers: {
          Authorization: `Bearer ${ssl_pin}`,
          merchant_id: ssl_merchant_id,
          user_id: ssl_user_id,
        },
      }
    );

    const paymentSessionUrl = paymentSessionResponse.data.href;

    // Set CORS headers explicitly
    res.setHeader("Access-Control-Allow-Origin", "https://leigonsoft.site");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Set error response headers
    res.setHeader("WWW-Authenticate", 'Bearer error="invalid_token", error_description="An error occurred while attempting to decode the Jwt: Invalid JWT serialization: Missing dot delimiter(s)", error_uri="https://tools.ietf.org/html/rfc6750#section-3.1"');
    res.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Connection", "close");

    res.json({ paymentUrl: paymentSessionUrl });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
