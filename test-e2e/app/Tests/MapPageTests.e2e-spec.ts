import { browser } from 'protractor';

import { MapPage } from '../Pages';

xdescribe('Map Page Tests', () => {
  beforeAll(async () => {
    await browser.get(MapPage.url);
  });

  it('Click on hover, check pop-up with family info', async () => {
    const mapMarker = await MapPage.markers.first();
    await browser.actions().mouseMove(mapMarker).perform();

    // add test attributes to markers on map

    /** test cases:
     * 1. hover marker with one family
     *    click on it
     * 2. hover marker with more then one family
     *    click on see all families
     * 3. click on 'All faimlies' in the left panel
     * 4. click on single photo in the left panel
     * 5. check currency and income in the left panel
     * 6. check currnecy and income in markers popups
     */

  });
});
