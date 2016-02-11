var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @typedef {Object} Category
 * @property {String} name - name of category
 * @property {String} description - description of category
 * @property {String} list - type white or black
 * @property {Number} rating - rating of category
 */

var categoriesSchema = new Schema({
  name: {type: String, unique: true, index: true},
  description: String,
  list: String,
  rating: {type: Number, default: 3}
});

mongoose.model('Categories', categoriesSchema);
