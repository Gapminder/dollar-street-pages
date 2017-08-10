import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, Component }    from '@angular/core';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { FamilyModule } from '../family.module';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import {
    UrlChangeService,
    LanguageService,
    LocalStorageService,
    BrowserDetectionService,
    MathService,
    LoaderService,
    Angulartics2GoogleAnalytics,
    StreetSettingsService,
    StreetSettingsEffects,
    // StreetSettingsActions,
    UtilsService
} from '../../common';
import {
    LoaderServiceMock,
    LanguageServiceMock,
    StreetSettingsServiceMock,
    AngularticsMock,
    BlankComponent,
    BrowserDetectionServiceMock,
    UtilsServiceMock,
    UrlChangeServiceMock
} from '../../test/';
import { FamilyComponent } from '../family.component';
import { FamilyService } from '../family.service';

import { mockCountriesData } from './mock.data';

describe('FamilyComponent', () => {
    let componentInstance: FamilyComponent;
    let componentFixture: ComponentFixture<FamilyComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    let urlChangeService: UrlChangeService;

    class MockFamilyService {
        public getThing(): Observable<any> {
            let response: any = {success:true,data:{_id:'546ccf730f7ddf45c017962f',thingName:'Family',plural:'Familias',originPlural:'Families',originThingName:'Family'},error:undefined};

            return Observable.of(response);
        }
    }

    beforeEach((() => {
        TestBed.configureTestingModule({
            schemas: [  ],
            imports: [
                HttpModule,
                FamilyModule,
                StoreModule.forRoot({}),
                EffectsModule.forFeature([StreetSettingsEffects]),
                RouterTestingModule.withRoutes([{path: '', component: BlankComponent}, {path: 'matrix', component: BlankComponent}])
            ],
            declarations: [ BlankComponent ],
            providers: [
                LocalStorageService,
                MathService,
                // StreetSettingsActions,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: StreetSettingsService, useClass: StreetSettingsServiceMock },
                { provide: FamilyService, useClass: MockFamilyService },
                // { provide: CountriesFilterService, useClass: MockCountriesFilterService },
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        componentFixture = TestBed.overrideComponent(FamilyComponent, {
            set: {
                template: `<div><router-outlet></router-outlet></div>`
            }
        }).createComponent(FamilyComponent);

        componentInstance = componentFixture.componentInstance;
        debugElement = componentFixture.debugElement.query(By.css('div'));
        nativeElement = debugElement.nativeElement;

        urlChangeService = TestBed.get(UrlChangeService);
    }));

    it('ngOnInit() ngOnDestroy()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            expect(componentInstance.homeIncomeData._id).toEqual('57963211cc4aaed63a02504c');
            expect(componentInstance.homeIncomeData.poor).toEqual(26);
            expect(componentInstance.homeIncomeData.rich).toEqual(15000);

            expect(componentInstance.router).toBeDefined();
            expect(componentInstance.activatedRoute).toBeDefined();
            expect(componentInstance.angulartics2GoogleAnalytics).toBeDefined();
            // expect(componentInstance.countriesFilterService).toBeDefined();
            expect(componentInstance.urlChangeService).toBeDefined();
            expect(componentInstance.languageService).toBeDefined();
            expect(componentInstance.familyService).toBeDefined();

            expect(componentInstance.theWorldTranslate).toEqual('the world');

            spyOn(componentInstance.queryParamsSubscribe, 'unsubscribe');
            // spyOn(componentInstance.countriesFilterServiceSubscribe, 'unsubscribe');
            spyOn(componentInstance.familyServiceSetThingSubscribe, 'unsubscribe');
            spyOn(componentInstance.getTranslationSubscribe, 'unsubscribe');

            componentInstance.ngOnDestroy();

            expect(componentInstance.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
            // expect(componentInstance.countriesFilterServiceSubscribe.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.familyServiceSetThingSubscribe.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        });
    });

    it('getIncomeTitle()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            // expect(componentInstance.getIncomeTitle(10, 100)).toEqual('all incomes');
        });
    });

    it('findCountryTranslatedName()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            const countries: any = componentInstance.countries;

            let translatedCountries: any[] = componentInstance.findCountryTranslatedName(countries);

            let country = _.find(translatedCountries, {country: 'Боливия'});

            expect(country).toBeDefined();
        });
    });
});
