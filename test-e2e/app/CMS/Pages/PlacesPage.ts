'use strict';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor';

export class PlacesPage {
  public static infoButton:ElementFinder = $('button[ng-click*="editAboutData"]');
  public static inputFieldForData:ElementFinder = $('textarea');
  public static saveButtonInPopup:ElementFinder = $('button[ng-click*="save"]');
  public static addPlaceButton:ElementFinder = $('button[ng-click*="confirmForm"]');
  public static radioButtonsRequiredFields:ElementArrayFinder = element.all(by.css('div[class="form-group"] div[class="col-lg-12"] label'));
  public static inputFieldForFullName:ElementFinder = $('input[placeholder="Name"]');
  public static inputFieldForEmail:ElementFinder = $('input[placeholder="Email"]');
  public static submitButton:ElementFinder = $('button[type="submit"]');
  public static fieldNameOfPlace:ElementFinder = $('input[placeholder="Name of place"]');
  public static fieldDescriptionOfPlace:ElementFinder = $('textarea[placeholder="Description"]');
  public static fieldIncomeOfPlace:ElementFinder = $('input[placeholder="Income"]');
  public static selectCountryOfPlace:ElementFinder = element.all(by.css('.ui-select-placeholder.text-muted.ng-binding')).get(1);
  public static inputCountryOfPlace:ElementFinder = $('input[placeholder="Country"]');
  public static selectCurrentCountryOfPlace:ElementFinder = $('.ui-select-highlight');
  public static selectPlaceTypeOfPlace:ElementFinder = element.all(by.css('.ui-select-placeholder.text-muted.ng-binding')).get(2);
  public static selectCurrentTypeOfPlace:ElementFinder = element.all(by.css('.ng-binding.ng-scope')).get(3);
  public static selectPhotographerOfPlace:ElementFinder = element.all(by.css('.ui-select-placeholder.text-muted.ng-binding')).get(3);
  public static selectCurrentPhotographerOfPlace:ElementFinder = element.all(by.css('.ui-select-choices-row-inner')).get(0);
  public static buttonSavePlace:ElementFinder = $('.btn.btn-w-m.btn-primary');
  public static tabPhotosOnPlacePage:ElementFinder = element.all(by.css('a[tab-heading-transclude=""]')).first();
  public static tabImageTaggingOnPlacePage:ElementFinder = element.all(by.css('a[tab-heading-transclude=""]')).get(1);
  public static tabQuestionareOnPlacePage:ElementFinder = element.all(by.css('a[tab-heading-transclude=""]')).get(2);
  public static tabFamilyInfoOnPlacePage:ElementFinder = element.all(by.css('a[tab-heading-transclude=""]')).get(3);
  public static editButtonOnFamilyInfoOnPlacePage:ElementFinder = $('button[ng-click="familyInfoForm.$show()"]');
  public static inputFamilyInfoSummaryOnPlacePage:ElementFinder = element.all(by.css('.editable-input.form-control.ng-pristine.ng-untouched.ng-valid')).first();
  public static inputFamilyInfoOnPlacePage:ElementFinder = element.all(by.css('.editable-input.form-control.ng-pristine.ng-untouched.ng-valid')).last();
  public static buttonSaveFamilyInfoOnPlacePage:ElementFinder = element.all(by.css('button[ng-disabled="familyInfoForm.$waiting"]')).first();
  public static buttonCancelFamilyInfoOnPlacePage:ElementFinder = element.all(by.css('button[ng-disabled="familyInfoForm.$waiting"]')).last();
  public static textInFamilyInfoSummary:ElementFinder = $('span[editable-textarea="place.familyInfoSummary"]');
  public static textInFamilyInfo:ElementFinder = $('span[editable-textarea="place.familyInfo"]');
  public static editButtonInQuestionare:ElementFinder = element.all(by.css('button[ng-click="tableform.$show()"]')).first();
  public static inputFieldsInQuestionare:ElementArrayFinder = element.all(by.css('input[class="editable-input form-control ng-pristine ng-untouched ng-valid"]'));
  public static saveButtonInQuestionare:ElementFinder = element.all(by.css('button[ng-disabled="tableform.$waiting"]')).first();
  public static textInQuestionare:ElementArrayFinder = element.all(by.css('span[e-placeholder="Text"]'));
  public static buttonAddImages:ElementFinder = $('button[tooltip*="Add images"]');
  public static inputFieldForImages:ElementFinder = $('.photo-area-box');
  public static countOfImages:ElementFinder = $('.photo-area-count');
  public static buttonAddUploadedImages:ElementFinder = $('button[ng-click="uploaderMedia()"]');
  public static messageAboutExceptionUploadedImages:ElementFinder = $('.row>p');
  public static messageAboutReasonExceptionUploadedImages:ElementArrayFinder = element.all(by.css('.photo-area-reason.col-md-6'));
  public static buttonShowAllLoadedImages:ElementFinder = element.all(by.css('button[ng-click="addLoadedImages()"]')).first();
  public static currentLoadedImages:ElementArrayFinder = element.all(by.css('.img-responsive'));
  public static buttonNotApprovedImages:ElementFinder = $('li[active="activeNoApprovedTab"] a');
  public static buttonEditCurrentPlace:ElementFinder = $('button[tooltip="Edit Current Place"]');
  public static h2OnPlacePage:ElementFinder = $('h2[class="ng-binding"]');
  public static searchInPlacePage:ElementFinder = $('#search');
  public static listPlaceNames:ElementArrayFinder = element.all(by.css('b[class="ng-binding"]'));
  public static buttonRemovePlace:ElementArrayFinder = element.all(by.css('.btn.btn-danger.btn-circle.btn-sm'));
  public static headerInPopUp:ElementFinder = $('.modal-title.ng-binding');
  public static buttonOKForRemovingPlace:ElementFinder = $('.btn.btn-w-m.btn-danger');
  public static selectTypeOfStatusPlaces:ElementFinder = $('select[ng-model="filterList"]');
  public static selectTrashFromDropDown:ElementFinder = $('option[value="trash"]');
  public static listThingsInImageTagging:ElementArrayFinder = element.all(by.css('li[ng-click*="selectThing"]'));
  public static listPhotosInImageTagging:ElementArrayFinder = element.all(by.css('div[ng-style*="image.image"]'));
  public static buttonOkInTaggingSomeImage:ElementFinder = $('button[ng-click*="ok"]');
  public static buttonSaveTaggingSomeImage:ElementFinder = $('button[ng-click*="save"]');



}
