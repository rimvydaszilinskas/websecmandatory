// load .env configuration
require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mysql = require('mysql2');
const morgan = require('morgan');

const { userMiddleware } = require('./middleware/authentication');
const router = require('./routers');
const DALS = require('./dals');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.PORT || 3306,
    user: process.env.DB_USER || 'kea',
    database: process.env.DB_NAME || 'kea_websec',
    password: process.env.DB_PASS || 'password',
});

const app = express();
const port = 3000;
const hbs = exphbs.create({
    helpers: {},
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
        },
    }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

connection.connect((err) => {
    if (err) {
        console.error(err);
        process.exit();
    }
    const dals = DALS(connection);

    app.use(userMiddleware(dals.users));

    app.locals.appName = 'WebSec2020';

    app.use('/', router(dals));

    app.listen(3000, (err) => {
        if (err) {
            console.error(err);
            process.exit();
        }
        console.log(`Application running on :${port}`);
    });
});
