import { $, $$, browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class Header {
  static thingsFilter: ElementFinder = $('.things-filter-button-content');
  static countryFilter: ElementFinder = $('.countries-filter-button');
  static countryOption: ElementArrayFinder = $$('.country-content');

  static incomeFilter: ElementFinder = $('.income-title.filter');
  static currencyBtn: ElementFinder = $$('.control-section').first();
  static timeUnitBtn: ElementFinder = $$('.control-section').last();
  static incomeOkBtn: ElementFinder = $('.ok-button');

  static countryOkBtn: ElementFinder = $('.ok-img');
  static showAllCountriesBtn: ElementFinder = $('.pointer-container');
  static searchCounties: ElementFinder = $$('.form-control').last();
  static countryInResult: ElementFinder = $$('.country-content').first(); // TODO make it works for array if needed

  static filterByCountry(...countries: string[]): void {
    this.countryFilter.click();
    countries.forEach(country => element(by.cssContainingText('.country-content', country)).click());
    this.countryOkBtn.click();
  }

  static filterByAllCountries(): void {
    this.countryFilter.click();
    this.showAllCountriesBtn.click();
    this.countryOkBtn.click();
  }

  static searchInCountryFilter(country: string): void {
    this.countryFilter.click();
    this.searchCounties.clear();
    this.searchCounties.sendKeys(country);
    this.countryInResult.click();
    this.countryOkBtn.click();
  }

  static filterByIncome(currency: string): void {
    this.incomeFilter.click();
    this.currencyBtn.click();
    element(by.cssContainingText('.dropdown-item', currency)).click();
    this.incomeOkBtn.click();
  }

}
