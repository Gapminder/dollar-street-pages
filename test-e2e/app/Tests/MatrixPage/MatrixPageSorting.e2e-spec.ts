import { browser } from 'protractor';
import { MatrixPage } from '../../Pages';
import { Street, FamilyImage } from '../../Pages/Components';

describe('Matrix Page: Sorting on matrix', () => {
  beforeEach(async () => {
    await browser.get(MatrixPage.url);
  });

  it('Images resorted when move toddlers', async () => {
    const IMAGES_IN_ROW = 4;

    const firstFamilyInRow = MatrixPage.getFamily(0);
    const lastFamilyInRow = MatrixPage.getFamily(IMAGES_IN_ROW);
    const street: Street = new Street();

    // move both toddlers
    const lowIncome = await street.moveLeftToddler();
    const highIncome = await street.moveRightToddler();

    const firstFamilyIncome = await firstFamilyInRow.getIncome();
    const lastFamilyIncome = await lastFamilyInRow.getIncome();

    // check that displayed countries are in chosen range
    expect(firstFamilyIncome).toBeGreaterThanOrEqual(lowIncome);
    expect(lastFamilyIncome).toBeLessThanOrEqual(highIncome);

    // chec that sorting in row is correct
    expect(await checkImagesOrder(IMAGES_IN_ROW));
  });

  it('Images resorted on zoom out', async () => {
    const IMAGES_IN_ROW = 4;
    await MatrixPage.zoomDecrease.click();
    await MatrixPage.zoomDecrease.click();

    expect(await checkImagesOrder(IMAGES_IN_ROW + 2));
  });

  it('Images resorted on zoom in', async () => {
    const IMAGES_IN_ROW = 4;
    await MatrixPage.zoomIncrease.click();

    expect(await checkImagesOrder(IMAGES_IN_ROW - 1));
  });
});

async function checkImagesOrder(rowLength: number): Promise<void> {
  for (let i = 1; i < rowLength; ++i) {
    const nextFamily = MatrixPage.getFamily(i);
    const previousFamily = MatrixPage.getFamily(i - 1);

    const income1 = await previousFamily.getIncome();
    const income2 = await nextFamily.getIncome();
    expect(await nextFamily.getIncome()).toBeGreaterThan(await previousFamily.getIncome());
  }
}
