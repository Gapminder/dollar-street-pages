var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 @typedef {Object} Location
 @property  {String} country - country
 @property {String} region - region of country
 @property {String} position - code of country
 @property {String} description - description of country
 */
var locationSchema = new Schema({
  country: String,
  region: String,
  code: String,
  description: String,
  lng: Number,
  lat: Number
});

mongoose.model('Locations', locationSchema);
