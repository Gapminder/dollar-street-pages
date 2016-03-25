import {Component, OnInit,OnDestroy, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {CountryInfoService} from './country-info.service.ts';

let tpl = require('./country-info.template.html');
let style = require('./country-info.css');

@Component({
  selector: 'country-info',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class CountryInfoComponent implements OnInit, OnDestroy {
  @Input()
  private countryId:string;

  private country:any = {};
  private countryInfoService:CountryInfoService;
  private countryInfoServiceSubscribe:any;

  constructor(@Inject(CountryInfoService) countryInfoService) {
    this.countryInfoService = countryInfoService;
  }

  ngOnInit():void {
    this.countryInfoServiceSubscribe=this.countryInfoService.getCountryInfo(`id=${this.countryId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }
        this.country = res.data;
      });
  }
  ngOnDestroy():void{
    this.countryInfoServiceSubscribe.unsubscribe()
  }
}
