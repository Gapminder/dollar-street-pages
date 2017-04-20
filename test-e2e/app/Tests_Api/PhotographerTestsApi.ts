let request = require('request');
let _ = require('lodash');
let using = require('jasmine-data-provider');
let result1;
let result2;

import { DataProvider } from './Data';
import { Instances } from './Instances';
import { browser } from 'protractor';

describe('Photographer Places tests: check json from 2 instances', () => {
  beforeEach(() => {
    browser.get('');
  });
  using(DataProvider.photographerId, (data: any, description: any) => {
    it(description + ' Check json', () => {
      request(Instances.prodApi + Instances.secondPartLinkForPhotographerPlaces + data.id, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForPhotographerPlaces, (data: any) => {
            expect(body).toContain(data.key);
          });

          result1 = JSON.parse(body);

          if (!result1.data.places) {
            return;
          }

          result1.data.places = _.map(result1.data.places, (item) => {
            if(item) {
              delete item.interviewedPerson;
            }
            return item;
          });
        }
      });
      request(Instances.localHost + Instances.secondPartLinkForPhotographerPlaces + data.id, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForPhotographerPlaces, (data: any) => {
            expect(body).toContain(data.key);
          });
          result2 = JSON.parse(body);

          if (!result1.data.places) {
            return;
          }

          result1.data.places = _.map(result1.data.places, (item) => {
            if(item) {
              delete item._id;
            }
            return item;
          });
        }
      });
      expect(result1.data.places.length).toEqual(result2.data.places.length);
    });
  });
});

describe('Photographer Profile tests: check json from 2 instances', () => {
  beforeEach(() => {
    browser.get('');
  });
  using(DataProvider.photographerId, (data: any, description: any) => {
    it(description + ' Check json', () => {
      request(Instances.prodApi + Instances.secondPartLinkForPhotographerProfile + data.id, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForPhotographerProfile, (data: any) => {
            expect(body).toContain(data.key);
          });

          result1 = body;
        }
      });
      request(Instances.localHost + Instances.secondPartLinkForPhotographerProfile + data.id, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForPhotographerProfile, (data: any) => {
            expect(body).toContain(data.key);
          });
          result2 = body;
        }
      });
      expect(result1).toEqual(result2);
      let result1Json = JSON.parse(result1);
      let result2Json = JSON.parse(result2);
      expect(result1Json.data.imagesCount).toEqual(result2Json.data.imagesCount);
      expect(result1Json.data.placesCount).toEqual(result2Json.data.placesCount);
    });
  });
});
