import {Component, Input, OnChanges, Inject} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';

import {PlaceMapComponent} from '../../common/place-map/place-map.component';
import {StreetMiniComponent} from '../../common/street-mini/street-mini.component';

let tpl = require('./matrix-view-block.template.html');
let style = require('./matrix-view-block.css');

@Component({
  selector: 'matrix-view-block',
  template: tpl,
  styles: [style],
  directives: [PlaceMapComponent, StreetMiniComponent]
})

export class MatrixViewBlockComponent implements OnChanges {
  public familyInfoServiceSubscribe:any;

  protected imageUrl:string;
  protected country:any;

  private mapData:ReplaySubject<any> = new ReplaySubject(0);
  private streetMiniData:ReplaySubject<any> = new ReplaySubject(0);
  private FamilyInfoService:any;

  @Input('place')
  private place:any;

  public constructor(@Inject('FamilyInfoService') FamilyInfoService:any) {
    this.FamilyInfoService = FamilyInfoService;
  }

  public ngOnChanges(changes:any):void {
    let limit = 10;
    let placeId = this.place._id;
    this.imageUrl = this.place.background.replace('devices', 'desktops');
    this.country = this.place.country;
    this.streetMiniData.next(this.place);
    this.mapData.next({region: this.place.region, lat: this.place.lat, lng: this.place.lng});
    console.log('Place in mvb.component!!!', this.place);
    // console.log('CHANGED!!!', changes.place);

    let url = `isTrash=false&limit=${limit}&placeId=${placeId}&skip=0`;

    // Find thingID to use FamilyInfoService.getFullFamilyInfo
    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
      this.familyInfoServiceSubscribe = void 0;
    }

    this.familyInfoServiceSubscribe = this.FamilyInfoService.getFamilyInfo(url)
      .subscribe((res:any) => {
        if (res.err) {
          console.log(res.err);
          return;
        }
      });
  }
}
