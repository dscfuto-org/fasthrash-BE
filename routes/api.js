const express = require('express');
const authRouter = require('./auth');

const app = express();

app.use('/auth/', authRouter);

module.exports = app;
