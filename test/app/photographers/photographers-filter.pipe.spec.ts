import { it, describe } from '@angular/core/testing';
import { PhotographersFilter } from '../../../src/photographers/photographers-filter.pipe';
import { photographers } from './mocks/data';

let countryList = photographers.data.countryList;
let photographersList = photographers.data.photographersList;

describe('Photographers filer pipe', () => {
  let pipe: PhotographersFilter = new PhotographersFilter();

  it('firs test transform', () => {
    expect(pipe.transform(countryList, 'Alb', countryList, true).length).toEqual(1);
    expect(pipe.transform(countryList, 'Alb', countryList, true).length).toEqual(1);
    expect(pipe.transform(photographersList, 'Alb', countryList, false).length).toEqual(1);
    expect(pipe.transform(countryList, '', countryList, false).length).toEqual(4);
    expect(pipe.transform(photographersList, '', countryList, false).length).toEqual(4);
    expect(pipe.transform(countryList, 'Joh', countryList, true).length).toEqual(2);
    expect(pipe.transform(photographersList, 'Joh', countryList, false).length).toEqual(2);
  });
});
