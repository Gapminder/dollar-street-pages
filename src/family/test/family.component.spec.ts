import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, Component }    from '@angular/core';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from '../../app/app.effects';
import { RouterTestingModule } from '@angular/router/testing';
import { FamilyModule } from '../family.module';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CountriesFilterService,
         UrlChangeService,
         LanguageService,
         LocalStorageService,
         BrowserDetectionService,
         MathService,
         LoaderService,
         Angulartics2GoogleAnalytics,
         StreetSettingsService
       } from '../../common';
import { FamilyComponent } from '../family.component';
import { FamilyService } from '../family.service';

import { mockCountriesData } from './mock.data';

describe('FamilyComponent', () => {
    let componentInstance: FamilyComponent;
    let componentFixture: ComponentFixture<FamilyComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    let urlChangeService: UrlChangeService;

    @Component({
        template: ''
    })
    class BlankComponent { }

    class MockLanguageService {
        public getTranslation(): Observable<any> {
            return Observable.of('the world');
        }

        public getLanguageParam(): string {
            return '&lang=en';
        }
    }

    class MockFamilyService {
        public getThing(): Observable<any> {
            let response: any = {success:true,data:{_id:'546ccf730f7ddf45c017962f',thingName:'Family',plural:'Familias',originPlural:'Families',originThingName:'Family'},error:undefined};

            return Observable.of(response);
        }
    }

    class MockStreetSettingsService {
        public getStreetSettings(): Observable<any> {
            let context: any = {_id:'57963211cc4aaed63a02504c',showDividers:false,low:30,medium:300,high:3000,poor:26,rich:15000,lowDividerCoord:78,mediumDividerCoord:490,highDividerCoord:920,__v:0};
            let response: any = {success:true,error:false,msg:[],data:context};

            return Observable.of(response);
        }
    }

    class MockCountriesFilterService {
        /* tslint:disable */
        public getCountries(query: string): Observable<any> {
            return Observable.of(mockCountriesData);
        }
        /* tslint:enable */
    }

    class MockAngulartics {
        // tslint:disable-next-line
        public eventTrack(name: string, param: any): void {}
    }

    beforeEach((() => {
        TestBed.configureTestingModule({
            schemas: [  ],
            imports: [
                        HttpModule,
                        FamilyModule,
                        StoreModule.provideStore({}),
                        EffectsModule.run(AppEffects),
                        RouterTestingModule.withRoutes([{path: '', component: BlankComponent}, {path: 'matrix', component: BlankComponent}])
                     ],
            declarations: [ BlankComponent ],
            providers: [
                            UrlChangeService,
                            LocalStorageService,
                            BrowserDetectionService,
                            MathService,
                            LoaderService,
                            { provide: StreetSettingsService, useClass: MockStreetSettingsService },
                            { provide: FamilyService, useClass: MockFamilyService },
                            { provide: CountriesFilterService, useClass: MockCountriesFilterService },
                            { provide: Angulartics2GoogleAnalytics, useClass: MockAngulartics },
                            { provide: LanguageService, useClass: MockLanguageService }
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
            expect(componentInstance.countriesFilterService).toBeDefined();
            expect(componentInstance.urlChangeService).toBeDefined();
            expect(componentInstance.languageService).toBeDefined();
            expect(componentInstance.familyService).toBeDefined();

            expect(componentInstance.theWorldTranslate).toEqual('the world');

            spyOn(componentInstance.queryParamsSubscribe, 'unsubscribe');
            spyOn(componentInstance.countriesFilterServiceSubscribe, 'unsubscribe');
            spyOn(componentInstance.familyServiceSetThingSubscribe, 'unsubscribe');
            spyOn(componentInstance.getTranslationSubscribe, 'unsubscribe');

            componentInstance.ngOnDestroy();

            expect(componentInstance.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.countriesFilterServiceSubscribe.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.familyServiceSetThingSubscribe.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        });
    });

    it('getIncomeTitle()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            expect(componentInstance.getIncomeTitle(10, 100)).toEqual('all incomes');
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
