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

describe('BubbleComponent', () => {
    let component: BubbleComponent;
    let fixture: ComponentFixture<BubbleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule
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
        })

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