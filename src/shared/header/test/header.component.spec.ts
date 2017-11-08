import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from 'ng2-translate';
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
LocalStorageService
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
  TitleHeaderServiceMock
} from '../../../test/';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

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
                { provide: Angulartics2, useClass: AngularticsMock },
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: IncomeCalcService, useValue: {} }
            ]
        });

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngAfterViewInit(), ngOnDestroy()', () => {
        component.ngOnInit();
        component.ngAfterViewInit();

        expect(component.resizeSubscription).toBeDefined();
        expect(component.orientationChangeSubscription).toBeDefined();
        expect(component.scrollSubscription).toBeDefined();
        expect(component.getTranslationSubscription).toBeDefined();
        expect(component.routerEventsSubscription).toBeDefined();
        expect(component.queryParamsSubscription).toBeDefined();
        expect(component.streetSettingsStateSubscription).toBeDefined();
        expect(component.appStateSubscription).toBeDefined();
        expect(component.titleHeaderSubscribe).toBeDefined();

        spyOn(component.resizeSubscription, 'unsubscribe');
        spyOn(component.orientationChangeSubscription, 'unsubscribe');
        spyOn(component.scrollSubscription, 'unsubscribe');
        spyOn(component.getTranslationSubscription, 'unsubscribe');
        spyOn(component.routerEventsSubscription, 'unsubscribe');
        spyOn(component.queryParamsSubscription, 'unsubscribe');
        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(component.appStateSubscription, 'unsubscribe');
        spyOn(component.titleHeaderSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.resizeSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.orientationChangeSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.scrollSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.getTranslationSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.routerEventsSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.queryParamsSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.titleHeaderSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
