import { Component, Input, Output, OnChanges, Inject, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { RouterLink, Router } from '@angular/router-deprecated';
import { PlaceMapComponent } from '../../common/place-map/place-map.component';

let tpl = require('./matrix-view-block.template.html');
let style = require('./matrix-view-block.css');

@Component({
  selector: 'matrix-view-block',
  template: tpl,
  styles: [style],
  directives: [PlaceMapComponent, RouterLink]
})

export class MatrixViewBlockComponent implements OnChanges, OnDestroy {
  public familyInfoServiceSubscribe:any;
  public fancyBoxImage:any;

  protected showblock:boolean;
  protected familyData:any = {};
  protected loader:boolean = false;
  protected math:any;

  private popIsOpen:boolean;
  private mapData:ReplaySubject<any> = new ReplaySubject(0);
  private familyInfoService:any;
  private router:Router;
  private zone:NgZone;

  @Input('query')
  private query:any;
  @Input('place')
  private place:any;
  @Input('thing')
  private thing:string;
  @Output('closeBigImageBlock')
  private closeBigImageBlock:EventEmitter<any> = new EventEmitter();

  public constructor(@Inject('FamilyInfoService') familyInfoService:any,
                     @Inject(Router) router:Router,
                     @Inject('Math') math:any,
                     @Inject(NgZone) zone:NgZone) {
    this.familyInfoService = familyInfoService;
    this.router = router;
    this.zone = zone;
    this.math = math;
  }

  public ngOnChanges():void {
    this.loader = false;
    this.showblock = true;

    let url = `placeId=${this.place._id}&thingId=${this.thing}`;

    this.place.background = this.place.background.replace('devices', 'desktops');

    this.mapData.next({region: this.place.region, lat: this.place.lat, lng: this.place.lng});

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }

    this.familyInfoServiceSubscribe = this.familyInfoService.getFamilyInfo(url)
      .subscribe((res:any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.familyData = res.data;
        this.familyData.goToPlaceData = this.parseUrl(`place=${this.place._id}&` + this.query.replace(/&activeHouse\=\d*/, ''));
        this.loader = true;
      });
  }

  public ngOnDestroy():void {
    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }
  }

  protected closeBlock():void {
    this.closeBigImageBlock.emit({});
  }

  protected openPopUp():void {
    this.popIsOpen = true;

    let imgUrl = this.place.background.replace('desktops', 'original');
    let newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = 'url("' + imgUrl + '")';
      });
    };

    newImage.src = imgUrl;
  };

  protected fancyBoxClose():void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }

  private parseUrl(url:string):any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
