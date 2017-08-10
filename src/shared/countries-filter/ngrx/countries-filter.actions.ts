import { Action } from '@ngrx/store';

export const SELECT_COUNTRIES: string = 'SELECE_COUNTRIES';
export const GET_COUNTRIES_FILTER: string = 'GET_COUNTRIES_FILTER';
export const GET_COUNTRIES_FILTER_SUCCESS: string = 'GET_COUNTRIES_FILTER_SUCCESS';

export class SelectCountries implements Action {
    readonly type = SELECT_COUNTRIES;

    constructor(public payload: any) {}
}

export class GetCountriesFilter implements Action {
    readonly type = GET_COUNTRIES_FILTER;

    constructor(public payload: string) {}
}

export class GetCountriesFilterSuccess implements Action {
    readonly type = GET_COUNTRIES_FILTER_SUCCESS;

    constructor(public payload: any) {}
}

export type Actions =
    | SelectCountries
    | GetCountriesFilter
    | GetCountriesFilterSuccess;
