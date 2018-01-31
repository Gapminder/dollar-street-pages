import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Place } from "../../interfaces";

@Injectable()
export class SortPlacesService {

  public constructor() {

  }

  public sortPlaces(places: any[], column: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let groupColumn = this.houseInColumnGroup(places, column);

      let totalPlaces = groupColumn.map((group: any, i: number) => {
        if (i === groupColumn.length - 1) {
          return places.splice(0, group).reverse();
        }

        if (i !== 0) {
          return this.treeArr(places.splice(0, group));
        }

        return places.splice(0, group);
      });

      this.columnToRow(totalPlaces, column, resolve);
    });
  }

  /*public getQualityArr(places: any, column: number, cb: any): any {
    let [...placesQualityRating] = new Set(places.map((place: any) => place.incomeQuality)) as any;

    return placesQualityRating.map((quality: any) => {
      return this.getZoom(places
        .filter((place: any) => quality === place.incomeQuality)
        .sort((a: any, b: any) => a.income - b.income), column, cb);
    });
  }*/

  private houseInColumnGroup(places: any[], column: number): any {
    let houseInColumnArr = [];
    let placesLength = places.length;
    let maxNumber = Math.ceil(placesLength / column);
    let countOfMAxNumbers = placesLength % column;
    let middleElement = placesLength / column - placesLength / column % 1;

    if (countOfMAxNumbers === 0) {
      for (let i = 0; i < column; i++) {
        houseInColumnArr[i] = maxNumber;
      }
    } else {
      for (let t = 0; t < countOfMAxNumbers; t++) {
        houseInColumnArr[t] = maxNumber;
      }

      let houseInColumnArrLength = houseInColumnArr.length;
      let needsElementCount = column - houseInColumnArrLength;

      for (let j = 0; j < needsElementCount; j++) {
        if (houseInColumnArrLength === 1) {
          houseInColumnArr.splice(1, 0, middleElement);

          continue;
        }

        houseInColumnArr.splice(houseInColumnArrLength - 1, 0, middleElement);
      }
    }

    return houseInColumnArr;
  }

  private treeArr(arr: any[]): any[] {
    let newArr = [];
    let element;
    let length = arr.length;

    for (let j = 0; j < length; j++) {
      if (j % 2 === 0) {
        element = arr.pop();
      } else {
        element = arr.shift();
      }

      newArr.unshift(element);
    }

    return newArr;
  }

  private columnToRow(arr: Place[], column: number, cb: Function): void {
    /*
    let resultArr = [];
    let maxLength = Math.max(...arr.map((items: any) => items.length));

    for (let i = 0; i < maxLength; i++) {
      resultArr.push(...arr.map((item: any) => item[i]).filter((item: any) => item));
    }
    */

    this.regionsLogic(arr, column, cb);
  }

  private regionsLogic(arr: Place[], column: number, cb: Function): void {
    let resultArr = [];
    /*
    let newArrow: any = [];

    for (let i = 0; i < column; i++) {
      let getElementIndex = i;
      newArrow[i] = [];

      _.forEach(arr, (item: any, index: any) => {
        if (index === getElementIndex) {
          newArrow[i].push(item);
          getElementIndex += Number(column);
        }
      });
    }
    */

    this.sortByRegionAndCountry(arr, 0, 'region', Number(column) - 1, (data: any, index: any) => {
      resultArr[index] = data;

      if (index === Number(column) - 1) {
        const sortedArr = _.flattenDeep(_.zip(...resultArr)).filter(i => i);

        return cb(sortedArr);
      }
    });
  }

  private sortByRegionAndCountry(arr: any[], position: number, type: string, column: number, cb: any): any {
    let good = [];
    let bad = [];
    let columnArr = _.compact(arr[position]);

    if (columnArr.length > 1) {
      _.reduce(columnArr, (previousValue: any, currentItem: any) => {
        if (!good.length) {
          good.push(previousValue);
        }

        if (previousValue[type] !== currentItem[type]) {
          good.push(currentItem);
        } else {
          bad.push(currentItem);
        }

        return currentItem;
      });
    } else {
      good.push(_.first(columnArr));
    }

    if (_.uniqBy(bad, 'region').length > 1) {
      arr[position] = good.concat(bad);
      this.sortByRegionAndCountry(arr, position, 'region', column, cb);

      return;
    }

    if (_.uniqBy(bad, 'country').length > 1) {
      arr[position] = good.concat(bad);
      this.sortByRegionAndCountry(arr, position, 'country', column, cb);

      return;
    }

    cb(good.concat(bad), position);

    if (position === column) {
      return;
    }

    // fix: calling this without setTimeout leads to Maximum call stack size exceeded
    const self = this;
    setTimeout(() => {
      self.sortByRegionAndCountry(arr, position + 1, 'region', column, cb);
    }, 0);
  }
}
