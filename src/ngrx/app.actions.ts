import { Action } from '@ngrx/store';

import { EventEmitter } from 'events';

import { AppState, AppStateInterface } from './app.state';

export function setAction(action: string, payload?: any): Action {
    return {
                type: action,
                payload: payload
           } as Action;
}

export class AppActions {
    public static SET_STREET_SETTINGS: string = 'SET_STREET_SETTINGS';

    public static actionsEvent: EventEmitter = new EventEmitter();

    public static setStreetSettings(currentState: AppStateInterface, payload: AppStateInterface): AppStateInterface {
        let newState: AppState = new AppState();

        newState.streetSettings = payload.streetSettings;

        let assignedNewState: AppStateInterface = Object.assign({}, currentState, newState) as AppStateInterface;

        AppActions.actionsEvent.emit(AppActions.SET_STREET_SETTINGS, assignedNewState);

        return assignedNewState;
    }
}
