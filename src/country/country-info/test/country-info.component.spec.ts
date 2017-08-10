import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import {
    MathService,
    LanguageService,
    BrowserDetectionService
} from '../../../common';
import { StoreModule } from '@ngrx/store';
import {
    LanguageServiceMock,
    BrowserDetectionServiceMock
} from '../../../test/';
import { CountryInfoComponent } from '../country-info.component';
import { CountryInfoService } from '../country-info.service';

describe('CountryInfoComponent', () => {
    let componentFixture: ComponentFixture<CountryInfoComponent>;
    let componentInstance: CountryInfoComponent;

    const countryInfo = {"success":true,
                         "msg":[],
                         "data":{"country":{"_id":"55ef338d0d2b3c82037884eb","code":"PK","region":"Asia","country":"Pakistan","lat":30,"lng":70,"alias":"Pakistan","originName":"Pakistan"},"places":1,"images":174,"thing":"Families"},
                         "error":null};

    class CountryInfoServiceMock {
        public getCountryInfo(): Observable<any> {
            return Observable.of(countryInfo);
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
            ],
            declarations: [CountryInfoComponent],
            providers: [
                MathService,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: CountryInfoService, useClass: CountryInfoServiceMock }
            ]
        });

        componentFixture = TestBed.overrideComponent(CountryInfoComponent, {
            set: {
                template: ''
            }
        }).createComponent(CountryInfoComponent);

        componentInstance = componentFixture.componentInstance;
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        componentInstance.ngOnInit();

        expect(componentInstance.countryInfoServiceSubscribe).toBeDefined();
        expect(componentInstance.streetSettingsStateSubscription).toBeDefined();

        spyOn(componentInstance.countryInfoServiceSubscribe, 'unsubscribe');
        spyOn(componentInstance.streetSettingsStateSubscription, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.countryInfoServiceSubscribe.unsubscribe).toHaveBeenCalled();
        expect(componentInstance.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
    });
});
