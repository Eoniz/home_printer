const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const router = express.Router();

const routes = require('./src/routes/index.js');
const mongoose = require('mongoose');

const connUri = "mongodb://localhost:27017/home_printer";

const sh = require('./src/utils/sh');

const PrintingController = require('./src/core/priting/Printing.controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "access-control-allow-headers, access-control-allow-method, access-control-allow-methods, access-control-allow-origin, crossdomain, authorization, origin, x-requested-with, Content-Type");

    next();
})

/*
 * 
 * ROUTES
 * 
 */

app.get('/', async (req, res) => {
    const { stdout } = await sh('ls');
    let output = '';
    for(let line of stdout.split('\n')) {
        output += (line + ' ');
    }

    let result = {
        status: 200
    }
    res.status(200).send(output);
})

app.post('/', async (req, res, next) => {
    const black = req.body.black;

    let uploadFile = req.files.file;
    const fileName = req.files.file.name;
    const name = `${new Date().getTime()}-${fileName}`;

    uploadFile.mv(
        `${__dirname}/public/files/${name}`,
        function(err) {
            if(err) {
                return res.status(500).send(err);
            }
        }
    )

    await PrintingController.add({ name: name, type: 'file', black: black });

    res.json({
        file: `public/files/${name}`
    })
});

app.get('/print', async (req, res, next) => {
    const { docs } = await PrintingController.getFilesToPrint();

    console.log(docs);
})

app.get('/cmd/:cmd', async (req, res, next) => {
    console.log(req.params.cmd)
    const { stdout } = await sh(req.params.cmd);
    const b = `
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="utf-8" />
            </head>
            <body>
                <p>${stdout}</p>
            </body>
        </html>
    `;

    res.status(200).send(b);
});

/*
 * 
 * /ROUTES
 * 
 */

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