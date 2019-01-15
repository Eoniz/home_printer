const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const routes = require('./src/routes/index.js');
const mongoose = require('mongoose');

const connUri = "mongodb://localhost:27017/home_printer";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "access-control-allow-headers, access-control-allow-method, access-control-allow-methods, access-control-allow-origin, crossdomain, authorization, origin, x-requested-with, Content-Type");

    next();
})

app.use('/api/', routes(router));

mongoose.connect(connUri, { useNewUrlParser: true }, async(err) => {
    if(err) {
        console.log(err);
        console.log("Cannot connect with database");
    } else {;
        app.listen(7000, () => {
            console.log("Server is now listening at localhost:7000");
        });
    }
});

module.exports = app;