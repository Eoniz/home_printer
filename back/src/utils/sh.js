var exec = require('child_process').exec, child;

async function sh(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if(err) {
                reject(err);
            } else {
                resolve({ stdout, stderr });
            }
        })
    });
}

module.exports = sh;