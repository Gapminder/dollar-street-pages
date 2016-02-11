var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @typedef {Object} Place
 * @property {String} author - author of place
 * @property {String} name - name of place
 * @property {String} description - description of place
 * @property {String} list - list of place (black or white)
 * @property {Number} rating - rating of place 0-5
 * @property {String} date - creation date place
 * @property {String} type - place type
 * @property {Boolean} isTrash - place in trash (true or false)
 * @property {Boolean} isPublic - show place in the main page
 * @property {Object} units -income an other units
 * @property {country:string,region:string} location - country name and region
 * @property {String} photographer - photographer name
 * @property {ObjectID} familyPhoto - familyPhoto
 * @property {ObjectID} housePhoto - housePhoto
 * @property {{_id:ObjectID,images:{_id:ObjectID,rating:number,tags:string[],hidden:string}[]}[]} things - housePhoto
 * @property {String} photographer - photographer name
 * @property {String} familyInfo - family info
 * @property {String} familyInfoSummary - family info summary
 * @property {{id: String, answers: String, questions: String,
 * forms: [{formId: String, answers: String}]}}[] info - info of place
 */

var placesSchema = new Schema({
  /* todo: transform in object id */
  author: [{type: Schema.Types.ObjectId, ref: 'Users'}],
  name: {type: String, unique: true, index: true},
  description: String,
  list: String,
  rating: {type: Number, default: 0},
  /*todo:date->createdAt*/
  date: {type: Date, default: Date.now},
  type: {type: Schema.Types.ObjectId, ref: 'PlacesType'},
  isTrash: Boolean,
  isPublic: Boolean,
  familyInfo: String,
  familyInfoSummary: String,
  locations: {country: String, region: String},
  units: Object,
  familyPhoto: {type: Schema.Types.ObjectId, ref: 'Media'},
  housePhoto: {type: Schema.Types.ObjectId, ref: 'Media'},
  photographer: String,
  things: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Thing'
      },
      images:[{
        _id:{type: Schema.Types.ObjectId, ref: 'Media'},
        rating: Number,
        tags: [{
          text: String
        }],
        /** hidden: hidden of thing (show or hide) */
        /** todo: rename hidden on isHidden and replace String for Boolean */
        hidden: String
      }]
    }],
  info: [
    {
      id: String,
      answers: Schema.Types.Mixed,
      questions: String,
      forms: [
        {
          formId: {type: Schema.Types.ObjectId, ref: 'Forms'},
          answers: Schema.Types.Mixed
        }
      ]
    }
  ]
});

mongoose.model('Places', placesSchema);
