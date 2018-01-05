import { $, browser, ExpectedConditions as EC, protractor } from 'protractor';
import { MatrixPage } from '../../Pages/MatrixPage';
import { FooterPage } from '../../Pages/FooterPage';
import { AbstractPage } from '../../Pages/AbstractPage';
import { promise } from 'selenium-webdriver';

let random: number;

describe('Embed feature', () => {

  beforeEach(() => {
    random = AbstractPage.getRandom();
    browser.get('matrix');

    browser.actions().mouseMove(MatrixPage.familyLink.get(10)).perform();
    AbstractPage.waitForCssAnimation();
    FooterPage.heartIcon.click();
  });

  it(`Click on Heart icon add image to pin area`, () => {
    selectImageToShare(random);

    const selectedImage = MatrixPage.familyImage.get(random).getCssValue('background-image');
    MatrixPage.pinnedImages.first().getAttribute('src')
      .then(pinnedImage => {
        expect(MatrixPage.pinnedImages.count()).toEqual(1);
        expect(selectedImage).toEqual(`url("${pinnedImage}")`);
      });
  });

  it(`Houses on pinned street`, () => {
    selectImageToShare(random);

    expect(MatrixPage.housesOnPinnedStreet.count()).toEqual(1);
  });

  it(`Families on the top of pinned items`, () => {
    const firstSelectedImage = MatrixPage.countryInImageDescription.get(random).getText();
    const secondSelectedImage = MatrixPage.countryInImageDescription.get(random + 1).getText();

    selectImageToShare(random);
    selectImageToShare(random + 1);

    const pinnedHeaderText = MatrixPage.pinHeader.getText().then(headerText => headerText.trim());

    expect(pinnedHeaderText).toContain(firstSelectedImage);
    expect(pinnedHeaderText).toContain(secondSelectedImage);
  });

  it(`Zoom buttons won't affect the sharing`, () => {
    MatrixPage.zoomDecrease.click();
    selectImageToShare(random);

    const selectedImage = MatrixPage.familyImage.get(random).getCssValue('background-image');
    MatrixPage.pinnedImages.first().getAttribute('src')
      .then(pinnedImage => {
        expect(MatrixPage.pinnedImages.count()).toEqual(1);
        expect(selectedImage).toEqual(`url("${pinnedImage}")`);
      });
  });

  describe('Share view', () => {
    beforeEach(() => {
      selectImageToShare(random);
      selectImageToShare(random + 1);
    });

    it(`Share button appear when more than 2 images selected`, () => {
      expect(MatrixPage.shareButton.isDisplayed()).toBeTruthy('share button');
    });

    it(`Deselect image from pinned area`, () => {
      MatrixPage.deselectImageBtns.first().click();

      expect(MatrixPage.pinnedImages.count()).toBe(1);
      expect(MatrixPage.housesOnPinnedStreet.count()).toBe(1, 'houses on street');
    });

    it(`Only pin container is displayed in Shared view`, () => {
      MatrixPage.shareButton.click();

      expect(MatrixPage.pinContainer.isDisplayed()).toBeTruthy('pin container');
      MatrixPage.pinnedImages.each(image => expect(image.isDisplayed()).toBeTruthy('pin images'));
      expect(MatrixPage.pinnedStreet.isDisplayed()).toBeTruthy('pinned street');
      // expect(MatrixPage.imagesContainer.isDisplayed()).toBeFalsy('images container'); // TODO it's overlap by pin container but protractor says that it's visible
    });

    it(`Cancel sharing`, () => {
      MatrixPage.shareButton.click();
      browser.wait(EC.invisibilityOf($('.loader-content')), 10000);
      MatrixPage.cancelSharingBtn.click();

      expect(MatrixPage.pinContainer.isPresent()).toBeFalsy('pin container');
      expect(MatrixPage.pinnedStreet.isPresent()).toBeFalsy('pinned street');
      expect(MatrixPage.imagesContainer.isDisplayed()).toBeTruthy('images container');
    });

    it(`Images are exactly the same that were chosen`, () => {
      const imagesBefore = getImagesSrc();
      MatrixPage.shareButton.click();
      browser.wait(EC.invisibilityOf($('.loader-content')), 10000);

      const imagesAfter = getImagesSrc();

      expect(imagesBefore).toEqual(imagesAfter);
      expect(browser.getCurrentUrl()).toContain('embed=');
    });
  });

});

function getImagesSrc(): promise.Promise<string[]> {
  let imagesSrc: string[] = [];

  return MatrixPage.pinnedImages.each(image => {
    image.getCssValue('background-image')
      .then(backgroundSrc => imagesSrc.push(backgroundSrc));
  }).then(() => {
    return imagesSrc;
  });
}

function selectImageToShare(index: number): void {
  browser.executeScript(element => {
    element.scrollIntoView(false);
  }, MatrixPage.heartIconsOnImage.get(index));

  browser.actions().mouseMove(MatrixPage.familyLink.get(index)).perform();
  MatrixPage.heartIconsOnImage.get(index).click();
}
