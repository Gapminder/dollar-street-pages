import { browser } from 'protractor';

import using = require('jasmine-data-provider');

import { MatrixPage } from '../../Pages/MatrixPage';
import { DataProvider } from '../../Data/DataProvider';
import { HomePage } from '../../Pages/HomePage';
import { CountryPage } from '../../Pages/CountryPage';
import { AbstractPage } from '../../Pages/AbstractPage';

const pattern = /^.*(\/)/; // grab everything to last slash
let random: number;

describe('Matrix Page: big section -like in Google', () => {
  const NUMBER_OF_LINKS_TO_TEST = 3;

  beforeEach(() => {
    random = AbstractPage.getRandom();

    browser.get('matrix');
  });

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Big section elements present for ${i} image`, () => {
      browser.actions().mouseMove(MatrixPage.familyLink.get(random).getWebElement()).click().perform();
      using(DataProvider.matrixBigSection, (data: any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });
      using(DataProvider.matrixBigSectionHower, (data: any) => {
        expect(data.element().isPresent()).toBeTruthy();
      });

      /**
       * check that country name match in preview and description
       */
      const familyCountry = MatrixPage.familyLink.get(random)
        .$$(HomePage.thingNameOnImg.first().locator().value).get(1) // dynamic locator to maintain the loop
        .getText();
      const countryInDescription = MatrixPage.familyName.getText();

      expect(countryInDescription).toContain(familyCountry);
    });
  }

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Open image preview for ${i} image`, () => {
      /**
       * click on image in matrix page should open preview for that image
       */
      const familyImageSrc = MatrixPage.familyLink.get(random).getCssValue('background-image')
        .then(attr => attr.replace('url("', ''))
        .then(url => url.match(pattern)[0]);

      MatrixPage.familyLink.get(random).click();

      const previewSrc = MatrixPage.bigImageFromBigSection.getAttribute('src')
        .then(url => url.match(pattern)[0]);

      expect(familyImageSrc).toEqual(previewSrc);
    });
  }

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Store state in URL for ${i} image`, () => {
      /**
       * click on image and swithing between images should store activeHouse in url
       */
      const urlBefore = browser.getCurrentUrl();

      MatrixPage.familyLink.get(random).click();

      const urlAfter = browser.getCurrentUrl();

      expect(urlBefore).not.toEqual(urlAfter);
      expect(urlAfter).toContain(`&activeHouse=${random + 1}`);
    });
  }

  it('close selected image by click on it', () => {
    const image = MatrixPage.familyLink.get(random);
    image.click();
    image.click();

    expect(MatrixPage.bigImageFromBigSection.isPresent()).toBeFalsy();
  });

  it('close selected image by click on "X" icon', () => {
    MatrixPage.familyLink.get(random).click();
    MatrixPage.previewCloseBtn.click();

    expect(MatrixPage.bigImageFromBigSection.isPresent()).toBeFalsy();
  });

  it('open "fancy" preview by click on image', () => {
    const familyImageSrc = MatrixPage.familyLink.get(random).getCssValue('background-image')
      .then(attr => attr.replace('url("', ''))
      .then(url => url.match(pattern)[0]);
    MatrixPage.familyLink.get(random).click();
    MatrixPage.bigImageFromBigSection.click();
    MatrixPage.waitForSpinner();

    const fancyImageSrc = MatrixPage.fancyPreview.getCssValue('background-image')
      .then(attr => attr.replace('url("', ''))
      .then(url => url.match(pattern)[0]);

    expect(MatrixPage.fancyPreview.isDisplayed()).toBeTruthy();
    expect(familyImageSrc).toEqual(fancyImageSrc);
  });

  it('"Visit this home" button leads to family page', () => {
    MatrixPage.familyLink.get(random).click();

    const previewImageSrc = MatrixPage.bigImageFromBigSection.getAttribute('src')
      .then(src => src.match(pattern)[0]);

    MatrixPage.visitThisHomeBtn.click();

    const familyPhotoSrc = HomePage.familyPhoto.getAttribute('src')
      .then(src => src.match(pattern)[0]);

    expect(previewImageSrc).toEqual(familyPhotoSrc);
    expect(browser.getCurrentUrl()).toContain('family?');
    // TODO add check to verify that this is actually home page
  });

  it('"All families" button activate filter by country', () => {
    const countryName = MatrixPage.countryInImageDescription.get(random).getText()
    MatrixPage.familyLink.get(random).click();

    MatrixPage.allFamiliesInCountryBtn.click();

    expect(MatrixPage.filterByCountry.getText()).toEqual(countryName);
    MatrixPage.countryInImageDescription.each(element => {
      expect(element.getText()).toEqual(countryName);
    });
  });

  it('Click on minimap leads to country page', () => {
    const countryName = MatrixPage.countryInImageDescription.get(random).getText();
    MatrixPage.familyLink.get(random).click();
    MatrixPage.minimap.click();

    expect(browser.getCurrentUrl()).toContain('country');
    expect(CountryPage.countryName.getText()).toEqual(countryName);
  });

  it('Photographer name leads to photographer page', () => {
    MatrixPage.familyLink.get(random).click();
    browser.executeScript('arguments[0].scrollIntoView(true)', MatrixPage.bigImageFromBigSection.getWebElement());

    const photographerName = MatrixPage.photographerName.getText();
    MatrixPage.photographerName.click();

    expect(browser.getCurrentUrl()).toContain('photographer');
    expect(CountryPage.countryName.getText()).toContain(photographerName);
  });
});
