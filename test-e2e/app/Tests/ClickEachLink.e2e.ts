import { FooterPage } from '../Pages/FooterPage';
import { MatrixPage } from '../Pages/MatrixPage';
import { browser } from 'protractor';

describe('Click on each link', ()=> {
  beforeAll(()=>{
    browser.get('matrix');
  });
  for (let i = 0; i < 89; i++){
    it('click matrix each link in thing filter (country:world): ' + i, () => {

      MatrixPage.filterByThing.click();
        MatrixPage.thingLinkInSearch.get(i).click();
        browser.sleep(2000);
        browser.driver.actions().mouseDown(FooterPage.dollarStrretText.getWebElement()).perform();

  })
  }
  for (let i = 0; i < 44; i++){
    it('click matrix each link in country filter (single country, thing: families): ' + i, () => {
      browser.get('matrix');
      MatrixPage.filterByCountry.click();
      MatrixPage.countryInFilter.get(i).click();
      MatrixPage.okButtonInCountryFilter.click();
      browser.sleep(2000);
      browser.driver.actions().mouseDown(FooterPage.dollarStrretText.getWebElement()).perform();
    })
  }
  for (let i = 0; i < 44; i++){
    it('click matrix each link in country filter (amount of countries, thing: families): ' + i, () => {
      MatrixPage.filterByCountry.click();
      MatrixPage.countryInFilter.get(i).click();
      MatrixPage.okButtonInCountryFilter.click();
      browser.sleep(2000);
    })
  }
  for (let i = 0; i < 89; i++){
    it('click matrix each link in thing filter (country:amount): ' + i, () => {
      browser.get('matrix');
      MatrixPage.filterByThing.click();
      MatrixPage.thingLinkInSearch.get(i).click();
      browser.sleep(1000);
      for (let i = 0; i < 44; i++){
          MatrixPage.filterByCountry.click();
          MatrixPage.countryInFilter.get(i).click();
          MatrixPage.okButtonInCountryFilter.click();
          browser.sleep(1000);
      }
    })
  }
});
