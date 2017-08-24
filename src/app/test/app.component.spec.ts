import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import { StoreModule, Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import {
    LanguageService,
    LoaderService,
    FontDetectorService,
    GoogleAnalyticsService,
    MathService,
    BrowserDetectionService,
    UtilsService,
    UrlChangeService,
    TitleHeaderService,
    ActiveThingService,
    LocalStorageService,
    SocialShareService
} from '../../common';
import {
    LanguageServiceMock,
    LoaderServiceMock,
    BrowserDetectionServiceMock,
    Angulartics2GoogleAnalyticsMock,
    UtilsServiceMock,
    UrlChangeServiceMock,
    TitleHeaderServiceMock,
    AngularticsMock,
    SocialShareServiceMock,
    TranslateServiceMock,
    TranslateLoaderMock,
    TranslateParserMock
} from '../../test/';
import { Angulartics2Module, Angulartics2GoogleAnalytics, Angulartics2 } from 'angulartics2';
import {
    SharedModule
} from '../../shared';
import { AppComponent } from '../app.component';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let store: Store<AppStates>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SharedModule,
                Angulartics2Module,
                StoreModule.forRoot({}),
                TranslateModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                FontDetectorService,
                GoogleAnalyticsService,
                MathService,
                ActiveThingService,
                LocalStorageService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: TranslateLoader, useClass: TranslateLoaderMock },
                { provide: TranslateParser, useClass: TranslateParserMock },
                { provide: SocialShareService, useClass: SocialShareServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: TitleHeaderService, useClass: TitleHeaderServiceMock },
                { provide: Angulartics2, useClass: AngularticsMock }
            ]
        });

        fixture = TestBed.createComponent(AppComponent);
        // fixture.detectChanges();
        component = fixture.componentInstance;
        // store = TestBed.get(Store);

        // spyOn(store, 'dispatch').and.callThrough();
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.loaderServiceSubscribe).toBeDefined();
        expect(component.documentCreatedSubscribe).toBeDefined();
        expect(component.routerEventsSubscribe).toBeDefined();

        spyOn(component.loaderServiceSubscribe, 'unsubscribe');
        spyOn(component.routerEventsSubscribe, 'unsubscribe');
        spyOn(component.documentCreatedSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.routerEventsSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.routerEventsSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.loaderServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });
});