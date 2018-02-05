let request = require('request');
let _ = require('lodash');
let using = require('jasmine-data-provider');
let result1;
let result2;

import { DataProvider } from './Data';
import { Instances } from './Instances';
import { browser } from 'protractor';

describe('Matrix tests: check json from prod-api and apidev', () => {
  beforeEach(() => {
    browser.get('');
  });

  using(DataProvider.ThingNames, (data: any, description: any) => {
    it(description + ' Check json from full link', () => {
      request(Instances.prodApi + Instances.secondPartLinkForMatrix + data.thingName + Instances.lastPartLink, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJson, (data: any) => {
            expect(body).toContain(data.key);
          });

          result1 = JSON.parse(body);

          if (!result1.data.zoomPlaces || !result1.data.streetPlaces) {
            return;
          }

          result1.data.zoomPlaces = _.map(result1.data.zoomPlaces, (item) => {
            if(item) {
              delete item.image;
              delete item.background;
            }
            return item;
          });

          result1.data.streetPlaces = _.map(result1.data.streetPlaces, (item) => {
            if(item) {
              delete item.image;
              delete item.background;
            }

            return item;
          });
        }
      });
      request(Instances.lecturesApi + Instances.secondPartLinkForMatrix + data.thingName + Instances.lastPartLink, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJson, (data: any) => {
            expect(body).toContain(data.key);
          });
          result2 = JSON.parse(body);

          if (!result2.data.zoomPlaces || !result2.data.streetPlaces) {
            return;
          }

          result2.data.zoomPlaces = _.map(result2.data.zoomPlaces, (item) => {
            if(item) {
              delete item.image;
              delete item.background;
            }
            return item;
          });


          result2.data.streetPlaces = _.map(result2.data.streetPlaces, (item) => {
            if(item) {
              delete item.image;
              delete item.background;
            }

            return item;
          });
        }
      });
      expect(result1.data.zoomPlaces).toEqual(result2.data.zoomPlaces);
      expect(result1.data.streetPlaces).toEqual(result2.data.streetPlaces);
      expect(_.isEqual(result1, result2)).toBeTruthy();
    });
  });
});
//CODE For checking string, not JSON
/*while ((result1.indexOf('"image":"')) > 0) {
 let numberStartOfImage: number = result1.indexOf('"image":"');
 let jsonWithoutImage: string = (result1.substring(0, numberStartOfImage) + result1.substring(numberStartOfImage + 24));
 result1 = jsonWithoutImage;
 }*/
/*
describe('Quick tests: check json from 2 diff instances', () => {
  beforeEach(() => {
    browser.get('');
  });

  using(DataProvider.ThingNames, (data: any, description: any) => {
    it(description + 'Check json from full link', () => {
      request(Instances.prodApi + data.thingName + Instances.lastPartLink, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJson, (data: any) => {
            expect(body).toContain(data.key);
          });

          result1 = body;
        }
      });
      request(Instances.apiDev + data.thingName + Instances.lastPartLink, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          using(DataProvider.keysJson, (data: any) => {
            expect(body).toContain(data.key);
          });
          result2 = body;
        }
      });
      expect(result1).toEqual(result2);
    });
  });
});
*/
