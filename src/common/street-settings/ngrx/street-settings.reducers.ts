import * as StreetSettingsActions from './street-settings.actions';

export interface State {
  streetSettings: any;
  //showStreetAttrs: boolean;
};

export const initialState: State = {
  streetSettings: null
  //showStreetAttrs: false
};

export function streetSettingsReducer(state: any = initialState, action: StreetSettingsActions.Actions): State {
    switch (action.type) {
        case StreetSettingsActions.GET_STREET_SETTINGS_SUCCESS: {
            return Object.assign({}, state, {streetSettings: action.payload});
        }

        /*case StreetSettingsActions.SHOW_STREET_ATTRS: {
            return Object.assign({}, state, {showStreetAttrs: action.payload});
        }*/

        default:
            return state;
    }
}
