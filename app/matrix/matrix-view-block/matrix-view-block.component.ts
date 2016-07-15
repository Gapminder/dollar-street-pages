import { Component, Input, Output, OnChanges, Inject, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router-deprecated';
import { RegionMapComponent } from '../../common/region-map/region-map.component';

let tpl = require('./matrix-view-block.template.html');
let style = require('./matrix-view-block.css');

@Component({
  selector: 'matrix-view-block',
  template: tpl,
  styles: [style],
  directives: [RegionMapComponent, RouterLink]
})

export class MatrixViewBlockComponent implements OnChanges, OnDestroy {
  public familyInfoServiceSubscribe:any;
  public fancyBoxImage:any;

  protected showblock:boolean;
  protected familyData:any = {};
  protected loader:boolean = false;
  protected math:any;
  protected markerPositionLeft:number;

  @Input('positionInRow')
  protected positionInRow:any;

  private popIsOpen:boolean;
  private mapData:any;
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
  private closeBigImageBlock:EventEmitter<any> = new EventEmitter<any>();

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
    let parseUrl:any = this.parseUrl(`place=${this.place._id}&` + this.query.replace(/&activeHouse\=\d*/, ''));
    let imageWidth:number = (window.innerWidth - 36) / parseUrl.zoom;

    this.markerPositionLeft = imageWidth * (this.positionInRow || parseUrl.zoom) - (imageWidth / 2 + 33);
    this.place.background = 'url("' + this.place.background.replace('devices', 'desktops') + '")';
    this.mapData = {region: this.place.region, lat: this.place.lat, lng: this.place.lng};

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

        if (this.familyData.familyData && this.familyData.familyData.length > 300) {
          this.familyData.familyData = this.familyData.familyData.slice(0, 300) + '...';
        }

        this.familyData.goToPlaceData = parseUrl;
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

    let imgUrl = this.place.background.replace('desktops', 'original').replace('url("', '').replace('")', '');
    let newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = this.place.background;
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
