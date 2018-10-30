import { browser } from 'protractor';

import { getRandomNumber, isInViewport } from '../../Helpers';
import { MatrixPage, CountryPage, AbstractPage, FamilyPage } from '../../Pages';
import { MatrixImagePreview, FamilyImage, WelcomeWizard, FamilyImagePreview } from '../../Pages/Components';

const pattern = /^.*(\/)/; // grab everything to last slash
let random: number;
let family: FamilyImage;

describe('Matrix Page: Image Preview', () => {
  const NUMBER_OF_LINKS_TO_TEST = 4;

  beforeEach(async () => {
    random = getRandomNumber();

    await browser.get(MatrixPage.url);
    await WelcomeWizard.disableWizard();
    family = MatrixPage.getFamily(random);
  });

  it(`Image preview section is displayed for image`, async () => {
    for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
      family = MatrixPage.getFamily(getRandomNumber());

      const familyImagePreview: MatrixImagePreview = await family.openPreview();

      try {
        expect(await familyImagePreview.isDisplayed()).toBeTruthy();
      } catch (err) {
        if (err.name === 'NoSuchElementError') {
          throw new Error('FamilyImagePreview is not present on the page!');
        }
      }
      expect(await isInViewport(familyImagePreview.rootSelector)).toBeTruthy('imagePreview not in the viewport');

      /**
       * check that country name match in preview and description
       */
      const familyCountry = await family.getCountryName();
      const countryInDescription = await familyImagePreview.familyName.getText();

      expect(countryInDescription).toContain(familyCountry);
    }
  });

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Open image preview and check image src for ${i} image`, async () => {
      /**
       * click on image in matrix page should open preview for that image
       * loop is needed to check specific issue when image doesn't update
       * second time
       */
      const familyImageSrc = await family.getImageSrc();
      const previewSrc = await (await family.openPreview()).getImageSrc();

      expect(familyImageSrc).toEqual(previewSrc);
    });
  }

  for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
    it(`Store state in URL for ${i} image`, async () => {
      /**
       * click on image and switching between images should store activeHouse in url
       */
      const urlBefore = await browser.getCurrentUrl();

      await MatrixPage.getFamily(random).openPreview();

      const urlAfter = await browser.getCurrentUrl();

      expect(urlBefore).not.toEqual(urlAfter);
      expect(urlAfter).toContain(`activeHouse=${random + 1}`);
    });
  }

  it('imagePreview scrolled into view when opens', async () => {
    const FIRST_FAMILY = 2;
    const SECOND_FAMILY = 9;
    let imagePreview: MatrixImagePreview;

    const firstImage = MatrixPage.getFamily(FIRST_FAMILY);
    imagePreview = await firstImage.openPreview();
    expect(await imagePreview.isInViewport()).toBeTruthy('First ImagePreview should be visible');

    const secondImage = MatrixPage.getFamily(SECOND_FAMILY);
    imagePreview = await secondImage.openPreview();
    expect(await imagePreview.isInViewport()).toBeTruthy('Second ImagePreview should be visible');
  });

  it('close selected image by click on it', async () => {
    await family.click();
    await family.click();

    expect(await new MatrixImagePreview().isPresent()).toBeFalsy('Image preview should not exist');
    expect(await browser.getCurrentUrl()).not.toContain(`activeHouse`);
  });

  it('close selected image by click on "X" icon', async () => {
    const familyImagePreview: FamilyImagePreview = await family.openPreview();
    await familyImagePreview.close();

    expect(await familyImagePreview.isPresent()).toBeFalsy('Image preview should not exist');
  });

  xit('open fullSize preview by click on image', async () => {
    // check images src to make sure that correct image has been opened
    const familyImageSrc = await family.getImageSrc();
    const familyImagePreview = await family.openPreview();
    await familyImagePreview.openFullSizePreview();

    const fullSizeImageSrc = await familyImagePreview.getFullSizeImageSrc();

    expect(await familyImagePreview.fullSizeImage.isDisplayed()).toBeTruthy('FullSize image should be displayed');
    expect(familyImageSrc).toEqual(fullSizeImageSrc);
  });

  it('"Visit this home" button leads to family page', async () => {
    const familyImagePreview = await family.openPreview();
    const previewImageSrc = await familyImagePreview.getImageSrc();
    const placeId = await familyImagePreview.getPlaceId();

    await familyImagePreview.visitThisHomeBtn.click();

    const familyPhotoSrc = (await FamilyPage.familyPhoto.getAttribute('src')).match(pattern)[0]; // TODO refactor this

    await expect(previewImageSrc).toEqual(familyPhotoSrc);
    expect(await browser.getCurrentUrl()).toContain('family?');
    expect(await browser.getCurrentUrl()).toContain(`place=${placeId}`);
  });

  it('"All families" button activate filter by country', async () => {
    const countryName = await family.getCountryName();
    const familyImagePreview = await family.openPreview();
    await familyImagePreview.allFamiliesBtn.click();

    expect(await MatrixPage.filterByCountry.getText()).toEqual(countryName);
    // check that all displayed families have chosen country
    for (const imageIndex of (await MatrixPage.countryInImageDescription.asElementFinders_()).keys()) {
      const currentImage = MatrixPage.getFamily(Number(imageIndex));
      const actualCountryName = await currentImage.getCountryName();

      expect(actualCountryName).toEqual(countryName);
    }
  });

  it('Click on minimap leads to country page', async () => {
    const countryName = await family.getCountryName();
    const familyImagePreview = await family.openPreview();
    await familyImagePreview.miniMap.click();

    expect(await browser.getCurrentUrl()).toContain('country');
    expect(await CountryPage.countryName.getText()).toEqual(countryName);
  });

  it('Photographer name leads to photographer page', async () => {
    const familyImagePreview = await family.openPreview();
    const photographerName = await familyImagePreview.photographerName.getText();
    await familyImagePreview.photographerName.click();

    expect(await browser.getCurrentUrl()).toContain('photographer');
    expect(await CountryPage.countryName.getText()).toContain(photographerName); // refactor: move this into header
  });
});
