import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleTagManager } from 'angulartics2';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { MatrixImagesComponent } from '../matrix-images';
import { MatrixViewBlockComponent } from '../matrix-view-block';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { SharedModule } from '../../shared';
import {
  BrowserDetectionService,
  LanguageService,
  LoaderService,
  MathService,
  UrlChangeService,
  UtilsService
} from '../../common';
import {
  Angulartics2GoogleAnalyticsMock,
  BrowserDetectionServiceMock,
  LanguageServiceMock,
  LoaderServiceMock,
  TranslateServiceMock,
  UrlChangeServiceMock,
  UtilsServiceMock
} from '../../test/';
import { MatrixComponent } from '../matrix.component';

describe('MatrixComponent', () => {
    let component: MatrixComponent;
    let fixture: ComponentFixture<MatrixComponent>;
    let store: Store<any>;

    class MatrixViewBlockServiceMock {}

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.forRoot({}),
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
                MathService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: Angulartics2GoogleTagManager, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock }
            ]
        });

        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(MatrixComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it('ngAfterViewInit(), ngOnDestroy()', () => {
        expect(component.getTranslationSubscribe).toBeDefined();
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
        spyOn(component.appStateSubscription, 'unsubscribe');
        spyOn(component.matrixStateSubscription, 'unsubscribe');
        spyOn(component.resizeSubscribe, 'unsubscribe');
        spyOn(component.queryParamsSubscribe, 'unsubscribe');
        spyOn(component.scrollSubscribtion, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.matrixStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.scrollSubscribtion.unsubscribe).toHaveBeenCalled();
    });
});
