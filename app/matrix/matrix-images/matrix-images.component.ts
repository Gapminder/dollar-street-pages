import {
  Component,
  Input,
  EventEmitter,
  ElementRef,
  Inject,
  Output,
  OnInit,
  OnDestroy,
  OnChanges,
  NgZone
} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';
import {fromEvent} from 'rxjs/observable/fromEvent';

import {RowLoaderComponent} from '../../common/row-loader/row-loader.component';
import {MatrixViewBlockComponent} from '../matrix-view-block/matrix-view-block.component';

const device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./matrix-images.template.html');
let style = require('./matrix-images.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives: [RowLoaderComponent, MatrixViewBlockComponent]
})

export class MatrixImagesComponent implements OnInit, OnDestroy, OnChanges {
  protected imageBlockLocation:any;
  protected indexViewBoxHouse:number;

  @Input('places')
  private places:Observable<any>;
  @Input('thing')
  private thing:string;
  @Input('zoom')
  private zoom:number;
  @Input('showblock')
  private showblock:boolean = false;

  @Output('hoverPlace')
  private hoverPlace:EventEmitter<any> = new EventEmitter();
  @Output()
  private filter:EventEmitter<any> = new EventEmitter();

  private isDesktop:boolean = isDesktop;
  private oldPlaceId:string;
  private router:Router;
  private currentPlaces:any = [];
  private element:HTMLElement;
  private placesSubscribe:any;
  private itemSize:number;
  private imageHeight:number;
  private math:any;
  private familyData:any;
  private prevPlaceId:string;
  private resizeSubscribe:any;
  private zone:NgZone;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject(Router) router:Router,
                     @Inject('Math') math:any,
                     @Inject(NgZone) zone:NgZone) {
    this.element = element.nativeElement;
    this.router = router;
    this.math = math;
    this.zone = zone;
  }

  public ngOnInit():any {
    this.itemSize = window.innerWidth / this.zoom;
    this.imageHeight = window.innerWidth / this.zoom - window.innerWidth / 100;

    this.placesSubscribe = this.places.subscribe((places:any) => {
      this.showblock = false;
      this.currentPlaces = places;
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.imageHeight = window.innerWidth / this.zoom - window.innerWidth / 100;
        });
      });
  }

  public ngOnChanges(changes:any):void {
    if (changes.zoom) {
      this.zone.run(() => {
        this.itemSize = window.innerWidth / this.zoom;
        this.imageHeight = window.innerWidth / this.zoom - window.innerWidth / 100;
      });
    }
  }

  public ngOnDestroy():void {
    this.placesSubscribe.unsubscribe();
  }

  public urlTransfer(url:string):void {
    this.goToImageBlock(this.familyData, this.indexViewBoxHouse);
    this.filter.emit(url);
  }

  protected hoverImage(place:any):void {
    this.hoverPlace.emit(place);

    if (this.isDesktop) {
      return;
    }

    if (!place) {
      this.oldPlaceId = void 0;
    }
  }

  protected goToPlace(place:any):void {
    if (this.isDesktop) {
      this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}]);
      return;
    }

    if (!this.oldPlaceId) {
      this.oldPlaceId = place._id;
      return;
    }

    this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}]);
  }

  protected goToImageBlock(place:any, index:number):void {
    this.indexViewBoxHouse = index;
    let countByIndex:number = (this.indexViewBoxHouse + 1) % this.zoom;
    let offset:number = this.zoom - countByIndex;

    this.imageBlockLocation = countByIndex ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    this.familyData = place;

    if (!this.prevPlaceId) {
      this.prevPlaceId = place._id;
      this.showblock = !this.showblock;
      return;
    }

    if (this.prevPlaceId === place._id) {
      this.showblock = !this.showblock;

      if (!this.showblock) {
        this.prevPlaceId = '';
      }
    } else {
      this.prevPlaceId = place._id;
      this.showblock = true;
    }
  }

  protected toUrl(image:any):string {
    return `url("${image}")`;
  }
}
