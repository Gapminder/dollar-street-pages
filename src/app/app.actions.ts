import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class AppActions {
    public static SET_QUERY: string = 'SET_QUERY';
    setQuery(query: string): Action {
        return {
            type: AppActions.SET_QUERY,
            payload: query
        };
    }

    public static SET_THING: string = 'SET_THING';
    setThing(data: any): Action {
        return {
            type: AppActions.SET_THING,
            payload: data
        };
    }

    public static OPEN_INCOME_FILTER: string = 'OPEN_INCOME_FILTER';
    openIncomeFilter(data: boolean): Action {
        return {
            type: AppActions.OPEN_INCOME_FILTER,
            payload: data
        };
    }

    public static OPEN_QUICK_GUIDE: string = 'OPEN_QUICK_GUIDE';
    openQuickGuide(data: boolean): Action {
        return {
            type: AppActions.OPEN_QUICK_GUIDE,
            payload: data
        };
    }

    /*public static SET_HOVER_PLACE: string = 'SET_HOVER_PLACE';
    setHoverPlace(data: any): Action {
        return {
            type: AppActions.SET_HOVER_PLACE,
            payload: data
        };
    }*/
}
