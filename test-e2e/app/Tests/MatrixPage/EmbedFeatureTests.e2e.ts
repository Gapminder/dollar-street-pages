import { $, browser, ExpectedConditions as EC } from 'protractor';

import { MatrixPage } from '../../Pages/MatrixPage';
import { FooterPage } from '../../Pages/FooterPage';
import { AbstractPage } from '../../Pages/AbstractPage';
import { PinnedContainer } from '../../Pages/Components/PinnedContainer.e2e.component';

let imageToSelect: number;
const pinnedContainer: PinnedContainer = new PinnedContainer();

describe('Embed feature', () => {

  beforeEach(() => {
    imageToSelect = AbstractPage.getRandom();
    browser.get('matrix');

    browser.actions().mouseMove(MatrixPage.familyLink.get(10)).perform();
    AbstractPage.waitForCssAnimation();
    FooterPage.heartIcon.click();
  });

  it(`Click on Heart icon add image to pin area`, () => {
    selectImageToShare(imageToSelect);

    const selectedImage = MatrixPage.familyImages.get(imageToSelect).getCssValue('background-image');

    pinnedContainer.getImageSource(0)
      .then(pinnedImage => {
        expect(pinnedContainer.pinnedImages.count()).toEqual(1);
        expect(selectedImage).toEqual(`url("${pinnedImage}")`);
      });
  });

  it(`Houses added to pinned street when picture added`, () => {
    selectImageToShare(imageToSelect);

    expect(pinnedContainer.housesOnStreet.count()).toEqual(1);
  });

  it(`Families texted on the top of pinned items`, () => {
    const firstSelectedImage = MatrixPage.countryInImageDescription.get(imageToSelect).getText();
    const secondSelectedImage = MatrixPage.countryInImageDescription.get(imageToSelect + 1).getText();

    selectImageToShare(imageToSelect);
    selectImageToShare(imageToSelect + 1);

    const pinnedHeaderText = MatrixPage.pinHeader.getText().then(headerText => headerText.trim());

    expect(pinnedHeaderText).toContain(firstSelectedImage);
    expect(pinnedHeaderText).toContain(secondSelectedImage);
  });

  it(`Zoom buttons won't affect the sharing`, () => {
    MatrixPage.zoomDecrease.click();
    selectImageToShare(imageToSelect);

    const selectedImage = MatrixPage.familyImages.get(imageToSelect).getCssValue('background-image');
    pinnedContainer.getImageSource(0)
      .then(pinnedImage => {
        expect(pinnedContainer.pinnedImages.count()).toEqual(1);
        expect(selectedImage).toEqual(`url("${pinnedImage}")`);
      });
  });
});

describe('Embed feature:: Share view', () => {
  beforeEach(() => {
    imageToSelect = AbstractPage.getRandom();
    browser.get('matrix');

    browser.actions().mouseMove(MatrixPage.familyLink.get(10)).perform();
    AbstractPage.waitForCssAnimation();
    FooterPage.heartIcon.click();

    // selected two images to proceed sharing
    selectImageToShare(imageToSelect);
    selectImageToShare(imageToSelect + 1);
  });

  it(`Share button appear when more than 2 images selected`, () => {
    expect(pinnedContainer.shareBtn.isDisplayed()).toBeTruthy('share button');
  });

  it(`Deselect image from pinned area`, () => {
    pinnedContainer.deselectImage(0);

    expect(pinnedContainer.pinnedImages.count()).toBe(1);
    expect(pinnedContainer.housesOnStreet.count()).toBe(1, 'houses on street');
  });

  it(`Cancel sharing remove pinContainer and leads back to default Matrix page`, () => {
    pinnedContainer.shareBtn.click();
    browser.wait(EC.invisibilityOf($('.loader-content')), 10000);
    pinnedContainer.cancelBtn.click();

    expect(pinnedContainer.rootSelector.isPresent()).toBeFalsy('pin container');
    expect(pinnedContainer.streetChart.isPresent()).toBeFalsy('pinned street');
    expect(MatrixPage.imagesContainer.isDisplayed()).toBeTruthy('images container');
  });
});

function selectImageToShare(index: number): void {
  /**
   * scroll element into view
   * this is not super generic approach to scroll elements
   * the reason to do it this way
   * is that pinned container hovers the top of the page
   * it will only scroll the elements lying beneath the pin container
   * to make them visible
   */

  browser.executeScript(element => {
    element.scrollIntoView(false);
  }, MatrixPage.heartIconsOnImage.get(index));

  // hover image to reveal the heart icon
  browser.actions().mouseMove(MatrixPage.familyLink.get(index)).perform();

  // click on the heart icon
  MatrixPage.heartIconsOnImage.get(index).click();
}
