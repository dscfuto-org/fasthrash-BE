const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const apiResponse = require('./helpers/apiResponse');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();
const helmet = require('helmet');
const xss = require('xss-clean');
const crypto = require('crypto');

// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to %s', MONGODB_URL);
      console.log('App is running ... \n');
      console.log('Press CTRL + C to stop the process. \n');
    }
  })
  .catch((err) => {
    console.error('App starting error:', err.message);
    process.exit(1);
  });

const db = mongoose.connection; //eslint-disable-line no-unused-vars

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//To allow cross-origin requests
app.use(cors());

// Security middlewares
app.use(helmet());
app.use(xss());

// Sets the `script-src` directive to "'self' 'nonce-e33ccde670f149c1789b1e1e113b0916'" (or similar)
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: [(req, res) => `'nonce-${res.locals.cspNonce}'`],
    },
  })
);

// setting view engine as ejs
app.set('view engine', 'ejs');

//Route Prefixes
app.use('/', indexRouter);
app.use('/api/', apiRouter);

// api documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// user/collector and organization makeshift reset password routes
app.get('/resetpassword/:userID/:token/:tokenID', (req, res) => {
  res.render('./resetPassword', { cspNonce: res.locals.cspNonce });
});
app.get('/org/resetpassword/:userID/:token/:tokenID', (req, res) => {
  res.render('resetPassword', { cspNonce: res.locals.cspNonce });
});

// throw 404 if URL not found
app.all('*', function (req, res) {
  return apiResponse.notFoundResponse(res, 'Page not found');
});

app.use((err, req, res) => {
  if (err.name == 'UnauthorizedError') {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

console.log(
  `%c
      ------------------
      < Happy Hacking! >
      ------------------
              \\   ^__^
               \\  (oo)\\_______
                  (__)\\       )\\/\\
                      ||----w |
                      ||     ||`,
  'font-family:monospace'
);

// eslint-disable-next-line no-unused-vars
app.listen(process.env.PORT, (req, res) => {
  console.log(`Server listening on PORT: ${process.env.PORT}`);
});

module.exports = app;
