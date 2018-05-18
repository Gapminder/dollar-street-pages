import { browser } from 'protractor';

import { getRandomNumber } from '../../Helpers';
import { MatrixPage, FamilyPage, CountryPage, AbstractPage } from '../../Pages';
import { MatrixImagePreview, FamilyImage, WelcomeWizard, FamilyImagePreview } from '../../Pages/Components';
import { scrollIntoView, waitForLoader, isInViewport } from '../../Helpers/commonHelper';

let random: number;
let familyImage: FamilyImage;

async function goToFamilyFromMatrix(familyIndex = 0): Promise<void> {
  await browser.get(MatrixPage.url);
  await WelcomeWizard.disableWizard();
  await MatrixPage.waitForSpinner();
  const family: FamilyImage = MatrixPage.getFamily();

  const familyPreview = await family.openPreview();
  await familyPreview.visitThisHomeBtn.click();
}

describe('Family Page: Image Preview', () => {
  const NUMBER_OF_LINKS_TO_TEST = 2;

  beforeEach(async () => {
    random = getRandomNumber();

    await goToFamilyFromMatrix(random);
    await waitForLoader();
  });

  it(`Image preview section is displayed for image`, async () => {
    for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
      const image = FamilyPage.getFamilyImage(getRandomNumber());
      const imagePreview: FamilyImagePreview = await image.openPreview();

      expect(await imagePreview.isDisplayed()).toBeTruthy(`${i} imagePreview is not visible`);
    }
  });

  it(`Open image preview and check image src for image`, async () => {
    for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
      /**
       * click on image in matrix page should open preview for that image
       * loop is needed to check specific issue when image doesn't update
       * second time
       */
      const image = FamilyPage.getFamilyImage(getRandomNumber());
      const imagePreview: FamilyImagePreview = await image.openPreview();

      const imageSrc = await image.getImageSrc();
      const previewSrc = await imagePreview.getImageSrc();

      await expect(imageSrc).toEqual(previewSrc);
    }
  });

  it(`Store state in URL for image`, async () => {
    for (let i = 0; i < NUMBER_OF_LINKS_TO_TEST; i++) {
      const _random = await getRandomNumber();
      /**
       * click on image and switching between images should store activeHouse in url
       */
      const urlBefore = await browser.getCurrentUrl();

      await FamilyPage.getFamilyImage(_random).openPreview();

      const urlAfter = await browser.getCurrentUrl();

      await expect(urlBefore).not.toEqual(urlAfter);
      await expect(urlAfter).toContain(`activeImage=${_random + 1}`, `${i} image is not stored in URL`);
    }
  });

  it('imagePreview scrolled into view when opens', async () => {
    const FIRST_FAMILY = 9;
    const SECOND_FAMILY = 2;
    let imagePreview: FamilyImagePreview;

    const firstImage = FamilyPage.getFamilyImage(FIRST_FAMILY);
    imagePreview = await firstImage.openPreview();
    expect(await imagePreview.isInViewport()).toBeTruthy('First ImagePreview should be visible');

    const secondImage = FamilyPage.getFamilyImage(SECOND_FAMILY);
    imagePreview = await secondImage.openPreview();
    await imagePreview.isInViewport();
    expect(await imagePreview.isInViewport()).toBeTruthy('Second ImagePreview should be visible');
  });

  it('close selected image by click on it', async () => {
    familyImage = FamilyPage.getFamilyImage(random);
    await familyImage.click();
    await familyImage.click();

    expect(await new MatrixImagePreview().isPresent()).toBeFalsy('Image preview should not exist');
    expect(await browser.getCurrentUrl()).not.toContain(`activeHouse`);
  });

  it('close selected image by click on "X" icon', async () => {
    familyImage = FamilyPage.getFamilyImage(random);

    const familyImagePreview = await familyImage.openPreview();
    await familyImagePreview.close();

    expect(await familyImagePreview.isPresent()).toBeFalsy('Image preview should not exist');
  });

  it('open fullSize preview by click on image', async () => {
    familyImage = FamilyPage.getFamilyImage(random);

    // check images src to make sure that correct image has been opened
    const familyImageSrc = await familyImage.getImageSrc();
    const familyImagePreview = await familyImage.openPreview();
    await familyImagePreview.openFullSizePreview();

    const fullSizeImageSrc = await familyImagePreview.getFullSizeImageSrc();

    expect(await familyImagePreview.fullSizeImage.isDisplayed()).toBeTruthy('FullSize image should be displayed');
    expect(familyImageSrc).toEqual(fullSizeImageSrc);
  });

  it('"Thing in Country" button leads to matrix page with active filters', async () => {
    familyImage = FamilyPage.getFamilyImage(random);

    const familyImagePreview: FamilyImagePreview = await familyImage.openPreview();
    const thingNamePlural = await familyImagePreview.getThingNamePlural();
    const familyCountry = await FamilyPage.familyCountry.getText();

    await familyImagePreview.thingInCountryFilter.click();

    // fixme issue with angular sync. investigation is needed
    await browser.refresh();

    const url = await browser.getCurrentUrl();

    expect(url).toContain('matrix?');
    expect(url).toContain(`thing=${encodeURIComponent(thingNamePlural)}`);
    expect(url).toContain(`countries=${familyCountry}`);

    expect(await MatrixPage.filterByThing.getText()).toEqual(thingNamePlural);
    expect(await MatrixPage.filterByCountry.getText()).toEqual(familyCountry);
  });

  it('"Thing in Region" button leads to matrix page with active filters', async () => {
    familyImage = FamilyPage.getFamilyImage(random);

    const familyImagePreview: FamilyImagePreview = await familyImage.openPreview();
    const thingNamePlural = await familyImagePreview.getThingNamePlural();
    const familyCountry = await FamilyPage.familyCountry.getText();
    const familyRegion = await FamilyPage.getFamilyRegion();

    await familyImagePreview.thingInRegionFilter.click();

    // fixme issue with angular sync. investigation is needed
    await browser.refresh();

    const url = await browser.getCurrentUrl();

    expect(url).toContain('matrix?');
    expect(url).toContain(`thing=${encodeURIComponent(thingNamePlural)}`);
    expect(await MatrixPage.filterByThing.getText()).toContain(thingNamePlural);
    expect(await MatrixPage.filterByCountry.getText()).toEqual(familyRegion);
  });

  it('"Thing in the World" button leads to matrix page with active filters', async () => {
    familyImage = FamilyPage.getFamilyImage(random);

    const familyImagePreview: FamilyImagePreview = await familyImage.openPreview();
    const thingNamePlural = await familyImagePreview.getThingNamePlural();

    await familyImagePreview.thingInWorldFilter.click();

    // fixme issue with angular sync. investigation is needed
    await browser.refresh();

    const url = await browser.getCurrentUrl();

    expect(url).toContain('matrix?');
    expect(url).toContain(`thing=${encodeURIComponent(thingNamePlural)}`);
    expect(url).not.toContain(`countries`);
    expect(await MatrixPage.filterByThing.getText()).toContain(thingNamePlural);
    expect(await MatrixPage.filterByCountry.getText()).toEqual('the World');
  });

  it('Photographer name leads to photographer page', async () => {
    familyImage = FamilyPage.getFamilyImage(random);

    const familyImagePreview: FamilyImagePreview = await familyImage.openPreview();
    const photographerName = await familyImagePreview.photographerName.getText();
    await scrollIntoView(familyImagePreview.photographerName);
    await familyImagePreview.photographerName.click();

    expect(await browser.getCurrentUrl()).toContain('photographer');
    expect(await CountryPage.countryName.getText()).toContain(photographerName); // refactor: move this into header
  });
});
