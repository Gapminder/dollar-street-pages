import {Component, OnInit, OnDestroy, Input, Inject} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {RowLoaderComponent} from '../../common/row-loader/row-loader.component';

let tpl = require('./home-media.template.html');
let style = require('./home-media.css');

@Component({
  selector: 'home-media',
  template: tpl,
  styles: [style],
  directives: [RowLoaderComponent, RouterLink]
})

export class HomeMediaComponent implements OnInit, OnDestroy {
  protected zoom:number = 4;
  protected itemSize:number;

  @Input('placeId')
  private placeId:string;

  private homeMediaService:any;
  private images:any = [];
  private photographer:any = {};
  private familyPlaceServiceSubscribe:any;

  public constructor(@Inject('HomeMediaService') homeMediaService:any) {
    this.homeMediaService = homeMediaService;
  }

  public ngOnInit():void {
    if (window.innerWidth < 1024) {
      this.zoom = 3;
    }

    this.itemSize = window.innerWidth / this.zoom;

    this.familyPlaceServiceSubscribe = this.homeMediaService.getHomeMedia(`placeId=${this.placeId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.images = res.data.images;
        this.photographer = res.data.photographer;
      });
  }

  public ngOnDestroy():void {
    this.familyPlaceServiceSubscribe.unsubscribe();
  }
}

