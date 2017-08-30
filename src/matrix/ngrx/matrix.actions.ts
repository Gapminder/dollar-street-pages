import { Action } from '@ngrx/store';

export const UPDATE_MATRIX: string = 'UPDATE_MATRIX';
export const ACTIVATE_PIN_MODE: string = 'ACTIVATE_PIN_MODE';
export const OPEN_INCOME_FILTER: string = 'OPEN_INCOME_FILTER';
export const OPEN_QUICK_GUIDE: string = 'OPEN_QUICK_GUIDE';
export const ADD_PLACE_TO_SET: string = 'ADD_PLACE_TO_SET';
export const REMOVE_PLACE_FROM_SET: string = 'REMOVE_PLACE_FROM_SET';
export const GET_MATRIX_IMAGES: string = 'GET_MATRIX_IMAGES';
export const GET_MATRIX_IMAGES_SUCCESS: string = 'GET_MATRIX_IMAGES_SUCCESS';
export const PROCESS_MATRIX_IMAGES: string = 'PROCESS_MATRIX_IMAGES';

export class UpdateMatrix implements Action {
    readonly type = UPDATE_MATRIX;

    constructor(public payload: boolean) {}
}

export class ActivatePinMode implements Action {
    readonly type = ACTIVATE_PIN_MODE;

    constructor(public payload: boolean) {}
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

export class GetMatrixImages implements Action {
    readonly type = GET_MATRIX_IMAGES;

    constructor(public payload: string) {}
}

export class GetMatrixImagesSuccess implements Action {
    readonly type = GET_MATRIX_IMAGES_SUCCESS;

    constructor(public payload: any) {}
}

export class ProcessMatrixImages implements Action {
    readonly type = PROCESS_MATRIX_IMAGES;

    constructor(public payload: any) {}
}

export type Actions =
    | UpdateMatrix
    | OpenIncomeFilter
    | ActivatePinMode
    | OpenQuickGuide
    | GetMatrixImages
    | GetMatrixImagesSuccess
    | ProcessMatrixImages;
