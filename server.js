  import express from "express";
  import axios from "axios";
  import bodyParser from "body-parser";

  const app = express();
  const port = 4000;

  // server is live on url: https://panel.leigonsoft.site/

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://leigonsoft.site");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.options("/create-payment-session", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://leigonsoft.site");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
  });

  app.post("/create-payment-session", async (req, res) => {
    try {
      const clientIP = req.ip;

      console.log("Client IP:", clientIP);

      const orderData = {
        total: {
          amount: req.body.amount,
          currencyCode: "EUR",
        },
        description: "parts",
      };

      const ssl_merchant_id = "0023024";
      const ssl_user_id = "apiuser";
      const ssl_pin =
        "KABX047M4VXOEV2U3JS7X7J5BZB6LQZSKFFFORJWM1JDAP1W6WWN9WOVAM3LV7FP";

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
        "https://api.eu.convergepay.com/payment-sessions",
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

      const paymentSessionUrls = {
        lightboxUrl: paymentSessionUrl,
        returnUrl: "https://leigonsoft.site/return",
        cancelUrl: "https://leigonsoft.site/cancel",
      };

      res.setHeader(
        "Access-Control-Allow-Origin",
        "https://leigonsoft.site"
      );
      res.setHeader("Access-Control-Allow-Methods", "POST");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      res.json(paymentSessionUrls);
    } catch (error) {
      console.error("Error creating payment session:", error);
      res.status(500).json({ error: "Failed to create payment session" });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
