const express = require('express');
const authRouter = require('./auth');
const bookRouter = require('./book');

const app = express();

app.use('/auth/', authRouter);
app.use('/book/', bookRouter);

module.exports = app;
