//const users = require('./users');
//const articles = require('./articles');

const sh = require('../utils/sh');

module.exports = (router) => {
    /*
    router.use('/users/', users);
    router.use('/articles/', articles);
    */

    router.route('/')
        .get(async (req, res) => {

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

    router.route('/')
        .post((req, res, next) => {
            let uploadFile = req.files.file;
            const fileName = req.files.file.name;

            uploadFile.mv(
                `${__dirname}/public/files/${fileName}`,
                function(err) {
                    if(err) {
                        return res.status(500).send(err);
                    }

                    res.json({
                        file: `public/${req.files.file.name}`
                    })
                }
            )
        });

    return router;
}