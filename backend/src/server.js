
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tenderRoutes = require('./routes/tenders');
const bidRoutes = require('./routes/bids');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tenders', tenderRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Tender Management Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});