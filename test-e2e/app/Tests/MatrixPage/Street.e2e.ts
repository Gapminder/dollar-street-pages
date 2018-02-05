import { browser } from 'protractor';

import { AbstractPage } from '../../Pages/AbstractPage';
import { MatrixPage } from '../../Pages/MatrixPage';
import { WelcomeWizard } from '../../Pages/Components/WelcomeWizard.e2e.component';
import { Street } from '../../Pages/Components/Street.e2e.component';
import { isInViewport } from '../../Helpers/isInViewport';

const street: Street = new Street();

describe('Matrix Page: big section -like in Google', () => {

  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });

  beforeEach(() => {
    AbstractPage.logoIcon.click();
  });

  it(`Move left toddler`, () => {
    const streetChartLengthBefore = street.getRoadLength();

    street.moveLeftToddler();

    const streetChartLengthAfter = street.getRoadLength();

    streetChartLengthBefore.then(lengthBefore => {
      const expectedLength = lengthBefore - street.toddlerFootStep;

      /**
       * toddler moves slightly to the left on mouseDown
       * can't predict exact position, so check for +-10 px
       */
      expect(streetChartLengthAfter).toBeGreaterThan(expectedLength - 10);
      expect(streetChartLengthAfter).toBeLessThan(expectedLength + 10);
    });
  });

  it(`Move right toddler`, () => {
    const streetChartLengthBefore = street.getRoadLength();

    street.moveRightToddler();

    const streetChartLengthAfter = street.getRoadLength();

    streetChartLengthBefore.then(lengthBefore => {
      const chartLengthBefore = lengthBefore - street.toddlerFootStep;

      /**
       * toddler moves slightly to the left on mouseDown
       * can't predict exact position, so check for +-10 px
       */
      expect(streetChartLengthAfter).toBeGreaterThan(chartLengthBefore - 10);
      expect(streetChartLengthAfter).toBeLessThan(chartLengthBefore + 10);
    });
  });

  it(`Toddlers values revive after page refresh`, () => {
    const leftToddlerValue = street.moveLeftToddler();
    const rightToddlerValue = street.moveRightToddler();

    leftToddlerValue.then(leftToddler => {
      expect(browser.getCurrentUrl()).toContain(`lowIncome=${leftToddler}`, 'LowIncome fails to save');
    });
    rightToddlerValue.then(rightToddler => {
      expect(browser.getCurrentUrl()).toContain(`highIncome=${rightToddler}`, 'HighIncome fails to save');
    });

    browser.refresh();

    leftToddlerValue.then(leftToddler => {
      expect(browser.getCurrentUrl()).toContain(`lowIncome=${leftToddler}`, 'LowIncome after refresh');
    });
    rightToddlerValue.then(rightToddler => {
      expect(browser.getCurrentUrl()).toContain(`highIncome=${rightToddler}`, 'HighIncome after refresh');
    });
  });
});
