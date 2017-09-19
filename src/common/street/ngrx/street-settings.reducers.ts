import * as StreetSettingsActions from './street-settings.actions';

export interface State {
  // streetSettings: any;
};

export const initialState: State = {
  // streetSettings: null
};

export function streetSettingsReducer(state: any, action: StreetSettingsActions.Actions): any {
    switch (action.type) {
        case StreetSettingsActions.GET_STREET_SETTINGS_SUCCESS:
            // return Object.assign({}, state, {streetSettings: action.payload});
            return action.payload;

        default:
            return state;
    }
}
