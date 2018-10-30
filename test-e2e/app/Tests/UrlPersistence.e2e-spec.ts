import { browser } from 'protractor';

import { MatrixPage } from '../Pages';
import { Header } from '../Pages/Components';

describe('Storing state in URL', () => {
  beforeAll(async () => {
    await browser.get(MatrixPage.url);
    await MatrixPage.waitForSpinner();
  });

  it(`Image selected after the page reload`, async () => {
    await MatrixPage.familyLink.get(1).click();

    const urlBefore = await browser.getCurrentUrl();
    await MatrixPage.waitForSpinner();
    const selectedImageBefore = await MatrixPage.bigImageFromBigSection.getAttribute('src');

    await browser.refresh();
    await MatrixPage.waitForSpinner();
    const selectedImageAfter = await MatrixPage.bigImageFromBigSection.getAttribute('src');
    const urlAfter = await browser.getCurrentUrl();

    expect(urlBefore).toEqual(urlAfter);
    expect(selectedImageBefore).toEqual(selectedImageAfter);
  });

  it('Unknown language should be reset to default', async () => {
    const DEFAULT_LANGUAGE = 'English';
    await browser.get(`${MatrixPage.url}?lang=unknwn`);

    expect(await Header.language.getText()).toEqual(DEFAULT_LANGUAGE);
    expect(await MatrixPage.imagesContainer.isDisplayed()).toBeTruthy('images list loaded');
  });
});
