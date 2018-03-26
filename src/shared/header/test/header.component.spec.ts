import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {TranslateLoader, TranslateModule, TranslateParser, TranslateService} from 'ng2-translate';
import { Angulartics2Module, Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import { DropdownModule } from 'ng2-bootstrap';
import { StoreModule } from '@ngrx/store';

import {
  MathService,
  LanguageService,
  BrowserDetectionService,
  UtilsService,
  UrlChangeService,
  TitleHeaderService,
  LocalStorageService, SocialShareService,
} from '../../../common';
import { MainMenuComponent } from '../../main-menu/main-menu.component';
import { LanguageSelectorComponent } from '../../language-selector/language-selector.component';
import { CountriesFilterComponent } from '../../countries-filter/countries-filter.component';
import { CountriesFilterPipe } from '../../countries-filter/countries-filter.pipe';
import { ThingsFilterComponent } from '../../things-filter/things-filter.component';
import { ThingsFilterPipe } from '../../things-filter/things-filter.pipe';
import { SocialShareButtonsComponent } from '../../social-share-buttons/social-share-buttons.component';
import { HeaderComponent } from '../header.component';
import { IncomeCalcService } from '../../../common/income-calc/income-calc.service';

import {
  AngularticsMock,
  Angulartics2GoogleAnalyticsMock,
  LanguageServiceMock,
  BrowserDetectionServiceMock,
  UtilsServiceMock,
  UrlChangeServiceMock,
  IncomeCalcServiceMock,
  TitleHeaderServiceMock
} from '../../../test/';
import {SocialShareButtonsService} from '../../social-share-buttons/social-share-buttons.service';
import { UrlParametersServiceMock } from "../../../test/mocks/url-parameters.service.mock";
import { UrlParametersService } from "../../../url-parameters/url-parameters.service";
import { forEach } from 'lodash';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    class SocialShareButtonsServiceMock {

    };
    class SocialShareServiceMock {

    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                RouterTestingModule,
                Angulartics2Module,
                DropdownModule,
                StoreModule.forRoot({})
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                HeaderComponent,
                ThingsFilterComponent,
                CountriesFilterComponent,
                MainMenuComponent,
                LanguageSelectorComponent,
                ThingsFilterPipe,
                CountriesFilterPipe,
                SocialShareButtonsComponent
            ],
            providers: [
                MathService,
                LocalStorageService,
                TitleHeaderService,
                TranslateService,
                TranslateLoader,
                TranslateParser,
                SocialShareButtonsService,
                SocialShareService,
                { provide: Angulartics2, useClass: AngularticsMock },
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: IncomeCalcService, useClass: IncomeCalcServiceMock },
                { provide: UrlParametersService, useClass: UrlParametersServiceMock }
            ]
        });

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngAfterViewInit(), ngOnDestroy()', () => {
        component.ngOnInit();
        component.ngAfterViewInit();

        forEach(component.ngSubscriptions, (value, key) => {
          spyOn(value, 'unsubscribe');
        });

        component.ngOnDestroy();

        forEach(component.ngSubscriptions, (value, key) => {
          expect(value.unsubscribe).toHaveBeenCalled();
        });
    });
});
