import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class MatrixActions {
    public static GET_MATRIX_IMAGES: string = 'GET_MATRIX_IMAGES';
    getMatrixImages(query: string): Action {
        return {
            type: MatrixActions.GET_MATRIX_IMAGES,
            payload: query
        };
    }

    public static GET_MATRIX_IMAGES_SUCCESS: string = 'GET_MATRIX_IMAGES_SUCCESS';
    getMatrixImagesSuccess(data: any): Action {
        return {
            type: MatrixActions.GET_MATRIX_IMAGES_SUCCESS,
            payload: data
        };
    }
}