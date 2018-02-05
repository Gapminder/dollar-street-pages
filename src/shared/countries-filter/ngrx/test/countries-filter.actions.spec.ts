import * as fromCountriesFilterActions from '../countries-filter.actions';
import { Continent, Country } from '../../../../interfaces';

// TODO there is no GET_COUNTRIES_FILTER case in reducer??
describe('Countries-filter actions', () => {

  describe('Should create action', () => {
    it('SetSelectedCountries', () => {
      const payload = 'Country Name';
      const action = new fromCountriesFilterActions.SetSelectedCountries(payload);

      expect({...action}).toEqual({
        type: fromCountriesFilterActions.SET_SELECTED_COUNTRIES,
        payload
      });
    });

    it('SetSelectedRegions', () => {
      const payload = 'World';
      const action = new fromCountriesFilterActions.SetSelectedRegions(payload);

      expect({...action}).toEqual({
        type: fromCountriesFilterActions.SET_SELECTED_REGIONS,
        payload
      });
    });

    it('GetCountriesFilter', () => {
      const payload = 'thing=Families&countries=World&regions=World';
      const action = new fromCountriesFilterActions.GetCountriesFilter(payload);

      expect({...action}).toEqual({
        type: fromCountriesFilterActions.GET_COUNTRIES_FILTER,
        payload
      });
    });

    it('GetCountriesFilterSuccess', () => {
      const payload = payloadWithRedions;
      const action = new fromCountriesFilterActions.GetCountriesFilterSuccess(payload);

      expect({...action}).toEqual({
        type: fromCountriesFilterActions.GET_COUNTRIES_FILTER_SUCCESS,
        payload
      });
    });
  });
});

const payloadWithRedions: Continent[] = [
  {
    countries: [
      {
        country: 'Burkina Faso',
        empty: false,
        originName: 'Burkina Faso',
        originRegionName: 'Africa',
        region: 'Africa'
      }
    ],
    empty: false,
    originRegionName: 'Africa',
    region: 'Africa'
  }
];
