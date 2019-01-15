const Printing = require('./Printing.model');

module.exports = {
    add,
    remove,
    getFilesToPrint
}

async function add({ name, type, black }) {
    const printing = new Printing({
        name: name,
        type: type,
        black: black,
    });

    await printing.save();

    return {
        doc: printing
    }
}

async function remove({ name }) {
    const printing = await Printing.find({name: name, status: 'pending'});

    if(printing) {
        printing.status = 'printed';
        await printing.save();
    
        return {
            doc: printing
        }
    }

    return {
        doc: null
    }
}

async function getFilesToPrint() {
    const files = await Printing.find({status: 'pending'});

    for(let file of files) {
        file.status = 'printed';
        await file.save();
    }

    const filesToPrint = files;

    if(files) {
        return {
            docs: filesToPrint
        }
    }

    return {
        docs: null
    }
}
