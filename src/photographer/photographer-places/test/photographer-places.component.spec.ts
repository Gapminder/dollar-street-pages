import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location, LocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
    MathService,
    LanguageService,
    LoaderService
} from '../../../common';
import {
    LoaderServiceMock,
    LanguageServiceMock
} from '../../../test/';
import { PhotographerPlacesComponent } from '../photographer-places.component';
import { PhotographerPlacesService } from '../photographer-places.service';

describe('PhotographerPlacesComponent', () => {
    let componentInstance: PhotographerPlacesComponent;
    let componentFixture: ComponentFixture<PhotographerPlacesComponent>;

    /*class MockUserLanguageService {
        public getLanguageParam(): string {
            return 'lang=en';
        }
    }*/

    class MockPhotographerPlacesService {
        public getPhotographerPlaces(): Observable<any> {
            return Observable.of({data: {places: [{},{}]}});
        }
    }

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [PhotographerPlacesComponent],
            providers: [
                Location,
                LocationStrategy,
                MathService,
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: PhotographerPlacesService, useClass: MockPhotographerPlacesService },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        componentFixture = TestBed.overrideComponent(PhotographerPlacesComponent, {
            set: {
                template: ''
            }
        }).createComponent(PhotographerPlacesComponent);

        componentInstance = componentFixture.componentInstance;
    });

    it('ngOnInit(), ngOnDestroy()', () => {
        componentInstance.ngOnInit();

        expect(componentInstance.photographerPlacesServiceSubscribe).toBeDefined();

        spyOn(componentInstance.photographerPlacesServiceSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.photographerPlacesServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
