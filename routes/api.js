const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./userRoutes');

const app = express();

app.use('/auth/', authRouter);
app.use('/alerts/', userRouter);

module.exports = app;
