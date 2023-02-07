const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./alertRoutes');

const app = express();

app.use('/auth/', authRouter);
app.use('/alerts/', userRouter);

module.exports = app;
