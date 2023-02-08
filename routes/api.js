const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./alertRoutes');
const orgRoutes = require('./OrgRoutes')
// const imageUploadRouter = require('./upload');

const app = express();

// app.use('/', imageUploadRouter);
app.use('/auth/', authRouter);
app.use('/alerts/', userRouter);
app.use('/organization/',orgRoutes)

module.exports = app;
