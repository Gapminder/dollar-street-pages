let request = require('request');
let _ = require('lodash');
let using = require('jasmine-data-provider');
let result1;
let result2;

import { DataProvider } from './Data';
import { Instances } from './Instances';
import { browser } from 'protractor';

describe('Photographer tests: check json from prod-api and apidev', () => {
  beforeEach(() => {
    browser.get('');
  });
for (let i = 0; i < 2; i++) {
  it(' Check json from full link', () => {
    request(Instances.prodApi + Instances.secondPartLinkForPhotographers, (error: any, response: any, body: any) => {
      if (!error && response.statusCode === 200) {
        using(DataProvider.keysJsonForPhotographers, (data: any) => {
          expect(body).toContain(data.key);
        });

        result1 = JSON.parse(body);
      }
    });
    request(Instances.localHost + Instances.secondPartLinkForPhotographers, (error: any, response: any, body: any) => {
      if (!error && response.statusCode === 200) {
        using(DataProvider.keysJsonForPhotographers, (data: any) => {
          expect(body).toContain(data.key);
        });
        result2 = JSON.parse(body);
      }
    });
    expect(result1.data.countryList.length).toEqual(result2.data.countryList.length);
    expect(result1.data.photographersList.length).toEqual(result2.data.photographersList.length);
  });
}
});
