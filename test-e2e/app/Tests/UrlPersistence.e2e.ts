import { browser } from 'protractor';
import { AbstractPage } from '../Pages/AbstractPage';
import { MatrixPage } from '../Pages/MatrixPage';
import { StreetChart } from '../Pages/StreetChart.e2ecomponent';

describe('Storing state in URL', () => {
  beforeAll(() => {
    browser.get('matrix');
    browser.wait(AbstractPage.getEC().not(AbstractPage.getEC().visibilityOf(AbstractPage.loader)), 40000);
  });

  it(`Image selected after the page reload`, () => {
    MatrixPage.familyLink.get(1).click();

    const urlBefore = browser.getCurrentUrl();
    const selectedImageBefore = MatrixPage.bigImageFromBigSection.getAttribute('src');
    browser.refresh();

    const selectedImageAfter = MatrixPage.bigImageFromBigSection.getAttribute('src');
    const urlAfter = browser.getCurrentUrl();

    expect(urlBefore).toEqual(urlAfter);
    expect(selectedImageBefore).toEqual(selectedImageAfter);
  });

  it(`Street range save position`, () => {
    const streetChart: StreetChart = new StreetChart();
    const streetChartLengthBefore = streetChart.getRoadLength();

    streetChart.moveLeftToddler();

    const streetChartLengthAfter = streetChart.getRoadLength();

    streetChartLengthBefore.then(length => {
      const chartLengthBefore = length - streetChart.toddlerFootStep;

      /**
       * toddler moves slightly to the left on mouseDown
       * can't predict exact position, so check for +-10 px
       */
      expect(streetChartLengthAfter).toBeGreaterThan(chartLengthBefore - 10);
      expect(streetChartLengthAfter).toBeLessThan(chartLengthBefore + 10);
    });
  });
});
