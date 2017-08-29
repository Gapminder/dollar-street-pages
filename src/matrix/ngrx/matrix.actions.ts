import { Action } from '@ngrx/store';

export const GET_MATRIX_IMAGES: string = 'GET_MATRIX_IMAGES';
export const GET_MATRIX_IMAGES_SUCCESS: string = 'GET_MATRIX_IMAGES_SUCCESS';
export const UPDATE_MATRIX: string = 'UPDATE_MATRIX';
export const ACTIVATE_PIN_MODE: string = 'ACTIVATE_PIN_MODE';
export const OPEN_INCOME_FILTER: string = 'OPEN_INCOME_FILTER';
export const OPEN_QUICK_GUIDE: string = 'OPEN_QUICK_GUIDE';

export class GetMatrixImages implements Action {
    readonly type = GET_MATRIX_IMAGES;

    constructor(public payload: string) {}
}

export class GetMatrixImagesSuccess implements Action {
    readonly type = GET_MATRIX_IMAGES_SUCCESS;

    constructor(public payload: any) {}
}
///////////////////////////
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
////////////////////////////
export type Actions =
    | GetMatrixImages
    | GetMatrixImagesSuccess
    | UpdateMatrix
    | OpenIncomeFilter
    | ActivatePinMode
    | OpenQuickGuide;
