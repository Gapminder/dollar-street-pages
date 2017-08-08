import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import {
    LoaderService,
    MathService,
    LanguageService
} from '../../../common';
import { Observable } from 'rxjs/Observable';
import {
    LoaderServiceMock,
    LanguageServiceMock
} from '../../../test/';
import { CountryPlacesComponent } from '../country-places.component';
import { CountryPlacesService } from '../country-places.service';

describe('CountryPlacesComponent', () => {
    let componentFixture: ComponentFixture<CountryPlacesComponent>;
    let componentInstance: CountryPlacesComponent;

    const countryPlaces = {"success":null,
                            "msg":[],
                            "data":{"country":{"_id":"55ef338d0d2b3c82037884eb"},
                            "places":[{"_id":"562a5ad68e4d42e761a538ff","income":1097.552505,"family":"Najam","imageId":"562a5b8dd20568f1614d5dee","thing":"Family","image":"//static.dollarstreet.org/media/Pakistan 1/image/7cda3510-1fb6-4d0c-b69d-0ee3a250e22d/thumb-7cda3510-1fb6-4d0c-b69d-0ee3a250e22d.jpg","placeId":"562a5ad68e4d42e761a538ff","imagesCount":174}]},
                            "error":null};

    class MockCountryPlacesService {
        public getCountryPlaces(): Observable<any> {
            return Observable.of(countryPlaces);
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CountryPlacesComponent],
            providers: [
                MathService,
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: CountryPlacesService, useClass: MockCountryPlacesService }
            ]
        });

        componentFixture = TestBed.overrideComponent(CountryPlacesComponent, {
            set: {
                template: ''
            }
        }).createComponent(CountryPlacesComponent);

        componentInstance = componentFixture.componentInstance;

        componentFixture.detectChanges();
    }));

    it('ngOnInit(), ngOnDestroy()', (() => {
        componentInstance.ngOnInit();

        expect(componentInstance.countryPlacesServiceSubscribe).toBeDefined();

        spyOn(componentInstance.countryPlacesServiceSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.countryPlacesServiceSubscribe.unsubscribe).toHaveBeenCalled();
    }));
});
