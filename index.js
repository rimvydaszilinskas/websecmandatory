const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const { Client } = require('pg');

const { userMiddleware } = require('./middleware/authentication');
const router = require('./routers');
const client = new Client({
    user: 'rimbo',
    host: '127.0.0.1',
    database: 'mandwebsec',
    password: 'password',
    port: 5432,
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
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
        },
    }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userMiddleware());

client
    .connect()
    .then(() => {
        app.locals.appName = 'WebSec2020';

        app.use('/', router());

        app.listen(3000, (err) => {
            if (err) {
                console.error(err);
                process.exit();
            }
            console.log(`Application running on :${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
        process.exit();
    });
