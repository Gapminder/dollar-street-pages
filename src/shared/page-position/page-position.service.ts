import { HostListener, Injectable } from '@angular/core';
import { get, floor } from 'lodash';
import { DefaultUrlParameters, MATRIX_GRID_CONTAINER_CLASS } from '../../defaultState';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import { Router } from "@angular/router";

@Injectable()
export class PagePositionService {
  gridContainer: HTMLElement;
  public row = 1;
  _itemSize = 0;

  get itemSize(): number {
    return this._itemSize;
  }

  set itemSize(size) {
    this._itemSize = size;
  }

  get currentRow(): number {
    return this.row;
  }

  constructor(
    private urlParametersService: UrlParametersService
  ){}



  findGridContainer(): HTMLElement {
    return document.querySelector(`.${MATRIX_GRID_CONTAINER_CLASS}`) as HTMLElement;
  }

  getGridContainerRect(): ClientRect {
    if (this.gridContainer) {

      return this.gridContainer.getBoundingClientRect();
    } else {
      const gridContainer = this.findGridContainer();

      if (gridContainer) {
        this.gridContainer = gridContainer;

        return gridContainer.getBoundingClientRect();
      } else {

        return null;
      }
    }
  }

  getCurrentRow(rect: ClientRect): number{
    if (get(rect, 'top', false)
    && rect.top < 0) {
      console.log(rect);
      const offsetTop = Math.abs(rect.top);
      this.row = floor(offsetTop / this.itemSize) + 1;
    } else {
      this.row = 1;
    }

    return this.row;
  }

  setCurrentRow()  {
    const row = this.urlParametersService.needPositionByRoute;
    if (row !== null) {
      const containerRect = this.getGridContainerRect();
      const scroll = ( row - 1 ) * this.itemSize + containerRect.top;
      window.scrollTo(0, scroll);

      this.urlParametersService.needPositionByRoute = null;
    }
  }
}
