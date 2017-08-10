import { Action } from '@ngrx/store';

export const GET_MATRIX_IMAGES: string = 'GET_MATRIX_IMAGES';
export const GET_MATRIX_IMAGES_SUCCESS: string = 'GET_MATRIX_IMAGES_SUCCESS';

export class GetMatrixImages implements Action {
    readonly type = GET_MATRIX_IMAGES;

    constructor(public payload: string) {}
}

export class GetMatrixImagesSuccess implements Action {
    readonly type = GET_MATRIX_IMAGES_SUCCESS;

    constructor(public payload: any) {}
}

export type Actions =
    | GetMatrixImages
    | GetMatrixImagesSuccess;
