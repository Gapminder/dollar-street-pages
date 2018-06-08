import { Component, HostListener, Output } from '@angular/core';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import { PagePositionService } from './page-position.service';

@Component({
  selector: 'page-position',
  template: ``
})
export class PagePositionComponent {

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
    private pagePositionService: PagePositionService
  ){}

  @HostListener('window:scroll', ['$event'])
  track($event: Event): void {
    const rect = this.pagePositionService.getGridContainerRect();
    this.row = this.pagePositionService.getCurrentRow( rect);
    this.urlParametersService.setGridPosition(this.row);
  }
}
