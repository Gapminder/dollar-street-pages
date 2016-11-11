import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MathService, StreetSettingsService, DrawDividersInterface } from '../../common';
import { CountryInfoService } from './country-info.service';

@Component({
  selector: 'country-info',
  templateUrl: './country-info.component.html',
  styleUrls: ['./country-info.component.css']
})

export class CountryInfoComponent implements OnInit, OnDestroy {
  @Input()
  public countryId: string;
  @Output()
  public getCountry: EventEmitter<any> = new EventEmitter<any>();

  public mapData: any;
  public isShowInfo: boolean;
  public country: any;
  public thing: any;
  public placesQuantity: number;
  public photosQuantity: number;
  public videosQuantity: number;
  public math: MathService;
  public countryInfoService: CountryInfoService;
  public countryInfoServiceSubscribe: Subscription;
  public streetSettingsService: StreetSettingsService;
  public streetData: DrawDividersInterface;
  public streetServiceSubscribe: Subscription;

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
