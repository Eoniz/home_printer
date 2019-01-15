const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, default: 'pending' },
    black: { type: Boolean, default: false }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Printing', schema);