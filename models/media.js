var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @typedef {Object} Media
 * @property {String} filename - name of media
 * @property {String} originFile - origin name of media
 * @property {String} amazonfilename - file name in amazon in format bcrypt
 * @property {String} src - path of media
 * @property {Number} rotate - how many degrees rotated media
 * @property {String} size - size file of media
 * @property {{_id: String, rating: Number, tags: [], hidden: String}}[] things
 * @property {String} place - place id of media
 * @property {Boolean} isTrash - isTrash of media(true or false)
 * @property {Boolean} isHouse - isHouse of media(true or false)
 * @property {Boolean} isPortrait - isPortrait of media(true or false)
 * @property {String} show - show of media(show or hide)
 * @property {String} type - type image or video
 */

var imagesSchema = new Schema({
  filename: String,
  originFile: String,
  amazonfilename: String,
  src: String,
  rotate: Number,
  size: String,
  things: [{
    _id: {type: Schema.Types.ObjectId, ref: 'Things'},
    rating: Number,
    tags: [{
      text: String
    }],
    /** hidden: hidden of thing (show or hide) */
    /** todo: rename hidden on isHidden and replace String for Boolean */
    hidden: String
  }],
  place: {type: Schema.Types.ObjectId, ref: 'Places'},
  isTrash: Boolean,
  isHouse: Boolean,
  isPortrait: Boolean,
  show: String,
  type: {type: String, enum: ['image', 'video']}
});

mongoose.model('Media', imagesSchema);
