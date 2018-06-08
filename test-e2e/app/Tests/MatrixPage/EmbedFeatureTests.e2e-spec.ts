import { browser } from 'protractor';

import { getRandomNumber } from '../../Helpers';

import { MatrixPage } from '../../Pages';
import { PinnedContainer, HamburgerMenu } from '../../Pages/Components';
import { waitForInvisibility } from '../../Helpers/commonHelper';

let imageToSelect: number;
const pinnedContainer: PinnedContainer = new PinnedContainer();

describe('Embed feature tests', () => {
  describe('Pin container tests', () => {
    beforeEach(async () => {
      imageToSelect = getRandomNumber();
      await browser.get(MatrixPage.url);
      await MatrixPage.waitForSpinner();
      await HamburgerMenu.openEmbedModal();
    });

    it(`Click on Heart icon add image to pin area`, async () => {
      await selectImageToShare(imageToSelect);

      const selectedImage = await MatrixPage.familyImages.get(imageToSelect).getCssValue('background-image');

      const pinnedImage = await pinnedContainer.getImageSource(0);
      expect(await pinnedContainer.pinnedImages.count()).toEqual(1);
      expect(selectedImage).toEqual(`url("${pinnedImage}")`);
    });

    it(`Houses added to pinned street when picture added`, async () => {
      await selectImageToShare(imageToSelect);

      expect(await pinnedContainer.housesOnStreet.count()).toEqual(1);
    });

    it(`Families texted on the top of pinned items`, async () => {
      const firstSelectedImage = await MatrixPage.countryInImageDescription.get(imageToSelect).getText();
      const secondSelectedImage = await MatrixPage.countryInImageDescription.get(imageToSelect + 1).getText();

      await selectImageToShare(imageToSelect);
      await selectImageToShare(imageToSelect + 1);

      const pinnedHeaderText = await MatrixPage.pinHeader.getText().then(headerText => headerText.trim());

      expect(pinnedHeaderText).toContain(firstSelectedImage);
      expect(pinnedHeaderText).toContain(secondSelectedImage);
    });

    it(`Zoom buttons won't affect the sharing`, async () => {
      await MatrixPage.zoomDecrease.click();
      await selectImageToShare(imageToSelect);

      const selectedImage = await MatrixPage.familyImages.get(imageToSelect).getCssValue('background-image');
      const pinnedImage = await pinnedContainer.getImageSource(0);

      expect(await pinnedContainer.pinnedImages.count()).toEqual(1);
      expect(selectedImage).toEqual(`url("${pinnedImage}")`);
    });
  });

  describe('Share view tests', () => {
    beforeEach(async () => {
      imageToSelect = getRandomNumber();
      await browser.get(MatrixPage.url);
      await MatrixPage.waitForSpinner();
      await HamburgerMenu.openEmbedModal();
      // selected two images to proceed sharing
      await selectImageToShare(imageToSelect);
      await selectImageToShare(imageToSelect + 1);
    });

    it(`Share button appear when more than 2 images selected`, async () => {
      expect(await pinnedContainer.shareBtn.isDisplayed()).toBeTruthy('share button');
    });

    it(`Deselect image from pinned area`, async () => {
      await pinnedContainer.deselectImage(0);

      expect(await pinnedContainer.pinnedImages.count()).toBe(1);
      // expect(pinnedContainer.housesOnStreet.count()).toBe(1, 'houses on street'); // TODO enable after fix: https://github.com/Gapminder/dollar-street-pages/issues/1121
    });

    it(`Cancel sharing remove pinContainer and leads back to default Matrix page`, async () => {
      await pinnedContainer.shareBtn.click();
      await waitForInvisibility(pinnedContainer.commonSpinerPinnedContainer);
      await pinnedContainer.cancelBtn.click();

      expect(await pinnedContainer.rootSelector.isPresent()).toBeFalsy('pin container');
      expect(await pinnedContainer.streetChart.isPresent()).toBeFalsy('pinned street');
      expect(await MatrixPage.imagesContainer.isDisplayed()).toBeTruthy('images container');
    });

    it(`Social Network icons, Copy Link, Cancel and Download btn are displayed `, async () => {
      await pinnedContainer.shareBtn.click();
      await waitForInvisibility(pinnedContainer.commonSpinerPinnedContainer);
      await waitForInvisibility(pinnedContainer.spinerPinnedContainer);

      expect(await pinnedContainer.getSocialNetworkIconArray().count()).toBe(4);
      expect(await pinnedContainer.buttonCopyLink.isDisplayed()).toBeTruthy();
      expect(await pinnedContainer.cancelBtn.isDisplayed()).toBeTruthy();
      expect(await pinnedContainer.buttonDownload.isDisplayed()).toBeTruthy();
    });

    it(`Title of sharing screen is Dollar Street`, async () => {
      await pinnedContainer.shareBtn.click();
      await waitForInvisibility(pinnedContainer.commonSpinerPinnedContainer);
      await waitForInvisibility(pinnedContainer.spinerPinnedContainer);

      expect(await pinnedContainer.titlePinnedContainer.getText()).toBe('Dollar Street');
    });
  });

  async function selectImageToShare(index: number): Promise<void> {
    /**
     * scroll element into view
     * this is not super generic approach to scroll elements
     * the reason to do it this way
     * is that pinned container hovers the top of the page
     * it will only scroll the elements lying beneath the pin container
     * to make them visible
     */
    // use scrollIntoView() instead

    const elementToScroll = await MatrixPage.heartIconsOnImage.get(index);
    await browser.executeScript(element => {
      element.scrollIntoView(false);
    }, elementToScroll);

    const familyLink = await MatrixPage.familyLink.get(index);
    // hover image to reveal the heart icon
    await browser
      .actions()
      .mouseMove(familyLink)
      .perform();

    // click on the heart icon
    await MatrixPage.heartIconsOnImage.get(index).click();
  }
});
