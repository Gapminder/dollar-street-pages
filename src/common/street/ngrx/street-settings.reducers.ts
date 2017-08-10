import * as StreetSettingsActions from './street-settings.actions';

export interface State {

};

export const initialState: State = {

};

export function streetSettingsReducer(state: any, action: StreetSettingsActions.Actions): any {
    switch (action.type) {
        case StreetSettingsActions.GET_STREET_SETTINGS_SUCCESS:
            return (action as StreetSettingsActions.GetStreetSettingsSuccess).payload;

        default:
            return state;
    }
}
