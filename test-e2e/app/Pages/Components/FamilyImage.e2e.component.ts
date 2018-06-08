import { ElementFinder, $$ } from 'protractor';

import { MatrixImagePreview } from './MatrixImagePreview.e2e.component';
import { FamilyImagePreview } from './FamilyImagePreview.e2e.component';
import { MatrixPage, FamilyPage } from '..';
import { waitForPresence, waitForVisible } from '../../Helpers/commonHelper';

export class FamilyImage {
  rootSelector: ElementFinder;
  type: string;

  constructor(url: string, index: number) {
    if (url === MatrixPage.url) {
      this.type = 'matrix';
      waitForVisible(MatrixPage.imagesContainer);
      this.rootSelector = $$('matrix-images div[class*="image-content"]').get(index);
    } else {
      this.type = 'family';
      this.rootSelector = $$('.family-image').get(index);
    }
  }

  get income(): ElementFinder {
    waitForPresence(this.rootSelector.$('.place-image-box-income'));
    return this.rootSelector.$('.place-image-box-income');
  }

  get image(): ElementFinder {
    return this.type === 'matrix' ? this.rootSelector.$('.cell-inner') : this.rootSelector;
  }

  async getIncome(): Promise<number> {
    return this.income.getText().then(income => Number(income.replace(/\D/g, '')));
  }

  async getCurrency(): Promise<string> {
    return this.income.getText().then(income => income.replace(/\d/g, '').trim());
  }

  async getCountryName(): Promise<string> {
    return await this.rootSelector.$('.place-image-box-country').getText();
  }

  async getImageSrc(): Promise<string> {
    const pattern = /^.*(\/)/; // grab everything to last slash

    const imageUrl = await this.image.getCssValue('background-image');

    return imageUrl.replace('url("', '').match(pattern)[0];
  }

  async openPreview(): Promise<any> {
    await this.rootSelector.click();

    if (this.type === 'matrix') {
      return new MatrixImagePreview();
    } else {
      return new FamilyImagePreview();
    }
  }

  async click(): Promise<void> {
    await this.rootSelector.click();
  }
}
