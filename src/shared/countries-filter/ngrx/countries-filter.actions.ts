import { Action } from '@ngrx/store';

export const SET_SELECTED_COUNTRIES: string = 'SET_SELECTED_COUNTRIES';
export const SET_SELECTED_REGIONS: string = 'SET_SELECTED_REGIONS';
export const GET_COUNTRIES_FILTER: string = 'GET_COUNTRIES_FILTER';
export const GET_COUNTRIES_FILTER_SUCCESS: string = 'GET_COUNTRIES_FILTER_SUCCESS';

export class SetSelectedCountries implements Action {
    readonly type = SET_SELECTED_COUNTRIES;

    constructor(public payload: any) {}
}

export class SetSelectedRegions implements Action {
    readonly type = SET_SELECTED_REGIONS;

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
    | SetSelectedCountries
    | SetSelectedRegions
    | GetCountriesFilter
    | GetCountriesFilterSuccess;
