import {SearchFilter} from '../../../../app/common/search/thing-filter.pipe';
import {initData} from './mocks/data';

describe('SearchFilter', () => {
  let pipe:SearchFilter = new SearchFilter();
  it(' transform', () => {
    expect(pipe.transform(initData.data.categories, ['Albania', 'name', true]).length).toEqual(0);
    expect(pipe.transform(initData.data.categories, ['salt', 'name', true]).length).toEqual(1);
    expect(pipe.transform(initData.data.countries, ['Bangladesh', 'country']).length).toEqual(1);
    expect(pipe.transform(initData.data.countries, ['Ban', 'country']).length).toEqual(2);
  });
});
