import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class ThingsFilterActions {
    public static SELECT_THING: string = 'SELECT_THING';
    selectThing(data: any): Action {
        return {
            type: ThingsFilterActions.SELECT_THING,
            payload: data
        };
    }

    public static GET_THINGS_FILTER: string = 'GET_THINGS_FILTER';
    getThingsFilter(query: string): Action {
        return {
            type: ThingsFilterActions.GET_THINGS_FILTER,
            payload: query
        };
    }

    public static GET_THINGS_FILTER_SUCCESS: string = 'GET_THINGS_FILTER_SUCCESS';
    getThingsFilterSuccess(data: any): Action {
        return {
            type: ThingsFilterActions.GET_THINGS_FILTER_SUCCESS,
            payload: data
        };
    }
}
