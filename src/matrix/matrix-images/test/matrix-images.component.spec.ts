import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
// import { AppActions } from '../../../app/app.actions';
import {
    SharedModule
} from '../../../shared';
import {
    MathService,
    LoaderService,
    BrowserDetectionService,
    LanguageService,
    UtilsService
} from '../../../common';
import {
    LoaderServiceMock,
    BrowserDetectionServiceMock,
    LanguageServiceMock,
    UtilsServiceMock
} from '../../../test/';
import { MatrixImagesComponent } from '../matrix-images.component';
import { MatrixViewBlockComponent } from '../../matrix-view-block';

describe('MatrixImagesComponent', () => {
    let component: MatrixImagesComponent;
    let fixture: ComponentFixture<MatrixImagesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                InfiniteScrollModule,
                SharedModule,
                RouterTestingModule,
                StoreModule.forRoot({})
            ],
            declarations: [MatrixImagesComponent, MatrixViewBlockComponent],
            providers: [
                MathService,
                // AppActions,
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock }
            ]
        });

        fixture = TestBed.createComponent(MatrixImagesComponent);
        component = fixture.componentInstance;

        component.places = Observable.of({});
    });

    it('ngOnInit()', () => {
        component.ngOnInit();

        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.placesSubscribe).toBeDefined();
        expect(component.contentLoadedSubscription).toBeDefined();
        expect(component.appStateSubscription).toBeDefined();
        expect(component.resizeSubscribe).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.placesSubscribe, 'unsubscribe');
        spyOn(component.contentLoadedSubscription, 'unsubscribe');
        spyOn(component.appStateSubscription, 'unsubscribe');
        spyOn(component.resizeSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.placesSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.contentLoadedSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('buildTitle()', () => {
        const countries = ['Bangladesh', 'Cambodja', 'Singapour'];

        component.buildTitle({regions: ['World'], countries: countries, thing: 'Families'});

        expect(component.activeCountries).toEqual(countries);
    });
});
