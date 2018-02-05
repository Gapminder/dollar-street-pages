import * as fromCountriesFilterActions from '../countries-filter.actions';
import * as fromCountriesFiltertReducers from '../countries-filter.reducers';
import { Continent } from '../../../../interfaces';

describe('Countries-filter reducers', () => {

  describe('default state', () => {
    it('should return default state', () => {
      const {initialState} = fromCountriesFiltertReducers;
      const action = {} as any;
      const state = fromCountriesFiltertReducers.countriesFilterReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('SET_SELECTED_COUNTRIES action', () => {
    it('change selectedCountries in state', () => {
      const payload = 'Country Name';
      const {initialState} = fromCountriesFiltertReducers;
      const action = new fromCountriesFilterActions.SetSelectedCountries(payload);
      const state = fromCountriesFiltertReducers.countriesFilterReducer(initialState, action);

      expect(state.selectedCountries).toEqual(payload);
      expect(state.countriesFilter).toEqual(null);
      expect(state.selectedRegions).toEqual(null);
    });
  });

  describe('SET_SELECTED_REGIONS action', () => {
    it('change selectedRegions in state', () => {
      const payload = 'World';
      const {initialState} = fromCountriesFiltertReducers;
      const action = new fromCountriesFilterActions.SetSelectedRegions(payload);
      const state = fromCountriesFiltertReducers.countriesFilterReducer(initialState, action);

      expect(state.selectedCountries).toEqual(null);
      expect(state.countriesFilter).toEqual(null);
      expect(state.selectedRegions).toEqual(payload);
    });
  });

  describe('GET_COUNTRIES_FILTER_SUCCESS action', () => {
    it('change countriesFilter in state', () => {
      const payload = payloadWithRedions;
      const {initialState} = fromCountriesFiltertReducers;
      const action = new fromCountriesFilterActions.GetCountriesFilterSuccess(payload);
      const state = fromCountriesFiltertReducers.countriesFilterReducer(initialState, action);

      expect(state.selectedCountries).toEqual(null);
      expect(state.countriesFilter).toEqual(payload as any); // TODO what type ??
      expect(state.selectedRegions).toEqual(null);
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
