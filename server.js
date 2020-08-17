const express    = require ('express');
const bodyParser = require ('body-parser');
const app        = express ();
const morgan     = require('morgan');

require ('./app/Config/constant');
require ('./app/Config/config');
require ('./app/Config/connection');


var apiRoutes = require('./app/Routes/admin');


app.use (bodyParser.json());
app.use(morgan('dev'));
app.use (bodyParser.urlencoded ({extended: true}));
app.use (API_URL_PREFIX, apiRoutes);

app.listen (PORT, console.log (`server is started at port ${PORT}`));
