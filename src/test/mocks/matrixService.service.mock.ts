import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Place } from '../../interfaces';

@Injectable()
export class MatrixServiceMock {
  hoverPlace = new Subject();

  constructor() {}

  setHoverPlaces(place: Place): void {}

  uploadScreenshot(data: any): Promise<any> {
    return new Promise((resolve, reject) => {resolve()});
  }

  savePinnedPlaces(query: string): Promise<any> {
    return new Promise((resolve, reject) => {resolve()});
  }

  getPinnedPlaces(query: string): Promise<any> {
    return new Promise((resolve, reject) => {resolve()});
  }

  removeTempImages(query: string): Promise<any> {
    return new Promise((resolve, reject) => {resolve()});
  }

  getMatrixImages(query: string): Observable<any> {
    return new Observable<any>();
  }

  getCurrencyUnits(): Promise<any> {
    return new Promise((resolve, reject) => {resolve()});
  }
}
