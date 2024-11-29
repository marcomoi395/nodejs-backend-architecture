const express = require('express')
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const app = express();


// Init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// Init database
require('./dbs/init.mongodb')
const {checkOverload} = require('./helper/check.connect')
checkOverload();

// Init routes
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Hello World'
    });
})

module.exports = app;