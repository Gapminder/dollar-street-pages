import 'rxjs/operator/debounceTime';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
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
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BrowserDetectionService,
  DrawDividersInterface,
  MathService,
  LanguageService,
  UtilsService,
  IncomeCalcService
} from '../../common';
import { FamilyHeaderService } from './family-header.service';

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
  public math: MathService;
  public countryName: any;
  public isOpenArticle: boolean;
  public isShowAboutData: boolean;
  public isShowAboutDataFullScreen: boolean;
  public aboutDataPosition: {left?: number;top?: number;} = {};
  public windowHeight: number = window.innerHeight;
  public maxHeightPopUp: number = this.windowHeight * .95 - 91;
  public familyHeaderServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public zone: NgZone;
  public element: HTMLElement;
  public streetData: DrawDividersInterface;
  public streetSettingsServiceSubscribe: Subscription;
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public getTranslationSubscribe: Subscription;
  public currentLanguage: string;
  public showTranslateMe: boolean;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public streetSettingsStateSubscription: Subscription;
  public timeUnit: string;
  public timeUnitSet: any;
  public timeUnitTrans: any;
  public matrixState: Observable<any>;
  public matrixStateSubscription: Subscription;
  public currencyUnit: any;
  public currencyUnits: any;
  public familyIncome: number;
  public queryParams: any;
  public queryParamsSubscribe: Subscription;

  public constructor(zone: NgZone,
                     math: MathService,
                     element: ElementRef,
                     private familyHeaderService: FamilyHeaderService,
                     private browserDetectionService: BrowserDetectionService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private activatedRoute: ActivatedRoute,
                     private changeDetectorRef: ChangeDetectorRef,
                     private incomeCalcService: IncomeCalcService) {
    this.zone = zone;
    this.math = math;
    this.element = element.nativeElement;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  public ngOnInit(): void {
    this.timeUnitSet = [
      { code: 'DAY', name: 'Daily income', per: 'day' },
      { code: 'WEEK', name: 'Weekly income', per: 'week' },
      { code: 'MONTH', name: 'Monthly income', per: 'month' },
      { code: 'YEAR', name: 'Yearly income', per: 'year' }
    ];

    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isMobile = this.browserDetectionService.isMobile();
    this.isTablet = this.browserDetectionService.isTablet();

    this.currentLanguage = this.languageService.currentLanguage;

    this.getTranslationSubscribe = this.languageService.getTranslation(['READ_MORE', 'READ_LESS']).subscribe((trans: any) => {
      this.readMoreTranslate = trans.READ_MORE;
      this.readLessTranslate = trans.READ_LESS;
    });

    this.queryParamsSubscribe = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.queryParams = {
        currency: params.currency ? decodeURI(params.currency.toUpperCase()) : 'USD',
        time: params.time ? decodeURI(params.time.toUpperCase()) : 'MONTH'
      };
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
      if (data) {
        if (data.streetSettings) {
          if (this.streetData !== data.streetSettings) {
            this.streetData = data.streetSettings;
          }
        }
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.currencyUnit) {
          if (this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
          }
        }

        if (data.timeUnit) {
          if (this.timeUnit !== data.timeUnit) {
            this.timeUnit = data.timeUnit;
          }
        }

        if (data.currencyUnits) {
          if (this.currencyUnits !== data.currencyUnits) {
            this.currencyUnits = data.currencyUnits;
          }
        } else {
          this.store.dispatch(new MatrixActions.GetCurrencyUnits());
        }
      }
    });

    let query: string = `placeId=${this.placeId}${this.languageService.getLanguageParam()}`;

    this.familyHeaderServiceSubscribe = this.familyHeaderService.getFamilyHeaderData(query).subscribe((res: any): any => {
      if (res.err) {
        console.error(res.err);
        return;
      }

      this.home = res.data;
      this.streetFamilyData.emit({income: this.home.income, region: this.home.country.region});
      this.mapData = this.home.country;

      if (!this.home.translated && this.languageService.currentLanguage !== this.languageService.defaultLanguage) {
        this.showTranslateMe = true;
      }

      this.truncCountryName(this.home.country);

      // this.setCurrencyForLang();
      this.setTimeCurrency(this.queryParams);
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

  public setTimeCurrency(params: any): void {
    this.timeUnit = params.time;
    this.currencyUnit = this.incomeCalcService.getTimeUnitByCode(this.currencyUnits, params.currency);
    this.familyIncome = this.incomeCalcService.calcPlaceIncome(this.home.income, this.timeUnit, this.currencyUnit.value);
    this.timeUnitTrans = this.incomeCalcService.getTimeUnitByCode(this.timeUnitSet, this.timeUnit);

    this.store.dispatch(new MatrixActions.SetCurrencyUnit(this.currencyUnit));

    this.changeDetectorRef.detectChanges();
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

    let aboutDataContainer: HTMLElement = this.aboutDataContainer.nativeElement;
    let targetElement: HTMLElement = event.target as HTMLElement;

    this.utilsService.getCoordinates(`.${targetElement.className}`, (data: any) => {
      this.aboutDataPosition.left = data.left - aboutDataContainer.clientWidth + 28;
      this.aboutDataPosition.top = data.top + 28;

      this.isShowAboutData = true;
    });
  }

  public scrollToStart(event: MouseEvent): void {
    let targetElement = event.target as HTMLElement;
    let elementClassName: string = targetElement.className;

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
