import { Action } from '@ngrx/store';

export const SET_QUERY: string = 'SET_QUERY';

export class SetQuery implements Action {
    readonly type = SET_QUERY;
    constructor(public payload: string) {}
}

export type Actions =
    | SetQuery;
