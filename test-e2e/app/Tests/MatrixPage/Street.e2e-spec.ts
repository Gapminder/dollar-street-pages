import { browser, ExpectedConditions as EC } from 'protractor';

import { AbstractPage, MatrixPage } from '../../Pages';
import { Street, WelcomeWizard } from '../../Pages/Components';
import { waitForLoader } from '../../Helpers/commonHelper';

const street: Street = new Street();

describe('Matrix Page: Street chart', () => {
  beforeEach(async () => {
    await browser.get(MatrixPage.url);
    await waitForLoader();
  });

  it(`Move left toddler`, async () => {
    const streetChartLengthBefore = await street.getRoadLength();

    await street.moveLeftToddler();

    const streetChartLengthAfter = await street.getRoadLength();

    const expectedLength = streetChartLengthBefore - street.toddlerFootStep;

    /**
     * toddler moves slightly to the left on mouseDown
     * can't predict exact position, so check for +-20 px
     */
    expect(streetChartLengthAfter).toBeLessThanOrEqual(expectedLength + 30);
  });

  it(`Move right toddler`, async () => {
    const streetChartLengthBefore = await street.getRoadLength();

    await street.moveRightToddler();

    const streetChartLengthAfter = await street.getRoadLength();

    const chartLengthBefore = streetChartLengthBefore - street.toddlerFootStep;

    /**
     * toddler moves slightly to the left on mouseDown
     * can't predict exact position, so check for +-30 px
     */
    expect(streetChartLengthAfter).toBeLessThanOrEqual(chartLengthBefore + 30);
  });

  it(`Toddlers values revive after page refresh`, async () => {
    const leftToddlerValue = await street.moveLeftToddler();
    const rightToddlerValue = await street.moveRightToddler();

    expect(await browser.getCurrentUrl()).toContain(`lowIncome=${leftToddlerValue}`, 'LowIncome fails to save');
    expect(await browser.getCurrentUrl()).toContain(`highIncome=${rightToddlerValue}`, 'HighIncome fails to save');

    await browser.refresh();

    expect(browser.getCurrentUrl()).toContain(`lowIncome=${leftToddlerValue}`, 'LowIncome after refresh');
    expect(browser.getCurrentUrl()).toContain(`highIncome=${rightToddlerValue}`, 'HighIncome after refresh');
  });
});
