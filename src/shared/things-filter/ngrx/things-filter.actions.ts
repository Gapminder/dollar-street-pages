import { Action } from '@ngrx/store';

export const SELECT_THING: string = 'SELECT_THING';
export const GET_THINGS_FILTER: string = 'GET_THINGS_FILTER';
export const GET_THINGS_FILTER_SUCCESS: string = 'GET_THINGS_FILTER_SUCCESS';

export class SelectThing implements Action {
    readonly type = SELECT_THING;

    constructor(public payload: any) {}
}

export class GetThingsFilter implements Action {
    readonly type = GET_THINGS_FILTER;

    constructor(public payload: string) {}
}

export class GetThingsFilterSuccess implements Action {
    readonly type = GET_THINGS_FILTER_SUCCESS;

    constructor(public payload: any) {}
}

export type Actions =
    | SelectThing
    | GetThingsFilter
    | GetThingsFilterSuccess;
