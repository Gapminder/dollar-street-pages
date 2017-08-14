import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import {
  MathService,
  DrawDividersInterface,
  LanguageService,
  BrowserDetectionService
} from '../../common';
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
  public placesQuantity: string;
  public photosQuantity: string;
  public videosQuantity: string;
  public math: MathService;
  public countryInfoService: CountryInfoService;
  public countryInfoServiceSubscribe: Subscription;
  public streetData: DrawDividersInterface;
  public languageService: LanguageService;
  public device: BrowserDetectionService;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public streetSettingsStateSubscription: Subscription;

  public constructor(countryInfoService: CountryInfoService,
                     math: MathService,
                     languageService: LanguageService,
                     browserDetectionService: BrowserDetectionService,
                     private store: Store<AppStates>) {
    this.device = browserDetectionService;
    this.countryInfoService = countryInfoService;
    this.math = math;
    this.isShowInfo = false;
    this.languageService = languageService;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
  }

  public ngOnInit(): void {
    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;
    });

    this.countryInfoServiceSubscribe = this.countryInfoService.getCountryInfo(`id=${this.countryId}${this.languageService.getLanguageParam()}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.country = res.data.country;
        this.mapData = res.data.country;
        this.thing = res.data.thing;
        this.placesQuantity = this.device.isMobile() !== true ? this.math.round(res.data.places).toString() : this.math.round(res.data.places).toString().replace(/\s+/g, '');
        this.photosQuantity = this.device.isMobile() !== true ? this.math.round(res.data.images).toString() : this.math.round(res.data.images).toString().replace(/\s+/g, '');
        this.videosQuantity = Math.round(res.data.video) > 0 ? this.math.round(res.data.video).toString() : '';
        this.getCountry.emit(this.country.alias || this.country.country);
      });
  }

  public ngOnDestroy(): void {
    this.countryInfoServiceSubscribe.unsubscribe();

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }
  }
}
