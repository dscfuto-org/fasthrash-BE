const express = require('express');
const authRouter = require('./auth');
const userAlertRouter = require('./alert-collector');
const collectorAlertRouter = require('./alert-org');
const imageUploadRouter = require('./upload');
const historyRouter = require('./history');

const app = express();

app.use('/', imageUploadRouter);
app.use('/auth/', authRouter);
app.use('/alerts/', userAlertRouter);
app.use('/org/alerts/', collectorAlertRouter);
app.use('/history', historyRouter);

module.exports = app;
