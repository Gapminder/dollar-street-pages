'use strict';

import { browser } from 'protractor';
import { AbstractPage } from '../Pages/AbstractPage';
import { ThingsFilterPage } from '../Pages/ThingsFilterPage';

describe('Things Page tests: ', () => {
  beforeAll(() => {
    browser.get('cms/login');
    AbstractPage.logIn();
    ThingsFilterPage.linkToThingsFilter.click();
  });
  it('Check adding things', () => {
    expect(ThingsFilterPage.h2.getText()).toEqual('Things Filter');
    expect(ThingsFilterPage.popularHeader.getText()).toEqual('Popular things');
    expect(ThingsFilterPage.allTopicsHeader.getText()).toEqual('All topics');
    ThingsFilterPage.quantityOfChosenThingsInPopular.count().then((quantityThingsInPopular)=>{
      ThingsFilterPage.inputForPopular.click();
      ThingsFilterPage.listOfThingsInInput.get(Math.floor(Math.random()*2)).click();
      ThingsFilterPage.buttonSave.click();
      expect(ThingsFilterPage.quantityOfChosenThingsInPopular.count()).toBe(quantityThingsInPopular + 1);
    });
    ThingsFilterPage.quantityOfChosenThingsInAll.count().then((quantityThingsInAll)=>{
      ThingsFilterPage.inputForAllTopics.click();
      ThingsFilterPage.listOfThingsInInput.get(Math.floor(Math.random()*2)).click();
      ThingsFilterPage.buttonSave.click();
      expect(ThingsFilterPage.quantityOfChosenThingsInAll.count()).toBe(quantityThingsInAll + 1);
    });
    console.log('Things added to filter');
  });
  it ('Check deleting things', ()=> {
    ThingsFilterPage.quantityOfChosenThingsInPopular.count().then((quantityThingsInPopular)=>{
      ThingsFilterPage.deleteButtonsOnPopular.last().click();
      ThingsFilterPage.buttonSave.click();
      expect(ThingsFilterPage.quantityOfChosenThingsInPopular.count()).toBe(quantityThingsInPopular - 1);
    });
    ThingsFilterPage.quantityOfChosenThingsInAll.count().then((quantityThingsInAll)=>{
    ThingsFilterPage.deleteButtonsOnAll.last().click();
      ThingsFilterPage.buttonSave.click();
      expect(ThingsFilterPage.quantityOfChosenThingsInAll.count()).toBe(quantityThingsInAll - 1);
    });
    console.log('Things deleted from filter');
  });
});
