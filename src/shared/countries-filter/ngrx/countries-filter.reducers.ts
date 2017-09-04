import * as CountriesFilterActions from './countries-filter.actions';

export interface State {
    countriesFilter: any;
    selectedCountries: any;
};

export const initialState: State = {
    countriesFilter: null,
    selectedCountries: null
};

export function countriesFilterReducer(state: any = initialState, action: CountriesFilterActions.Actions): any {
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
