import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class CountriesFilterActions {
    public static SELECT_COUNTRIES: string = 'SELECE_COUNTRIES';
    selectCountries(data: any): Action {
        return {
            type: CountriesFilterActions.SELECT_COUNTRIES,
            payload: data
        };
    }

    public static GET_COUNTRIES_FILTER: string = 'GET_COUNTRIES_FILTER';
    getCountriesFilter(query: string): Action {
        return {
            type: CountriesFilterActions.GET_COUNTRIES_FILTER,
            payload: query
        };
    }

    public static GET_COUNTRIES_FILTER_SUCCESS: string = 'GET_COUNTRIES_FILTER_SUCCESS';
    getCountriesFilterSuccess(data: any): Action {
        return {
            type: CountriesFilterActions.GET_COUNTRIES_FILTER_SUCCESS,
            payload: data
        };
    }
}
