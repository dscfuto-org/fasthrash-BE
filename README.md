# Fasthrash

```
 GDSC FUTO Backend repository for Google Solution Challenge 2023
```

<img src="https://github.com/dscfuto-org/fasthrash-BE/blob/main/assets/branding/Branding-01.png" alt="Fastrash">
<!-- A ready-to-use boilerplate for REST API Development with Node.js, Express, and MongoDB -->

<!-- ## Getting started

This is a basic API skeleton written in JavaScript ES2015. Very useful to building a RESTful web APIs for your front-end platforms like Android, iOS or JavaScript frameworks (Angular, Reactjs, etc).

This project will run on **NodeJs** using **MongoDB** as database. I had tried to maintain the code structure easy as any beginner can also adopt the flow and start building an API. Project is open for suggestions, Bug reports and pull requests.

## Advertise for Job/Work Contract

I am open for a good job or work contract. You can contact me directly on my email ([maitraysuthar@gmail.com](mailto:maitraysuthar@gmail.com 'maitraysuthar@gmail.com')) or you can download my CV from my personal [website](https://maitraysuthar.github.io/portfolio/).

## Buy me a Coffee

If you consider my project as helpful stuff, You can appreciate me or my hard work and time spent to create this helpful structure with buying me a coffee.

<a href="https://www.buymeacoffee.com/36GgOoQ2f" target="_blank"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a> -->

## Features

- Basic Authentication (Register/Login with hashed password)
<!-- - Account confirmation with 4 (Changeable) digit OTP. -->
- Email sending with [Nodemailer](https://nodemailer.com/about/).
- Computer vision via the Google Cloud Vision API
- JWT Tokens, make requests with a token after login with `Authorization` header with value `yourToken` where `yourToken` will be returned in Login response.
<!-- - Pre-defined response structures with proper status codes.
- Included CORS.
- **Book** example with **CRUD** operations. -->
- Validations added.
- Included API collection for Postman.
- Light-weight project.
- Test cases with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/).
- Code coverage with [Istanbuljs (nyc)](https://istanbul.js.org/).
- Included CI (Continuous Integration) with [Travis CI](https://travis-ci.org).
- Linting with [Eslint](https://eslint.org/).

## Software Requirements

- Node.js **8+**
- MongoDB **3.6+** (Recommended **4+**)

## How to install

### Using Git (recommended)

1.  Clone the project from github.

```bash
git clone https://github.com/dscfuto-org/fasthrash-BE.git ./fasthrash
```

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd fastrash-BE
npm install
```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## Project structure

```sh
.
├── app.js
├── package.json
├── bin
│   └── www
├── controllers
│   ├── HistoryControllers
│   │   ├── CollectionHistoryController.js
│   │   └── DepositHistoryController.js
│   ├── AuthController.js
|   ├── AlertController.js
│   └── ImageUploadController.js
├── models
│   ├── HistoryModels
│   │   ├── CollectionHistory.js
│   │   └── DepositHistory.js
│   ├── alertModel.js
│   └── imgModel.js
|   └── userModel.js
|   └── tokenModel.js
|   └── pointModel.js
├── routes
│   ├── alert.js
│   ├── auth.js
│   └── history.js
│   └── imageUpload.js
|   └── testConfig.js
├── middlewares
│   ├── jwt.js
│   └── upload.js
│   └── verifyUser.js
│   └── vision.js
├── helpers
│   ├── apiResponse.js
│   ├── constants.js
│   ├── mailer.js
│   └── utility.js
│   └── cloudStorage.js
├── test
│   ├── testConfig.js
│   ├── auth.js
│   └── alert.js
│   └── history.js
│   └── imageUpload.js
├── views
│   └── resetPassword.ejs
└── public
    ├── index.html
    └── stylesheets
        └── style.css
```

## How to run

### Running API server locally

```bash
npm run dev
```

You will know server is running by checking the output of the command `npm run dev`

```bash
Connected to mongodb:YOUR_DB_CONNECTION_STRING
App is running ...

Press CTRL + C to stop the process.
```

**Note:** `YOUR_DB_CONNECTION_STRING` will be your MongoDB connection string.

## Tests

### Running Test Cases

```bash
npm run test
```

You can set custom command for test at `package.json` file inside `scripts` property. You can also change timeout for each assertion with `--timeout` parameter of mocha command.

### Creating new tests

If you need to add more test cases to the project just create a new file in `/test/` and run the command.

## ESLint

### Running Eslint

```bash
npm run lint
```

You can set custom rules for eslint in `.eslintrc.json` file, Added at project root.

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
