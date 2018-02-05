import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Location, LocationStrategy } from '@angular/common';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Angulartics2Module } from "angulartics2";
import { TranslateModule } from 'ng2-translate';
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
    let fixture: ComponentFixture<PhotographerPlacesComponent>;
    let component: PhotographerPlacesComponent;

    class MockPhotographerPlacesService {
        public getPhotographerPlaces(): Observable<any> {
            return Observable.of({data: {places: [{},{}]}});
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                RouterTestingModule,
                Angulartics2Module,
                TranslateModule
            ],
            declarations: [PhotographerPlacesComponent],
            providers: [
                MathService,
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: PhotographerPlacesService, useClass: MockPhotographerPlacesService },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(PhotographerPlacesComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.photographerPlacesServiceSubscribe).toBeDefined();

        spyOn(component.photographerPlacesServiceSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.photographerPlacesServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
