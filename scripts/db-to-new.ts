/**
 * Created by igor on 2/11/16.
 */
/// <reference path="../typings/tsd.d.ts" />

let mongoose = require('../node_modules/mongoose');
let _async = require('../node_modules/async/dist/async.js');
let __=require('../node_modules/lodash');
require('../models')();
let Places = mongoose.model('Places');
let Locations = mongoose.model('Locations');
let Images = mongoose.model('Media');
const MONGO_DB = `mongodb://localhost/dollarstreet`;

let db = mongoose.connection;
mongoose.connect(MONGO_DB);

db.on('error', function (err) {
  console.log('db connect error', err);
});
db.once('close', function () {
  console.log('db connect close');
});

db.once('open', function () {
  console.log('db connect good');
  _async.parallel({
    places: getPlaces,
    locations: getLocations,
    images: getImages,
    getImagesByThings: getImagesByThings
  }, (err, result)=> {
    if (err) {
      return console.log(err)
    }
    let {places, locations, images, getImagesByThings}=result;

    let hashLocations = __.reduce(locations, (result:any, value:any)=> {
      result[value.country] = {country: value.country, region: value.region};
      return result;
    }, {});

    let hashImages = __.reduce(images, (result:any, value:any)=> {
      result[value._id] = value.images;
      return result;
    }, {});

    let hashImagesWithThings = __.reduce(getImagesByThings, (result:any, value:any)=> {
      result[value._id.place] = {_id: value._id.thing, images: value.images};
      return result;
    }, {});

    let placesWithLocations = __.map(<any[]>places, (place)=> {
      place.locations = hashLocations[place.country];
      let images = hashImages[place._id];
      let imagesWithThing = hashImagesWithThings[place._id];
      let family = __.find(<{_id: string, isHouse: boolean, isPortrait: boolean}[]>images, (img)=> {
        return img.isPortrait;
      });
      if (family) {
        place.familyImage = family._id;
      }
      let house = __.find(<{_id: string, isHouse: boolean, isPortrait: boolean}[]>images, (img)=> {
        return img.isHouse;
      });
      if (house) {
        place.houseImage = house._id;
      }
      place.things = imagesWithThing;

      return place;
    })

    _async.each(placesWithLocations, (place, cb)=> {
      Places.update({_id: place._id}, {
        $set: {
          units: {income: place.income},
          locations: place.locations,
          photographer: place.photographer,
          familyPhoto: place.familyImage,
          housePhoto: place.houseImage,
          things: place.things,
        }
      }, cb)
    }, (err)=> {
      if (err) {
        return console.log(err)
      }
      console.log('good upgrade ')
    })

  })
});
function getLocations(cb) {
  Locations.find().lean().exec(cb)
}
function getPlaces(cb) {
  Places.aggregate({
    $unwind: '$info'
  }, {
    $project: {
      country: {$cond: {if: {$eq: ['$info.id', 'country']}, then: '$info.answers', else: null}},
      income: {$cond: {if: {$eq: ['$info.id', 'income']}, then: '$info.answers', else: null}},
      photographer: {$cond: {if: {$eq: ['$info.id', 'photographer']}, then: '$info.answers', else: null}},
    }
  }, {
    $group: {
      _id: '$_id',
      country: {$addToSet: '$country'},
      income: {$addToSet: '$income'},
      photographer: {$addToSet: '$photographer'}
    }
  }, {
    $project: {
      country: {$setDifference: ['$country', [null]]},
      income: {$setDifference: ['$income', [null]]},
      photographer: {$setDifference: ['$photographer', [null]]},
    }
  }, {
    $unwind: '$country'
  }, {
    $unwind: '$income'
  }, {
    $unwind: '$photographer'
  }).exec(cb);
}
function getImages(cb) {
  Images.aggregate(
    {
      $match: {isHouse: true, isPortrait: true}
    },
    {
      $group: {
        _id: '$place',
        images: {$addToSet: {_id: '$_id', isHouse: '$isHouse', isPortrait: '$isPortrait'}}
      }
    }).exec(cb)
}

function getImagesByThings(cb) {
  Images.aggregate(
    {$unwind: '$things'},
    {
      $group: {
        _id: {thing: '$things._id', place: '$place'},
        images: {$addToSet: {_id: '$_id', rating: '$things.rating', tags: '$things.tags', hidden: '$things.hidden'}}
      }
    }).exec(cb)
}

