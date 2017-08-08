import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { AppActions } from '../../app/app.actions';
import { MatrixActions } from '../matrix.actions';
import { MatrixImagesComponent } from '../matrix-images';
import { MatrixViewBlockComponent } from '../matrix-view-block';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import {
    ThingsFilterActions,
    SharedModule
} from '../../shared';
import {
    LoaderService,
    UrlChangeService,
    BrowserDetectionService,
    LanguageService,
    ActiveThingService,
    UtilsService,
    MathService
} from '../../common';
import {
    LoaderServiceMock,
    BrowserDetectionServiceMock,
    Angulartics2GoogleAnalyticsMock,
    LanguageServiceMock,
    UtilsServiceMock,
    UrlChangeServiceMock,
    TranslateServiceMock
} from '../../test/';
import { MatrixComponent } from '../matrix.component';

describe('MatrixComponent', () => {
    let component: MatrixComponent;
    let fixture: ComponentFixture<MatrixComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.provideStore({}),
                TranslateModule,
                SharedModule,
                InfiniteScrollModule
            ],
            declarations: [
                MatrixComponent,
                MatrixImagesComponent,
                MatrixViewBlockComponent
            ],
            providers: [
                ActiveThingService,
                AppActions,
                MatrixActions,
                ThingsFilterActions,
                MathService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock }
            ]
        });

        fixture = TestBed.createComponent(MatrixComponent);
        component = fixture.componentInstance;
    }));

    it('ngAfterViewInit(), ngOnDestroy()', () => {
        component.ngAfterViewInit();

        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.activeThingServiceSubscription).toBeDefined();
        expect(component.appStateSubscription).toBeDefined();
        expect(component.matrixStateSubscription).toBeDefined();
        expect(component.resizeSubscribe).toBeDefined();
        expect(component.queryParamsSubscribe).toBeDefined();
        expect(component.scrollSubscribtion).toBeDefined();

        expect(component.matrixImagesContainer).toBeDefined();
        expect(component.matrixHeaderElement).toBeDefined();
        expect(component.streetContainerElement).toBeDefined();
        expect(component.streetAndTitleContainerElement).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.activeThingServiceSubscription, 'unsubscribe');
        spyOn(component.appStateSubscription, 'unsubscribe');
        spyOn(component.matrixStateSubscription, 'unsubscribe');
        spyOn(component.resizeSubscribe, 'unsubscribe');
        spyOn(component.queryParamsSubscribe, 'unsubscribe');
        spyOn(component.scrollSubscribtion, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.activeThingServiceSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.matrixStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.scrollSubscribtion.unsubscribe).toHaveBeenCalled();
    });

    it('processScroll()', () => {
        component.processScroll();
    });

    it('getPaddings()', () => {
        component.getPaddings();
    });

    it('getVisibleRows()', () => {
        component.getVisibleRows(100);
    });

    it('imageHeightChanged()', () => {
        component.imageHeightChanged(100);
    });

    it('calcItemSize()', () => {
        component.calcItemSize();
    });

    it('scrollTopZero()', () => {
        component.scrollTopZero();
    });

    it('getMatrixImagesProcess()', () => {
        const data = {
            zoomPlaces: [],
            streetPlaces: []
        };

        component.getMatrixImagesProcess(data);
    });
});
