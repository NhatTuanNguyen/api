const {Schema} = require('mongoose');
const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({
	name: String,
	category: {
		id: {
			type: Schema.Types.String,
			ref: 'category',
			required: true,
		},
		name: String,
	},
	price: Number,
	price_old: Number,
	description: String,
	like: Number,
	special: Boolean,
	brand: String,
	size: [String],
	color: [String],
});

module.exports = mongoose.model(databaseConfig.col_product, schema);