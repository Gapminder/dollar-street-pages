import { Component, HostListener, Input, OnInit, AfterViewInit, Output } from '@angular/core';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { PagePositionService } from './page-position.service';
import { DEBOUNCE_TIME, DefaultUrlParameters, MATRIX_GRID_CONTAINER_CLASS } from '../../defaultState';
import { get } from "lodash";
import { UrlParameters } from "../../interfaces";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";

@Component({
  selector: 'page-position',
  template: ``
})
export class PagePositionComponent implements AfterViewInit {

  size: number;

  set itemSize(size) {
    this.size = size;
  }

  get itemSize(): number {
    return this.size;
  }

  @Output()
  row = 1;

  constructor(
    private urlParametersService: UrlParametersService,
    private pagePositionService: PagePositionService,
    private router: Router
  ){}

  @HostListener('window:scroll', ['$event'])
  track($event: Event): void {
    const rect = this.pagePositionService.getGridContainerRect();
    this.row = this.pagePositionService.getCurrentRow( rect);
    this.urlParametersService.setGridPosition(this.row);
  }

  ngAfterViewInit() {}
}
