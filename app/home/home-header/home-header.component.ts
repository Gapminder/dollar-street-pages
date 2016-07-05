import {Component, OnInit, Inject, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {ReplaySubject} from 'rxjs/ReplaySubject';

import {PlaceMapComponent} from '../../common/place-map/place-map.component';

let tpl = require('./home-header.template.html');
let style = require('./home-header.css');

@Component({
  selector: 'home-header',
  template: tpl,
  styles: [style],
  directives: [PlaceMapComponent, RouterLink]
})

export class HomeHeaderComponent implements OnInit, OnDestroy {
  protected home:any = {};
  protected mapData:ReplaySubject<any> = new ReplaySubject(0);
  protected isOpenArticle:boolean = false;

  @Input('placeId')
  private placeId:string;
  @Output('transferFamilyData')
  private transferFamilyData:EventEmitter<any> = new EventEmitter();
  private homeHeaderService:any;
  private homeHeaderServiceSubscribe:any;

  public constructor(@Inject('HomeHeaderService') homeHeaderService:any) {
    this.homeHeaderService = homeHeaderService;
  }

  public ngOnInit():void {
    this.homeHeaderServiceSubscribe = this.homeHeaderService
      .getHomeHeaderData(`placeId=${this.placeId}`)
      .subscribe((res:any):any => {
        if (res.err) {
          return res.err;
        }

        this.home = res.data;

        this.transferFamilyData.emit({
          familyName: this.home.familyName,
          country: this.home.country.alias,
          income: this.home.income
        });

        this.mapData.next(this.home.country);
      });
  }

  public ngOnDestroy():void {
    this.homeHeaderServiceSubscribe.unsubscribe();
  }

  protected openInfo(isOpenArticle:boolean):void {
    this.isOpenArticle = !isOpenArticle;
  }
}
