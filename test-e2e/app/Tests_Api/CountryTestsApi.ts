let request = require('request');
let _ = require('lodash');
let using = require('jasmine-data-provider');
let result1;
let result2;

import { DataProvider } from './Data';
import { Instances } from './Instances';
import { browser } from 'protractor';

describe('Country Places tests: check json from 2 instances: ', () => {
  beforeEach(() => {
    browser.get('');
  });
  using(DataProvider.countryId, (data: any, description: any) => {
    it(description + ' Check json', () => {
      request(Instances.prodApi + Instances.secondPartLinkForCountryPlaces + data.countryId, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForCountryPlaces, (data: any) => {
            expect(body).toContain(data.key);
          });
          result1 = JSON.parse(body);

          if (!result1.data.country || !result1.data.places) {
            return;
          }

          delete result1.data.country.code;
          delete result1.data.country.region;
          delete result1.data.country.country;
          delete result1.data.country.lat;
          delete result1.data.country.lng;
          delete result1.data.country.alias;
          delete result1.data.country.description;

          result1.data.places = _.map(result1.data.places, (item) => {
            if(item) {
              delete item.interviewedPerson;
              delete item._id;
            }
            return item;
          });
        }
      });
      request(Instances.lecturesApi + Instances.secondPartLinkForCountryPlaces + data.countryId, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForCountryPlaces, (data: any) => {
            expect(body).toContain(data.key);
          });
          result2 = JSON.parse(body);
          if (!result2.data.places) {
            return;
          }
          result2.data.places = _.map(result2.data.places, (item) => {
            if(item) {
              delete item._id;
            }
            return item;
          });
        }
      });
      expect(result1.data.country).toEqual(result2.data.country);
      expect(result1.data.places).toEqual(result2.data.places);
      expect(_.isEqual(result1, result2)).toBeTruthy();
      for (let i = 0; i < result1.data.places.length; i++) {
        expect(result1.data.places[i].imagesCount).toEqual(result2.data.places[i].imagesCount);
      }
    });
  });
});
describe('Country info tests: check json from 2 instances', () => {
  beforeEach(() => {
    browser.get('');
  });
  using(DataProvider.countryId, (data: any, description: any) => {
    it(description + ' Check json', () => {
      request(Instances.prodApi + Instances.secondPartLinkForCountryInfo + data.countryId, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForCountryInfo, (data: any) => {
            expect(body).toContain(data.key);
          });

          result1 = body;
        }
      });
      request(Instances.localHost + Instances.secondPartLinkForCountryInfo + data.countryId, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJsonForCountryInfo, (data: any) => {
            expect(body).toContain(data.key);
          });
          result2 = body;
        }
      });
      expect(result1).toEqual(result2);
      let result1Json = JSON.parse(result1);
      let result2Json = JSON.parse(result2);
      expect(result1Json.data.country.places).toEqual(result2Json.data.country.places);
      expect(result1Json.data.country.images).toEqual(result2Json.data.country.images);
    });
  });
});
