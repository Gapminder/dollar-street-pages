import { Action } from '@ngrx/store';
import {Injectable} from '@angular/core';

@Injectable()
export class AppActions {
    public static GET_STREET_SETTINGS: string = 'GET_STREET_SETTINGS';
    getStreetSettings(): Action {
        return {
            type: AppActions.GET_STREET_SETTINGS
        };
    }

    public static GET_STREET_SETTINGS_SUCCESS = 'GET_STREET_SETTINGS_SUCCESS';
    getStreetSettingsSuccess(data: any): Action {
        return {
            type: AppActions.GET_STREET_SETTINGS_SUCCESS,
            payload: data
        };
  }
}
