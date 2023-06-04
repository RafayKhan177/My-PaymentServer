import express from 'express';
import axios from 'axios';

const app = express();

app.get('/myip', async (req, res) => {
  const url = 'https://www.convergepay.com/hosted-payments/myip';
  
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.error('Error occurred while fetching IP address:', error);
    res.status(500).send('Error occurred while fetching IP address.');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
