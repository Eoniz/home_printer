const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const fs = require('fs');

const sh = require('./src/utils/sh');

let printings = [];


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

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/*
 * 
 * ROUTES
 * 
 */

app.get('/', async (req, res) => {
    res.status(200).send('/');
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

    printings.push({ name: name, type: 'file', black: black });

    res.status(201).json({
        file: `public/files/${name}`
    })
});

app.get('/print', async (req, res, next) => {
    try {
        const start = async () => {
            await asyncForEach(printings, async (file) => {
                const grayScale = (file.black) ? '"Gray Black"' : '"RGB"';
                await sh(`lpoptions -o ColorModel=${grayScale}`).catch((err) => {});

                if(file.type === 'file') {
                    await sh(`lp ${__dirname}/public/files/${file.name}`).catch((err) => {});

                } else if(file.type === 'web') {
                    const { stdout } = await sh(`lp ${__dirname}/public/files/${file.name}`).catch((err) => {});
                }

                fs.unlinkSync(`${__dirname}/public/files/${file.name}`);
            });
        }
        
        await start().catch((err) => {});

        printings = [];
    } catch (error) {}

    res.status(200).json({
        success: true
    })
})

app.get('/cmd/:cmd', async (req, res, next) => {
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


app.listen(7000, () => {
    console.log("Server is now listening at localhost:7000");
});

module.exports = app;