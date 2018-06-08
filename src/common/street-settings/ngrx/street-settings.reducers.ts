import * as StreetSettingsActions from './street-settings.actions';
import { DrawDividersInterface, StreetSettingsState } from '../../../interfaces';

export const initialState: StreetSettingsState = {
  streetSettings: {} as DrawDividersInterface
};

export function streetSettingsReducer(state: StreetSettingsState = initialState, action: StreetSettingsActions.Actions): StreetSettingsState {
    switch (action.type) {
        case StreetSettingsActions.GET_STREET_SETTINGS_SUCCESS: {
          const streetSetting = Object.assign({}, state.streetSettings, action.payload);

          return { streetSettings: streetSetting };
        }

        case StreetSettingsActions.UPDATE_STREET_FILTERS: {
          state.streetSettings.filters = action.payload;

          return Object.assign({}, state);
        }

        default:
            return state;
    }
}
