const express = require('express');
   const crypto = require('crypto');
   const app = express();
   const bodyParser = require('body-parser');

   app.use(bodyParser.json());

   const MERCHANT_ID = "SU2504251824455203498132";
   const SALT_KEY = "a09c0d23-4a54-4a62-babc-dc67cd587a74";
   const SALT_INDEX = 1;

   // Payment initiation endpoint
   app.post('/initiate-payment', (req, res) => {
       const { productId, amount } = req.body;
       
       const transactionId = 'TXN' + Date.now();
       const payload = {
           merchantId: MERCHANT_ID,
           merchantTransactionId: transactionId,
           merchantUserId: 'USER' + Math.floor(Math.random() * 1000000),
           amount: amount * 100, // in paise
           redirectUrl: `https://yourdomain.com/payment-callback`,
           redirectMode: "POST",
           callbackUrl: `https://yourdomain.com/payment-callback`,
           paymentInstrument: { type: "PAY_PAGE" }
       };
       
       const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
       const checksum = crypto.createHash('sha256')
                           .update(base64Payload + '/pg/v1/pay' + SALT_KEY)
                           .digest('hex') + '###' + SALT_INDEX;
       
       res.json({
           success: true,
           data: base64Payload,
           checksum: checksum,
           merchantId: MERCHANT_ID
       });
   });

   // Callback verification endpoint
   app.post('/payment-callback', (req, res) => {
       // Verify the callback here
       console.log('Payment callback:', req.body);
       res.status(200).send('OK');
   });

   app.listen(3000, () => console.log('Server running on port 3000'));