import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class StreetSettingsActions {
    public static NGRX_INIT: string = '@ngrx/store/init';
    ngRxInit(): Action {
        return {
            type: StreetSettingsActions.NGRX_INIT
        };
    }

    public static GET_STREET_SETTINGS_SUCCESS = 'GET_STREET_SETTINGS_SUCCESS';
    getStreetSettingsSuccess(data: any): Action {
        return {
            type: StreetSettingsActions.GET_STREET_SETTINGS_SUCCESS,
            payload: data
        };
    }
}
