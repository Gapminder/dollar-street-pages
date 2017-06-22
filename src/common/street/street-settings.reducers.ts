import { ActionReducer, Action } from '@ngrx/store';
import { StreetSettingsActions } from './street-settings.actions';

// export const streetSettingsReducer: ActionReducer<any> = (state: any, action: Action) => {
export function streetSettingsReducer(state: any, action: Action): any {
    switch (action.type) {
        case StreetSettingsActions.GET_STREET_SETTINGS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}