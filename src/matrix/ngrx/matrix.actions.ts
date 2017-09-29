import { Action } from '@ngrx/store';

export const UPDATE_MATRIX: string = 'UPDATE_MATRIX';
export const SET_PIN_MODE: string = 'SET_PIN_MODE';
export const SET_PIN_COLLAPSED: string = 'SET_PIN_COLLAPSED';
export const SET_TIME_UNIT: string = 'SET_TIME_UNIT';
export const OPEN_INCOME_FILTER: string = 'OPEN_INCOME_FILTER';
export const OPEN_QUICK_GUIDE: string = 'OPEN_QUICK_GUIDE';
export const ADD_PLACE_TO_SET: string = 'ADD_PLACE_TO_SET';
export const REMOVE_PLACE_FROM_SET: string = 'REMOVE_PLACE_FROM_SET';
export const GET_PINNED_PLACES: string = 'GET_PINNED_PLACES';
export const GET_PINNED_PLACES_SUCCESS: string = 'GET_PINNED_PLACES_SUCCESS';
export const SET_PINNED_PLACES: string = 'SET_PINNED_PLACES';
export const GET_MATRIX_IMAGES: string = 'GET_MATRIX_IMAGES';
export const SET_MATRIX_IMAGES: string = 'SET_MATRIX_IMAGES';
export const GET_MATRIX_IMAGES_SUCCESS: string = 'GET_MATRIX_IMAGES_SUCCESS';
export const SET_SHOW_LABELS: string = 'SET_SHOW_LABELS';
export const GET_TIME_UNITS: string = 'GET_TIME_UNITS';
export const GET_TIME_UNITS_SUCCESS: string = 'GET_TIME_UNITS_SUCCESS';
export const GET_CURRENCY_UNITS: string = 'GET_CURRENCY_UNITS';
export const GET_CURRENCY_UNITS_SUCCESS: string = 'GET_CURRENCY_UNITS_SUCCESS';
export const SET_CURRENCY_UNIT: string = 'SET_CURRENCY_UNIT';

export class UpdateMatrix implements Action {
    readonly type = UPDATE_MATRIX;
    constructor(public payload: boolean) {}
}

export class SetPinMode implements Action {
    readonly type = SET_PIN_MODE;
    constructor(public payload: boolean) {}
}

export class SetPinCollapsed implements Action {
    readonly type = SET_PIN_COLLAPSED;
    constructor(public payload: boolean) {}
}

export class SetTimeUnit implements Action {
    readonly type = SET_TIME_UNIT;
    constructor(public payload: string) {}
}

export class OpenIncomeFilter implements Action {
    readonly type = OPEN_INCOME_FILTER;
    constructor(public payload: boolean) {}
}

export class OpenQuickGuide implements Action {
    readonly type = OPEN_QUICK_GUIDE;
    constructor(public payload: boolean) {}
}

export class AddPlaceToSet implements Action {
    readonly type = ADD_PLACE_TO_SET;
    constructor(public payload: any) {}
}

export class RemovePlaceFromSet implements Action {
    readonly type = REMOVE_PLACE_FROM_SET;
    constructor(public payload: any) {}
}

export class GetPinnedPlaces implements Action {
    readonly type = GET_PINNED_PLACES;
    constructor(public payload: any) {}
}

export class GetPinnedPlacesSuccess implements Action {
    readonly type = GET_PINNED_PLACES_SUCCESS;
    constructor(public payload: any) {}
}

export class SetPinnedPlaces implements Action {
    readonly type = SET_PINNED_PLACES;
    constructor(public payload: any) {}
}

export class GetMatrixImages implements Action {
    readonly type = GET_MATRIX_IMAGES;
    constructor(public payload: string) {}
}

export class SetMatrixImages implements Action {
    readonly type = SET_MATRIX_IMAGES;
    constructor(public payload: any) {}
}

export class GetMatrixImagesSuccess implements Action {
    readonly type = GET_MATRIX_IMAGES_SUCCESS;
    constructor(public payload: any) {}
}

export class SetShowLabels implements Action {
    readonly type = SET_SHOW_LABELS;
    constructor(public payload: boolean) {}
}

export class GetTimeUnits implements Action {
    readonly type = GET_TIME_UNITS;
    constructor() {}
}

export class GetTimeUnitsSuccess implements Action {
    readonly type = GET_TIME_UNITS_SUCCESS;
    constructor(public payload: any) {}
}

export class GetCurrencyUnits implements Action {
    readonly type = GET_CURRENCY_UNITS;
    constructor() {}
}

export class GetCurrencyUnitsSuccess implements Action {
    readonly type = GET_CURRENCY_UNITS_SUCCESS;
    constructor(public payload: any) {}
}

export class SetCurrencyUnit implements Action {
    readonly type = SET_CURRENCY_UNIT;
    constructor(public payload: any) {}
}

export type Actions =
    | UpdateMatrix
    | SetPinMode
    | SetPinCollapsed
    | OpenIncomeFilter
    | OpenQuickGuide
    | AddPlaceToSet
    | RemovePlaceFromSet
    | GetPinnedPlaces
    | GetPinnedPlacesSuccess
    | SetPinnedPlaces
    | GetMatrixImages
    | SetMatrixImages
    | GetMatrixImagesSuccess
    | SetShowLabels
    | SetTimeUnit
    | GetTimeUnitsSuccess
    | GetCurrencyUnitsSuccess
    | SetCurrencyUnit;
