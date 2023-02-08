const express = require('express');
const authRouter = require('./auth');
const userAlertRouter = require('./alert-collector');
const collectorAlertRouter = require('./alert-org');
const imageUploadRouter = require('./upload');

const app = express();

app.use('/', imageUploadRouter);
app.use('/auth/', authRouter);
app.use('/alerts/', userAlertRouter);
app.use('/org/alerts/', collectorAlertRouter);

module.exports = app;
