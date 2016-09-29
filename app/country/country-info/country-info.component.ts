import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { MathService } from '../../common/math-service/math-service';
import { CountryInfoService } from './country-info.service';
import { StreetSettingsService, DrawDividersInterface } from '../../common/street/street.settings.service';

let tpl = require('./country-info.template.html');
let style = require('./country-info.css');

@Component({
  selector: 'country-info',
  template: tpl,
  styles: [style]
})

export class CountryInfoComponent implements OnInit, OnDestroy {
  @Input()
  private countryId: string;
  @Output()
  private getCountry: EventEmitter<any> = new EventEmitter<any>();

  private mapData: any;
  private isShowInfo: boolean;
  private country: any;
  private thing: any;
  private placesQuantity: number;
  private photosQuantity: number;
  private videosQuantity: number;
  private math: MathService;
  private countryInfoService: CountryInfoService;
  private countryInfoServiceSubscribe: Subscription;
  private streetSettingsService: StreetSettingsService;
  private streetData: DrawDividersInterface;
  private streetServiceSubscribe: Subscription;

  public constructor(countryInfoService: CountryInfoService,
                     math: MathService,
                     streetSettingsService: StreetSettingsService) {
    this.countryInfoService = countryInfoService;
    this.math = math;
    this.streetSettingsService = streetSettingsService;
    this.isShowInfo = false;
  }

  public ngOnInit(): void {
    this.countryInfoServiceSubscribe = this.countryInfoService.getCountryInfo(`id=${this.countryId}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.country = res.data.country;
        this.mapData = res.data.country;
        this.thing = res.data.thing;
        this.placesQuantity = res.data.places;
        this.photosQuantity = res.data.images;
        this.videosQuantity = res.data.video;
        this.getCountry.emit(this.country.alias || this.country.country);
      });

    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.streetData = res.data;
      });
  }

  public ngOnDestroy(): void {
    this.countryInfoServiceSubscribe.unsubscribe();
  }
}
