import { browser } from 'protractor';
import { AbstractPage } from '../Pages/AbstractPage';
import { MatrixPage } from '../../Pages/MatrixPage';
describe('Check url with language on ', ()=>{
  it('', ()=>{
    let n:any = new Date('-3482418870000');
    let d:any = n.getFullYear();
    console.log(d);

    if (isNaN(d) || d === 1900) {
      console.log('found bad year');
      return '';
    }
    /*if (d instanceof Date){
      console.log('found bad data');
      return '';
    }*/

    expect(true).toBe(true);
  });
  it ('Matrix page', ()=>{
    browser.get('matrix');
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toContain('lang=en');
    console.log('sl,jkdlksfj');
    AbstractPage.langChinaOutside.click();
    expect(browser.getCurrentUrl()).toContain('lang=ch');
    AbstractPage.buttonLangDropDown.click();
    AbstractPage.langListInDropDown.get(0).click();
    expect(browser.getCurrentUrl()).toContain('lang=fr');
    AbstractPage.langListInDropDown.get(1).click();
    expect(browser.getCurrentUrl()).toContain('lang=ru');
    AbstractPage.langListInDropDown.get(2).click();
    expect(browser.getCurrentUrl()).toContain('lang=pt');
  });
  it ('Matrix page with opened BIS', ()=>{
    MatrixPage.familyLink.first().click();
    expect(browser.getCurrentUrl()).toContain('lang=pt&activeHouse=');
    AbstractPage.langChinaOutside.click();
    expect(browser.getCurrentUrl()).toContain('lang=ch&activeHouse=');
    AbstractPage.langEnglishOutside.click();
    expect(browser.getCurrentUrl()).toContain('lang=en&activeHouse=');
    AbstractPage.buttonLangDropDown.click();
    AbstractPage.langListInDropDown.get(0).click();
    expect(browser.getCurrentUrl()).toContain('lang=fr&activeHouse=');
    AbstractPage.langListInDropDown.get(1).click();
    expect(browser.getCurrentUrl()).toContain('lang=ru&activeHouse=');
  });
  it('Matrix page with different zoom', ()=>{
    MatrixPage.zoomDecrease.click();
    expect(browser.getCurrentUrl()).toContain('zoom=3' && 'lang=ru');
    MatrixPage.zoomIncrease.click();
    MatrixPage.zoomIncrease.click();
    expect(browser.getCurrentUrl()).toContain('zoom=5' && 'lang=ru');
    AbstractPage.langChinaOutside.click();
    expect(browser.getCurrentUrl()).toContain('lang=ch' && 'zoom=5');
    AbstractPage.langEnglishOutside.click();
    expect(browser.getCurrentUrl()).toContain('lang=en' && 'zoom=5');
    AbstractPage.buttonLangDropDown.click();
    AbstractPage.langListInDropDown.get(0).click();
    expect(browser.getCurrentUrl()).toContain('lang=fr' && 'zoom=5');
    AbstractPage.langListInDropDown.get(1).click();
    expect(browser.getCurrentUrl()).toContain('lang=ru' && 'zoom=5');
  });
});
