import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { RowLoaderComponent } from '../../common/row-loader/row-loader.component';
import { HomeMediaViewBlockComponent } from './home-media-view-block/home-media-view-block.component';

let tpl = require('./home-media.template.html');
let style = require('./home-media.css');

@Component({
  selector: 'home-media',
  template: tpl,
  styles: [style],
  directives: [HomeMediaViewBlockComponent, RowLoaderComponent, RouterLink]
})

export class HomeMediaComponent implements OnInit, OnDestroy {
  protected zoom:number = 4;
  protected itemSize:number;
  protected imageData:any = {};
  protected imageBlockLocation:number;
  protected showImageBlock:boolean;

  private prevImageId:string;

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
        this.imageData.photographer = this.photographer;
      });
  }

  protected openMedia(image:any, index:number):void {
    let indexViewBoxHouse:number = index;
    let countByIndex:number = (indexViewBoxHouse + 1) % this.zoom;
    let offset:number = this.zoom - countByIndex;

    this.imageBlockLocation = countByIndex ? offset + indexViewBoxHouse : indexViewBoxHouse;

    this.imageData.thing = {
      name: image.thingName,
      icon: image.thingIcon.replace('FFFFFF', '2C4351')
    };

    this.imageData.image = image.background
      .replace('thumb', 'desktops')
      .replace('url("', '')
      .replace('")', '');

    if (!this.prevImageId) {
      this.prevImageId = image._id;
      this.showImageBlock = !this.showImageBlock;

      return;
    }

    if (this.prevImageId === image._id) {
      this.showImageBlock = !this.showImageBlock;

      if (!this.showImageBlock) {
        this.prevImageId = '';
      }
    } else {
      this.prevImageId = image._id;
      this.showImageBlock = true;
    }
  }

  public ngOnDestroy():void {
    this.familyPlaceServiceSubscribe.unsubscribe();
  }
}

