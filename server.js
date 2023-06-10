// Import dependencies
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Create an Express app
const app = express();
const port = 4000; // Change as needed

// Middleware
app.use(bodyParser.json());

// Set up CORS headers middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Add this line
  next();
});

app.options("/create-payment-session", (req, res) => {
  // Set CORS headers for preflight request
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.post("/create-payment-session", async (req, res) => {
  try {
    const clientIP = req.ip;

    // Log the client's IP address
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
          ssl_merchant_id,
          ssl_user_id,
        },
      }
    );
    const orderUrl = orderResponse.data.href;

    const paymentSessionData = {
      order: orderUrl,
      returnUrl: "https://merchant.com/return",
      cancelUrl: "https://merchant.com/cancel",
      doCreateTransaction: true,
    };

    const paymentSessionResponse = await axios.post(
      "https://api.eu.convergepay.com/payment-sessions",
      paymentSessionData,
      {
        headers: {
          Authorization: `Bearer ${ssl_pin}`,
          ssl_merchant_id,
          ssl_user_id,
        },
      }
    );
    const paymentSessionUrl = paymentSessionResponse.data.href;

    const paymentSessionUrls = {
      lightboxUrl: paymentSessionUrl,
      returnUrl: "https://merchant.com/return",
      cancelUrl: "https://merchant.com/cancel",
    };

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.json(paymentSessionUrls);
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// // Import dependencies
// import express from "express";
// import axios from "axios";
// import bodyParser from "body-parser";

// // Create an Express app
// const app = express();
// const port = 4000; // Change as needed

// // Middleware
// app.use(bodyParser.json());

// // Set up CORS headers middleware
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true"); // Add this line
//   next();
// });

// app.options("/create-payment-session", (req, res) => {
//   // Set CORS headers for preflight request
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(200);
// });

// app.post("/create-payment-session", async (req, res) => {
//   try {
//     const clientIP = req.ip;

//     // Log the client's IP address
//     console.log("Client IP:", clientIP);

//     const orderData = {
//       total: {
//         amount: req.body.amount,
//         currencyCode: "EUR",
//       },
//       description: "parts",
//     };

//     const ssl_merchant_id = "0023024";
//     const ssl_user_id = "apiuser";
//     const ssl_pin =
//       "KABX047M4VXOEV2U3JS7X7J5BZB6LQZSKFFFORJWM1JDAP1W6WWN9WOVAM3LV7FP";

//       const orderResponse = await axios.post(
//         "https://api.eu.convergepay.com/orders",
//         orderData,
//         {
//           headers: {
//             Authorization: `Bearer ${ssl_pin}`,
//             ssl_merchant_id,
//             ssl_user_id,
//           },
//         }
//       );
//     const orderUrl = orderResponse.data.href;

//     const paymentSessionResponse = await axios.post(
//       "https://api.eu.convergepay.com/payment-sessions",
//       paymentSessionData,
//       {
//         headers: {
//           Authorization: `Bearer ${ssl_pin}`,
//           ssl_merchant_id,
//           ssl_user_id,
//         },
//       }
//     );
//     const paymentSessionUrl = paymentSessionResponse.data.href;

//     const paymentSessionUrls = {
//       lightboxUrl: paymentSessionUrl,
//       returnUrl: "https://merchant.com/return",
//       cancelUrl: "https://merchant.com/cancel",
//     };

//     // Set CORS headers
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.setHeader("Access-Control-Allow-Methods", "POST");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     res.setHeader("Access-Control-Allow-Credentials", "true");

//     res.json(paymentSessionUrls);
//   } catch (error) {
//     console.error("Error creating payment session:", error);
//     res.status(500).json({ error: "Failed to create payment session" });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
