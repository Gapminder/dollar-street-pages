import { browser } from 'protractor';

import { MatrixPage } from '../../Pages';

describe('Matrix Page: Zoom buttons', () => {
  beforeEach(async () => {
    await browser.get(MatrixPage.url);
  });
  //Blocked due #1311
  xit('Decrease zoom', async () => {
    const IMAGES_IN_ROW = 4;
    expect(await MatrixPage.zoomDecrease.isEnabled()).toBeTruthy();
    await MatrixPage.zoomDecrease.click();

    expect(await MatrixPage.imagesContainer.getAttribute('class')).toContain(`column-${IMAGES_IN_ROW + 1}`);
    expect(await browser.getCurrentUrl()).toContain(`zoom=${IMAGES_IN_ROW + 1}`);
  });
  //Blocked due #1311
  xit('Increase zoom', async () => {
    const IMAGES_IN_ROW = 4;
    await MatrixPage.zoomIncrease.click();

    expect(await MatrixPage.imagesContainer.getAttribute('class')).toContain(`column-${IMAGES_IN_ROW - 1}`);
    expect(await browser.getCurrentUrl()).toContain(`zoom=${IMAGES_IN_ROW - 1}`);
  });
});
