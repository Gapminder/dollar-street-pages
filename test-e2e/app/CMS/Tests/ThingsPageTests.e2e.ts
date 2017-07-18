'use strict';

import { browser } from 'protractor';
import { ThingsPage } from '../Pages/ThingsPage';
import { AbstractPage } from '../Pages/AbstractPage';

describe('Things Page tests: ', () => {
  beforeAll(() => {
    browser.get('cms/login');
    AbstractPage.logIn();
    ThingsPage.linkToThings.click();
  });
  it('Check adding things', () => {
    expect(ThingsPage.h2.getText()).toEqual('Things');
    ThingsPage.addNewThing.click();
    browser.sleep(1000);
    expect(ThingsPage.headerInPopUpThings.getText()).toEqual('Create new thing');
    AbstractPage.sendQuery(ThingsPage.fieldAddThingName, 'Test Name Of Thing' + Math.random());
    AbstractPage.sendQuery(ThingsPage.fieldAddPluralOfThing, 'Test Plural Name of Thing');
    AbstractPage.sendQuery(ThingsPage.fieldAddDescriptionOfThing, 'Test description of Thing');
    ThingsPage.selectRelatedThings.click();
    ThingsPage.listOfRelatedThings.count().then((quantityRelatedThings) => {
      ThingsPage.listOfRelatedThings.get(Math.floor(Math.random() * quantityRelatedThings)).click();
    });
    ThingsPage.selectCategory.click();
    ThingsPage.listOfCategories.count().then((quantityOfCategories) => {
      ThingsPage.listOfCategories.get(Math.floor(Math.random() * quantityOfCategories)).click();
    });
    AbstractPage.sendQuery(ThingsPage.fieldOfSynonymousOfThing, 'test synonymous');
    AbstractPage.sendQuery(ThingsPage.fieldOfTagsForThing, 'tag');
    ThingsPage.buttonWhiteList.click();
    browser.sleep(1000);
    ThingsPage.buttonSaveThing.click();
    AbstractPage.sendQuery(ThingsPage.searchField, 'Test Name Of Thing');
    ThingsPage.listOfThings.count().then((countOfTestThings) => {
      if (countOfTestThings > 0) {
        console.log('Adding things works correct');
      }
    });
   });
  it('Adding article about thing', ()=>{
    ThingsPage.linkToThings.click();
    AbstractPage.sendQuery(ThingsPage.searchField, 'Test Name Of Thing0');
    browser.sleep(1000);
    ThingsPage.buttonEditArticle.get(0).click();
    expect(ThingsPage.h2.getText()).toContain('Article For Thing');
    AbstractPage.sendQuery(ThingsPage.shortDescriptionOfArticle, 'Some short test description of article about Test thing ......... ');
    browser.driver.executeScript("tinyMCE.activeEditor.insertContent('<p><span><img src=\"http://static.dollarstreet.org.s3.amazonaws.com/media/IMGforArticles/image/758e918b-9572-42a6-a395-fe5621be601c/original-758e918b-9572-42a6-a395-fe5621be601c.png?_ds=1475859705750\" alt=\"Books on different incomes\" width=\"1400\" height=\"690\" /><br /></span></p><h2><span style=\"font-weight: 400;\">The poorest homes</span></h2><p><span style=\"font-weight: 400;\">Many families living below the poverty line around the world do not keep books at home and often have poor literacy skills<sup>1</sup><span style=\"font-weight: 400;\">. Those who do have books might have children&rsquo;s textbooks, religious texts or notebooks. Families living with a low income, like the</span><a href=\"http://gapminder.org/dollar-street/family?place=54b7b14fc53d4fa64fb8904f&amp;thing=Books&amp;countries=Malawi&amp;regions=World&amp;zoom=4&amp;row=2&amp;lowIncome=1&amp;highIncome=15000\"><strong> Solijala family in Malawi</strong></a><span style=\"font-weight: 400;\">, often lack a bookshelf or closet to keep books on display. Instead, the Solijala family keep their books in a container along with some other household objects. They also do not have electricity in the home, so are only able to read or write by the dim light of the fireplace once the sun has gone down.</span></span></p><p><span style=\"font-weight: 400;\"><span style=\"font-weight: 400;\"><img src=\"http://static.dollarstreet.org.s3.amazonaws.com/media/Malawi%203/image/e550353e-1689-4400-a8c7-ba3c3cb1a798/desktops-e550353e-1689-4400-a8c7-ba3c3cb1a798.jpg\" alt=\"Solijala family, Malawi\" width=\"1024\" height=\"683\" /></span></span></p><p><em><a href=\"http://gapminder.org/dollar-street/family?place=54b7b14fc53d4fa64fb8904f&amp;thing=Books&amp;countries=Malawi&amp;regions=World&amp;zoom=4&amp;row=2&amp;lowIncome=1&amp;highIncome=15000\">Solijala family, Malawi</a></em></p><h2><span style=\"font-weight: 400;\">Low to middle income homes</span></h2><p><span style=\"font-weight: 400;\">Families living in low to middle income households often have a collection of children&rsquo;s picture books and textbooks. That&rsquo;s because in this income group, children are more likely to be able to attend school than in low income households<sup>2</sup><span style=\"font-weight: 400;\">, so they bring home a higher number of textbooks and exercise books. For instance, the</span><strong> <a href=\"http://gapminder.org/dollar-street/family?place=54b529b405df73e55431917f&amp;thing=Books&amp;countries=Indonesia&amp;regions=World&amp;zoom=4&amp;row=2&amp;lowIncome=1&amp;highIncome=15000\">Chandra family in Indonesia</a> </strong><span style=\"font-weight: 400;\">have two shelves of non-fiction books, including two encyclopedias.</span></span></p><p><span style=\"font-weight: 400;\"><span style=\"font-weight: 400;\"><img src=\"http://static.dollarstreet.org.s3.amazonaws.com/media/Indonesia%201/image/91b67951-14d1-4457-8acc-41e74ba0b2b7/desktops-91b67951-14d1-4457-8acc-41e74ba0b2b7.jpg\" alt=\"The Chandra family, Indonesia\" width=\"1024\" height=\"1024\" /><em><a href=\"http://gapminder.org/dollar-street/family?place=54b529b405df73e55431917f&amp;thing=Books&amp;countries=Indonesia&amp;regions=World&amp;zoom=4&amp;row=2&amp;lowIncome=1&amp;highIncome=15000\">The Chandra family, Indonesia</a></em></span></span></p>')");
    browser.sleep(1000);
    ThingsPage.buttonSaveArticle.click();
    console.log('Article about thing created');
  });
  it('Checking editing things', ()=>{
    ThingsPage.linkToThings.click();
    AbstractPage.sendQuery(ThingsPage.searchField, 'Test Name Of Thing0');
    browser.sleep(1000);
    ThingsPage.buttonEditThing.click();
    browser.sleep(1000);
    expect(ThingsPage.headerEditingThing.getText()).toContain('Edit:');
    AbstractPage.sendQueryWithoutClear(ThingsPage.fieldAddThingName, ' edited');
    AbstractPage.sendQueryWithoutClear(ThingsPage.fieldAddPluralOfThing, ' edited');
    AbstractPage.sendQueryWithoutClear(ThingsPage.fieldAddDescriptionOfThing, ' edited');
    AbstractPage.sendQueryWithoutClear(ThingsPage.fieldOfSynonymousOfThing, 'new synonymous1');
    AbstractPage.sendQueryWithoutClear(ThingsPage.fieldOfTagsForThing, 'new_tag');
    ThingsPage.ratingStarsEmpty.click();
    browser.sleep(1000);
    ThingsPage.buttonSaveThing.click();
    expect(ThingsPage.listOfThings.first().getText()).toContain(' edited');
    expect(ThingsPage.pluralNameOfThing.getText()).toContain(' edited');
    expect(ThingsPage.descriptionOfThing.getText()).toContain(' edited');
    expect(ThingsPage.ratingStarsNotEmpty.count()).toEqual(5);
    console.log('Editing things works correct');
    ThingsPage.buttonPublicThing.getCssValue('box-shadow').then((value) =>{
      expect(value).toEqual('rgb(76, 217, 100) 0px 0px 0px 13.14px inset');
    });
    ThingsPage.buttonPublicThing.click();
    ThingsPage.buttonPublicThing.getCssValue('box-shadow').then((value) =>{
      expect(value).toEqual('rgb(100, 219, 120) 0px 0px 0px 11.3123px inset');
      console.log('Buttons Public/Unpublic works correct');
    });
  });
  xit('Deleting test things', ()=>{
    ThingsPage.linkToThings.click();
    AbstractPage.sendQuery(ThingsPage.searchField, 'Test Name Of Thing');
    browser.sleep(1000);
    ThingsPage.buttonDeleteThing.each((button) => {
      button.click();
       expect(ThingsPage.headerInPopUpDeleteThing.getText()).toEqual('Delete thing');
       expect(ThingsPage.thingNameByDeleting.getText()).toContain('Test Name Of Thing');
       ThingsPage.buttonOkInDeletingThing.click();
       browser.sleep(1000);
    });
    console.log('Test things deleted');
  });
});
