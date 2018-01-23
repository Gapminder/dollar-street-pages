import { browser } from 'protractor';
import { AbstractPage } from '../Pages/AbstractPage';
import { MatrixPage } from '../Pages/MatrixPage';

describe('Storing state in URL', () => {
  beforeAll(() => {
    browser.get('matrix');
  });

  it(`Image selected after the page reload: https://github.com/Gapminder/dollar-street-pages/issues/1185`, () => {
    MatrixPage.familyLink.get(1).click();

    const urlBefore = browser.getCurrentUrl();
    const selectedImageBefore = MatrixPage.bigImageFromBigSection.getAttribute('src');

    browser.refresh();

    const selectedImageAfter = MatrixPage.bigImageFromBigSection.getAttribute('src');
    const urlAfter = browser.getCurrentUrl();

    expect(urlBefore).toEqual(urlAfter);
    expect(selectedImageBefore).toEqual(selectedImageAfter);
  });

  it('Unknown language should be reset to default', () => {
    browser.get('matrix?lang=ru');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 10000, 'page loaded');

    expect(MatrixPage.imagesContainer.isDisplayed()).toBeTruthy('images list loaded');
  });

});
