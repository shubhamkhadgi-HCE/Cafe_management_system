const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const connection = require('./connection'); 
const userRoutes = require('./routes/user');
const catRoutes = require('./routes/category');
const prodRoutes = require('./routes/product');
const biilRoutes = require('./routes/bill');
const dashBoardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/category', catRoutes);
app.use('/product', prodRoutes);
app.use('/bill', biilRoutes);
app.use('/dashboard', dashBoardRoutes);


module.exports = app;