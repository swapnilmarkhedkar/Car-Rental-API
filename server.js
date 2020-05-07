const express = require('express');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

// Database connection
var {mongoose} = require('./db/mongoose');
// var {Car} = require('./models/Car');

// Middleware
const app = express();
app.use(bodyParser.json());

// @TODO: Specify a routes folder and just specify middleware here

// Routes
app.use('/', require('./routes/index'));
app.use('/cars', require('./routes/cars'));

app.listen(PORT, console.log(`Started server on Port ${PORT} `));