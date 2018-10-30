import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import {
    BrowserDetectionService,
    LocalStorageService,
    UtilsService,
    LoaderService
} from '../../../../common';
import {
    LoaderServiceMock,
    BrowserDetectionServiceMock,
    UtilsServiceMock,
    TranslateLoaderMock,
    TranslateParserMock,
    TranslateServiceMock
} from '../../../../test/';
import { BubbleComponent } from '../bubble.component';
import { SocialShareButtonsComponent } from '../../../social-share-buttons/social-share-buttons.component';
import {CommonServicesTestingModule} from '../../../../test/commonServicesTesting.module';
import { Store, StoreModule } from '@ngrx/store';
import * as fromRoot from "../../../../app/ngrx/root.reducer";
import { AppStates } from '../../../../interfaces';

describe('BubbleComponent', () => {
    let component: BubbleComponent;
    let fixture: ComponentFixture<BubbleComponent>;
    let store: Store<AppStates>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                StoreModule.forRoot({ ...fromRoot.reducers }),
                CommonServicesTestingModule
            ],
            declarations: [
                BubbleComponent,
                SocialShareButtonsComponent
            ],
            providers: [
                LocalStorageService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: TranslateLoader, useClass: TranslateLoaderMock },
                { provide: TranslateParser, useClass: TranslateParserMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock }
            ]
        });

        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(BubbleComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.resizeSubscribe).toBeDefined();
        expect(component.keyUpSubscribe).toBeDefined();

        spyOn(component.keyUpSubscribe, 'unsubscribe');
        spyOn(component.resizeSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.keyUpSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('getBubble()', () => {
        component.ngOnInit();

        component.getBubble(2);
    });
});
