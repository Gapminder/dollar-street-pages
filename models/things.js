var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 @typedef {Object} Thing - foo
 @property {String[]} thingCategory - ref to category
 @property {String} thingName - thing name
 @property {String} thingDescription - thing description
 @property {Number} rating - thing rating
 @property {String} list - list black/white
 @property {{text: String}[]} tags - labels
 @property {String} icon - url of thing icon
 @property {String} plural - plural of thing name
 */

var thingsSchema = new Schema({
  thingCategory: [{type: Schema.Types.ObjectId, ref: 'Categories'}],
  thingName: {type: String, unique: true, index: true},
  thingDescription: String,
  rating: {type: Number, default: 0},
  list: String,
  isPublic: Boolean,
  tags: [
    {
      text: String
    }
  ],
  icon: String,
  plural: String
});

mongoose.model('Things', thingsSchema);
