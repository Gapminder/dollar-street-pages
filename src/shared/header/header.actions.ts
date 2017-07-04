import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderActions {
    public static SET_QUERY: string = 'SET_QUERY';
    setQuery(query: string): Action {
        return {
            type: HeaderActions.SET_QUERY,
            payload: query
        };
    }

    public static SET_THING: string = 'SET_THING';
    setThing(data: any): Action {
        return {
            type: HeaderActions.SET_THING,
            payload: data
        };
    }

    public static SET_HOVER_PLACE: string = 'SET_HOVER_PLACE';
    setHoverPlace(data: any): Action {
        return {
            type: HeaderActions.SET_HOVER_PLACE,
            payload: data
        };
    }
}
