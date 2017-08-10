import * as CountriesFilterActions from './countries-filter.actions';

export interface State {

};

export const initialState: State = {

};

export function countriesFilterReducer(state: any, action: CountriesFilterActions.Actions): any {
    switch (action.type) {
        case CountriesFilterActions.SELECT_COUNTRIES:
            return action.payload;

        case CountriesFilterActions.GET_COUNTRIES_FILTER_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}
