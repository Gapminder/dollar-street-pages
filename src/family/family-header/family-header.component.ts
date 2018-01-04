import 'rxjs/operator/debounceTime';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  AppStates,
  Currency,
  MatrixState,
  StreetSettingsState,
  DrawDividersInterface,
  TimeUnit,
  UrlParameters
} from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  NgZone,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BrowserDetectionService,
  MathService,
  LanguageService,
  UtilsService,
  IncomeCalcService
} from '../../common';
import { FamilyHeaderService } from './family-header.service';
import { get } from 'lodash';

@Component({
  selector: 'family-header',
  templateUrl: './family-header.component.html',
  styleUrls: ['./family-header.component.css']
})
export class FamilyHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('homeDescriptionContainer')
  public homeDescriptionContainer: ElementRef;
  @ViewChild('aboutDataContainer')
  public aboutDataContainer: ElementRef;
  @ViewChild('shortFamilyInfoContainer')
  public shortFamilyInfoContainer: ElementRef;

  @Input()
  public placeId: string;
  @Output()
  public familyExpandBlock: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public streetFamilyData: EventEmitter<any> = new EventEmitter<any>();

  public readMoreTranslate: string;
  public readLessTranslate: string;
  public home: any = {};
  public mapData: any;
  public countryName: any;
  public isOpenArticle: boolean;
  public isShowAboutData: boolean;
  public isShowAboutDataFullScreen: boolean;
  public aboutDataPosition: {left?: number;top?: number;} = {};
  public windowHeight: number = window.innerHeight;
  public maxHeightPopUp: number = this.windowHeight * .95 - 91;
  public familyHeaderServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public element: HTMLElement;
  public streetData: DrawDividersInterface;
  public streetSettingsServiceSubscribe: Subscription;
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public getTranslationSubscribe: Subscription;
  public currentLanguage: string;
  public showTranslateMe: boolean;
  public streetSettingsState: Observable<StreetSettingsState>;
  public streetSettingsStateSubscription: Subscription;
  public timeUnit: TimeUnit;
  public timeUnits: TimeUnit[];
  public matrixState: Observable<MatrixState>;
  public matrixStateSubscription: Subscription;
  public currencyUnit: Currency;
  public currencyUnits: Currency[];
  public familyIncome: string;
  public queryParams: UrlParameters;
  public queryParamsSubscribe: Subscription;

  public constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private math: MathService,
                     private familyHeaderService: FamilyHeaderService,
                     private browserDetectionService: BrowserDetectionService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private activatedRoute: ActivatedRoute,
                     private changeDetectorRef: ChangeDetectorRef,
                     private incomeCalcService: IncomeCalcService) {
    this.element = elementRef.nativeElement;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  public ngOnInit(): void {
    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isMobile = this.browserDetectionService.isMobile();
    this.isTablet = this.browserDetectionService.isTablet();

    this.currentLanguage = this.languageService.currentLanguage;

    this.getTranslationSubscribe = this.languageService.getTranslation(['READ_MORE', 'READ_LESS']).subscribe((trans: any) => {
      this.readMoreTranslate = trans.READ_MORE;
      this.readLessTranslate = trans.READ_LESS;
    });

    this.queryParamsSubscribe = this.activatedRoute.queryParams.subscribe((params: UrlParameters) => {
      this.queryParams = {
        currency: params.currency ? decodeURI(params.currency.toUpperCase()) : 'USD',
        time: params.time ? decodeURI(params.time.toUpperCase()) : 'MONTH'
      };
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (get(data, 'streetSettings', false)) {
        this.streetData = data.streetSettings;
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: MatrixState) => {
      if (get(data, 'currencyUnit', false)
          && this.currencyUnit !== data.currencyUnit) {
        this.currencyUnit = data.currencyUnit;
      }

      if (get(data, 'timeUnit', false)
          && this.timeUnit !== data.timeUnit) {
        this.timeUnit = data.timeUnit;
      }

      if (get(data, 'timeUnits', false)) {
          if (this.timeUnits !== data.timeUnits) {
            this.timeUnits = data.timeUnits;

            this.timeUnit = this.incomeCalcService.getTimeUnitByCode(this.timeUnits, this.queryParams.time);

            this.store.dispatch(new MatrixActions.SetTimeUnit(this.timeUnit));
          }
      } else {
        this.store.dispatch(new MatrixActions.GetTimeUnits());
      }

      if (get(data, 'currencyUnits', false)
       && this.currencyUnits !== data.currencyUnits) {
        this.currencyUnits = data.currencyUnits;

        this.currencyUnit = this.incomeCalcService.getCurrencyUnitByCode(this.currencyUnits, this.queryParams.currency);

        this.store.dispatch(new MatrixActions.SetCurrencyUnit(this.currencyUnit));
      } else {
        this.store.dispatch(new MatrixActions.GetCurrencyUnits());
      }

      this.calcIncomeValue();
    });

    const query = `placeId=${this.placeId}${this.languageService.getLanguageParam()}`;
    this.familyHeaderServiceSubscribe = this.familyHeaderService.getFamilyHeaderData(query).subscribe((res: any): any => {
      if (get(res, 'err', false)) {
        return;
      }

      this.home = res.data;
      this.streetFamilyData.emit({income: this.home.income, region: this.home.country.region});
      this.mapData = this.home.country;

      if (!this.home.translated && this.languageService.currentLanguage !== this.languageService.defaultLanguage) {
        this.showTranslateMe = true;
      }

      this.truncCountryName(this.home.country);

      this.calcIncomeValue();
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowHeight = window.innerHeight;
          this.maxHeightPopUp = this.windowHeight * .95 - 91;
        });
      });
  }

  private calcIncomeValue(): void {
    if (this.timeUnit && this.currencyUnit && this.home) {
      this.familyIncome = this.incomeCalcService.calcPlaceIncome(this.home.income, this.timeUnit.code, this.currencyUnit.value);
    }
  }

  public ngOnDestroy(): void {
    if(this.familyHeaderServiceSubscribe) {
      this.familyHeaderServiceSubscribe.unsubscribe();
    }

    if(this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.queryParamsSubscribe) {
      this.queryParamsSubscribe.unsubscribe();
    }
  }

  public openInfo(isOpenArticle: boolean): void {
    this.isOpenArticle = !isOpenArticle;
  }

  public closeAboutDataPopUp(event: MouseEvent): void {
    let el = event && event.target as HTMLElement;

    if (el.className.indexOf('closeMenu') !== -1) {
      this.isShowAboutData = false;
      this.isShowAboutDataFullScreen = false;
    }
  }

  public showAboutData(event: MouseEvent, fixed: boolean): void {
    if (fixed) {
      event.preventDefault();
    }

    if (!arguments.length) {
      this.isShowAboutData = false;

      return;
    }

    if (fixed) {
      this.isShowAboutData = true;
      this.isShowAboutDataFullScreen = true;

      return;
    }

    const aboutDataContainer: HTMLElement = this.aboutDataContainer.nativeElement;
    const targetElement: HTMLElement = event.target as HTMLElement;

    this.utilsService.getCoordinates(`.${targetElement.className}`, (data: any) => {
      this.aboutDataPosition.left = data.left - aboutDataContainer.clientWidth + 28;
      this.aboutDataPosition.top = data.top + 28;

      this.isShowAboutData = true;
    });
  }

  public scrollToStart(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const elementClassName: string = targetElement.className;

    if (elementClassName === 'short-about-info-image' || elementClassName === 'portrait') {
      return;
    }

    event.preventDefault();

    this.utilsService.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  }

  public truncCountryName(countryData: any): any {
    switch (countryData.alias) {
      case 'South Africa' :
        this.countryName = 'SA';
        break;
      case 'United States' :
        this.countryName = 'USA';
        break;
      case 'United Kingdom' :
        this.countryName = 'UK';
        break;
      default :
        if (countryData.alias.length > 10) {
          this.countryName = countryData.alias.slice(0, 8) + '...';
        } else {
          this.countryName = countryData.alias;
        }
    }
  }

  public openExpandBlock(): void {
    this.familyExpandBlock.emit({thingId: this.home.familyThingId});
  }
}
