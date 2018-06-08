'use strict';

import { browser, ElementFinder, protractor } from 'protractor';
let using = require('jasmine-data-provider');
import { LogInPage } from '../Pages/LogInPage';
import { DataProvider } from '../Data/DataProvider';
import { PlacesPage } from '../Pages/PlacesPage';
import { AbstractPage } from '../Pages/AbstractPage';
const dropFile = require('../Helpers/DragAndDrop.js');
const EC = protractor.ExpectedConditions;

describe('Place page Tests: ', () => {
  beforeAll(() => {
    browser.get('cms/login');
    AbstractPage.logIn();
  });
  it('LogIN', () => {
      using(DataProvider.PlacesPageString, (data: any, description: any) => {
        expect(data.element().getText()).toEqual(data.actualResult);
        console.log(description + ' checked');
      });
    PlacesPage.infoButton.click();
    AbstractPage.sendQuery(PlacesPage.inputFieldForData, 'ABOUT THE DATA');
    PlacesPage.saveButtonInPopup.click();
    console.log('Add info to About the data');
    browser.sleep(500);
    PlacesPage.infoButton.click().then(() => {
      PlacesPage.inputFieldForData.clear();
      PlacesPage.saveButtonInPopup.click();
      console.log('Field About is empty');
      browser.sleep(500);
    });
  });
  it('check adding places', () => {
    PlacesPage.addPlaceButton.click().then(() => {
      browser.sleep(500);
      PlacesPage.radioButtonsRequiredFields.each((button, number) => {
        if (number % 2 == 0) {
          browser.sleep(500);
          button.click();
        }
      });
      AbstractPage.sendQuery(PlacesPage.inputFieldForFullName, 'Test User 1');
      AbstractPage.sendQuery(PlacesPage.inputFieldForEmail, 'ludmila.nesvitiy@valor-software.com');
      PlacesPage.submitButton.click();
      browser.sleep(500);
      AbstractPage.sendQuery(PlacesPage.fieldNameOfPlace, 'Test Place ' + Math.random());
      AbstractPage.sendQuery(PlacesPage.fieldDescriptionOfPlace, 'Test Description of place 1');
      AbstractPage.sendQuery(PlacesPage.fieldIncomeOfPlace, '10000');
      PlacesPage.selectCountryOfPlace.click().then(()=>{
        AbstractPage.sendQuery(PlacesPage.inputCountryOfPlace, 'Ukraine')
      });
      PlacesPage.selectCurrentCountryOfPlace.click();
      PlacesPage.selectPlaceTypeOfPlace.click();
      PlacesPage.selectCurrentTypeOfPlace.click();
      PlacesPage.selectPhotographerOfPlace.click();
      PlacesPage.selectCurrentPhotographerOfPlace.click();
      PlacesPage.buttonSavePlace.click();
      browser.sleep(5000);
    });
  });
  it('check adding info to tab "Family Info"', ()=>{
    PlacesPage.tabFamilyInfoOnPlacePage.click();
    PlacesPage.editButtonOnFamilyInfoOnPlacePage.click();
    AbstractPage.sendQuery(PlacesPage.inputFamilyInfoSummaryOnPlacePage, 'Test family Info summary: ....................');
    AbstractPage.sendQuery(PlacesPage.inputFamilyInfoOnPlacePage, 'Test family info on place page: 11 22 33 44 55');
    PlacesPage.buttonSaveFamilyInfoOnPlacePage.click();
    expect(PlacesPage.textInFamilyInfoSummary.getText()).toEqual('Test family Info summary: ....................');
    console.log('Family info summary field works correctly');
    expect(PlacesPage.textInFamilyInfo.getText()).toEqual('Test family info on place page: 11 22 33 44 55');
    console.log('Family info field works correctly');
  });
  it('check adding info to tab "Questionare"', ()=>{
    PlacesPage.tabQuestionareOnPlacePage.click();
    browser.sleep(200);
    PlacesPage.editButtonInQuestionare.click();
    PlacesPage.inputFieldsInQuestionare.each((element, index)=>{
      if (index == 0) {
        AbstractPage.sendQueryWithoutClear(element, '11/11/1111');
      } else if (index == 12 || index == 13){
        AbstractPage.sendQueryWithoutClear(element, '1234');
      } else {
        AbstractPage.sendQuery(element, 'Some test information in field number: ' + (index));
      }
    });
    PlacesPage.saveButtonInQuestionare.click();
    PlacesPage.textInQuestionare.each((element, index) => {
      if (index > 1 && index < 11){
        expect(element.getText()).toEqual('Some test information in field number: ' + (index + 1));
      } else if(index > 10){
      expect(element.getText()).toEqual('Some test information in field number: ' + (index + 3));
      }
    });
    console.log('Questionaire tab works correctly');
  });
  it('check uploading images: upload diff types, check exceptions', () => {
    //browser.get('/cms/admin/place/583c1e1f07a7873ce4ea455b');
    PlacesPage.tabPhotosOnPlacePage.click();
    PlacesPage.buttonAddImages.click();
    dropFile(PlacesPage.inputFieldForImages, '/home/vs/Pictures/for_tests/1.png');
    dropFile(PlacesPage.inputFieldForImages, '/home/vs/Pictures/for_tests/2.tiff');
    dropFile(PlacesPage.inputFieldForImages, '/home/vs/Pictures/for_tests/3.jpg');
    dropFile(PlacesPage.inputFieldForImages, '/home/vs/Pictures/for_tests/4.jpeg');
    expect(PlacesPage.countOfImages.getText()).toEqual('Add all 3 photos');
    expect(PlacesPage.messageAboutExceptionUploadedImages.getText()).toEqual('Sorry, the system does not support the following files');
    expect(PlacesPage.messageAboutReasonExceptionUploadedImages.first().getText()).toEqual('Reason:');
    expect(PlacesPage.messageAboutReasonExceptionUploadedImages.last().getText()).toEqual('this format is not supported');
    PlacesPage.buttonAddUploadedImages.click();
    browser.sleep(5000);
    PlacesPage.buttonNotApprovedImages.click();
    browser.wait(EC.textToBePresentInElement(PlacesPage.buttonShowAllLoadedImages, '3'), 60000);
    PlacesPage.buttonShowAllLoadedImages.click();
    expect(PlacesPage.currentLoadedImages.count()).toBe(3);
  });
  it('editing information in Place', ()=>{
    //browser.get('/cms/admin/place/583c1e1f07a7873ce4ea455b');
    PlacesPage.buttonEditCurrentPlace.click();
    AbstractPage.sendQueryWithoutClear(PlacesPage.fieldNameOfPlace, ' edited');
    AbstractPage.sendQueryWithoutClear(PlacesPage.fieldDescriptionOfPlace, ' edited');
    AbstractPage.sendQueryWithoutClear(PlacesPage.fieldIncomeOfPlace, '11');
    PlacesPage.buttonSavePlace.click();
    browser.sleep(2000);
    expect(PlacesPage.h2OnPlacePage.getText()).toContain('Edited');
  });
  it('image tagging in Place', ()=>{
  //  browser.get('/cms/place/583e9e9d96ee48200a291820');
    PlacesPage.tabImageTaggingOnPlacePage.click();
    for (let i = 0; i < 50; i++) {
      PlacesPage.listThingsInImageTagging.get(i).click();
      PlacesPage.listPhotosInImageTagging.get(Math.floor(Math.random()*2)).click();
      browser.sleep(300);
      expect(PlacesPage.headerInPopUp.getText()).toContain('Do you want to tag this image as');
      PlacesPage.buttonOkInTaggingSomeImage.click();
      PlacesPage.saveButtonInPopup.click();

    }
    });
  xit('deleting test places to trash', ()=>{
   // browser.get('/cms/admin/places');
    AbstractPage.sendQuery(PlacesPage.searchInPlacePage, 'Test Place');
    browser.sleep(2000);
    PlacesPage.listPlaceNames.each((element) => {
      browser.sleep(500);
      element.getText().then((NamePlaceInList)=>{
        if (NamePlaceInList.includes('Test Place')){
          PlacesPage.buttonRemovePlace.get(0).click();
          expect(PlacesPage.headerInPopUp.getText()).toEqual('Delete place');
          PlacesPage.buttonOKForRemovingPlace.click();
      }
      });
    });
  });
  xit('deleting test places from trash', ()=>{
    //browser.get('/cms/admin/places');
    //browser.sleep(2000);
    PlacesPage.selectTypeOfStatusPlaces.click();
    PlacesPage.selectTrashFromDropDown.click();
    AbstractPage.sendQuery(PlacesPage.searchInPlacePage, 'Test Place');
    browser.sleep(2000);
    PlacesPage.listPlaceNames.each((element) => {
      element.getText().then((NamePlaceInList)=>{
        if (NamePlaceInList.includes('Test Place')){
          PlacesPage.buttonRemovePlace.get(0).click();
          browser.sleep(2000);
          expect(PlacesPage.headerInPopUp.getText()).toEqual('Delete place');
          PlacesPage.buttonOKForRemovingPlace.click();
        }
      });
    });
  });
});
