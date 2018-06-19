import { MapPage } from '../../Pages';
import { Header } from '../../Pages/Components';
import { DataProvider } from '../../Data/DataProvider';

describe('Map Page: Filters', () => {
  beforeEach(async () => {
    await MapPage.open();
  });

  it('Check clickability filters', async () => {
    await MapPage.getFilter('things').click();
    expect(await Header.thingsFilterContainer.isDisplayed()).toBeTruthy();
  });

  it('Map page title', async () => {
    expect(await MapPage.mapTitle.getText()).toEqual('on the World map');
  });

  it('Text in Search popup, and country count', async () => {
    for (const [name, { query , count}] of Object.entries(DataProvider.mapPageQueries)) {
      await MapPage.filterByThing.click();
      await MapPage.searchInFilterByThing.sendKeys(query);
      await MapPage.thingsFilterFirsResult.click();

      expect(await MapPage.selectedFilter.getText()).toEqual(query);
      expect(await MapPage.getCurrentCuntryListCount()).toEqual(count);
    }
  });
});
