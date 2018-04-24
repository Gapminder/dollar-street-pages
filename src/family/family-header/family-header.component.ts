import 'rxjs/operator/debounceTime';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import {
  AppStates,
  Currency,
  DrawDividersInterface,
  TimeUnit,
  TimeUnitCode,
  TranslationsInterface,
  UrlParameters
} from '../../interfaces';
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
  IncomeCalcService,
  LoaderService
} from '../../common';
import { FamilyHeaderService } from './family-header.service';
import { get, map, find } from 'lodash';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import {
  DEBOUNCE_TIME,
  TIME_UNIT_CODES
} from '../../defaultState';

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
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public getTranslationSubscribe: Subscription;
  public currentLanguage: string;
  public showTranslateMe: boolean;
  public timeUnit: TimeUnit;
  public timeUnits: TimeUnit[];
  public currencyUnit: Currency;
  public currencyUnits: Currency[];
  public familyIncome: string;
  public appStatesSubscription: Subscription;

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
                     private incomeCalcService: IncomeCalcService,
                     private loaderService: LoaderService,
                     private urlParametersService: UrlParametersService) {
    this.element = elementRef.nativeElement;
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

    this.appStatesSubscription = this.store
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((state: AppStates) => {
        const matrix = state.matrix;
        const streetSetting = state.streetSettings;
        const language = state.language;

        if (get(streetSetting, 'streetSettings', false)) {
          this.streetData = streetSetting.streetSettings;
        }

        if (get(matrix, 'currencyUnit', false)
          && this.currencyUnit !== matrix.currencyUnit) {
          this.currencyUnit = matrix.currencyUnit;
        }

        if (get(matrix, 'timeUnit', false)
          && this.timeUnit !== matrix.timeUnit) {
          this.timeUnit = matrix.timeUnit;
          this.getTimeUnitTranslations(matrix.timeUnit, language.translations);
        }

        if (get(matrix, 'timeUnits', false)) {
          if (this.timeUnits !== matrix.timeUnits) {
            this.timeUnits = matrix.timeUnits;
          }
        }

        if (get(matrix, 'timeUnit', false)) {
          if (this.timeUnit !== matrix.timeUnit) {
            this.timeUnit = matrix.timeUnit;
          }
        }

        if (get(matrix, 'currencyUnits', false)) {
          if( this.currencyUnits !== matrix.currencyUnits) {
            this.currencyUnits = matrix.currencyUnits;
          }
        }

        if (get(matrix, 'currencyUnit', false)) {
          if( this.currencyUnit !== matrix.currencyUnit) {
            this.currencyUnit = matrix.currencyUnit;
          }
        }

        if (!get(this, 'placeId', false)) {
          this.placeId = matrix.place;
          this.getFamilyHeaderData();
        }

        if (get(language.translations, 'READ_MORE', false)) {
          this.readMoreTranslate = language.translations.READ_MORE;
        }

        if (get(language.translations, 'READ_MORE', false)) {
          this.readLessTranslate = language.translations.READ_LESS;
        }

        this.calcIncomeValue();
      });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowHeight = window.innerHeight;
          this.maxHeightPopUp = this.windowHeight * .95 - 91;
        });
      });
  }

  public getFamilyHeaderData(): void {
    if (this.placeId) {
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
        this.home.htmlFamilyInfo = this.toHtmlFullDescription(get(this.home, 'familyInfo', ''));

        this.truncCountryName(this.home.country);

        this.calcIncomeValue();
      });
    }
  }


  toHtmlFullDescription(oneString: string): string {
    const array = oneString.split(/\r\n|\r|\n/);

    const html = map(array, (pharagraph: string) => {
      return `<p>${pharagraph}</p>`;
    }).join('');

    return html;
  }

  getTimeUnitTranslations(timeUnit: TimeUnit, translations: TranslationsInterface): void {
    if (this.timeUnit !== timeUnit) {
      this.timeUnit = timeUnit;
    }
    const timeUnitCode: TimeUnitCode = find(TIME_UNIT_CODES, {code: timeUnit.code});

    const translationCode = get(translations, timeUnit.code, timeUnit.name);
    this.timeUnit.translationCode = translationCode;

    const translationIncome = get(translations, timeUnitCode.income, timeUnit.name1);
    this.timeUnit.translationIncome = translationIncome;
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

    if (this.appStatesSubscription) {
      this.appStatesSubscription.unsubscribe();
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

  public goToPage(url: string, params: UrlParameters): void {
    this.urlParametersService.dispatchToStore(params);
  }
}
