import { Action } from '@ngrx/store';

export const GET_STREET_SETTINGS: string = 'GET_STREET_SETTINGS';
export const GET_STREET_SETTINGS_SUCCESS = 'GET_STREET_SETTINGS_SUCCESS';

export class GetStreetSettings implements Action {
    readonly type = GET_STREET_SETTINGS;
}

export class GetStreetSettingsSuccess implements Action {
    readonly type = GET_STREET_SETTINGS_SUCCESS;

    constructor(public payload: any) {}
}

export type Actions =
    | GetStreetSettingsSuccess
    | GetStreetSettings;
