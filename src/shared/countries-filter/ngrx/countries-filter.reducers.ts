import * as CountriesFilterActions from './countries-filter.actions';
import { CountriesFilterState } from '../../../interfaces';

export const initialState: CountriesFilterState = {
  countriesFilter: null,
  selectedCountries: null,
  selectedRegions: null,
};

export function countriesFilterReducer(state: CountriesFilterState = initialState, action: CountriesFilterActions.Actions): CountriesFilterState {
    switch (action.type) {
        case CountriesFilterActions.SET_SELECTED_COUNTRIES:
            return Object.assign({}, state, {selectedCountries: action.payload});

        case CountriesFilterActions.SET_SELECTED_REGIONS:
            return Object.assign({}, state, {selectedRegions: action.payload});

        case CountriesFilterActions.GET_COUNTRIES_FILTER_SUCCESS:
            return Object.assign({}, state, {countriesFilter: action.payload});

        default:
            return state;
    }
}
