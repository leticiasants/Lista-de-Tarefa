require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./router/auth');

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Servidor na porta 3000');
});