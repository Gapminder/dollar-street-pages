import { Action } from '@ngrx/store';

export const SET_QUERY: string = 'SET_QUERY';
export const SET_THING: string = 'SET_THING';
export const OPEN_INCOME_FILTER: string = 'OPEN_INCOME_FILTER';
export const OPEN_QUICK_GUIDE: string = 'OPEN_QUICK_GUIDE';

export class SetQuery implements Action {
    readonly type = SET_QUERY;

    constructor(public payload: string) {}
}

export class SetThing implements Action {
    readonly type = SET_THING;

    constructor(public payload: any) {}
}

export class OpenIncomeFilter implements Action {
    readonly type = OPEN_INCOME_FILTER;

    constructor(public payload: boolean) {}
}

export class OpenQuickGuide implements Action {
    readonly type = OPEN_QUICK_GUIDE;

    constructor(public payload: boolean) {}
}

export type Actions =
    | SetQuery
    | SetThing
    | OpenIncomeFilter
    | OpenQuickGuide;
