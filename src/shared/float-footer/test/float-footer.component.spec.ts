import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import {
    BrowserDetectionService,
    UtilsService,
    LanguageService,
    SocialShareService
} from '../../../common';
import {
    UtilsServiceMock,
    BrowserDetectionServiceMock,
    LanguageServiceMock,
} from '../../../test/';
import { FloatFooterComponent } from '../float-footer.component';
import { SocialShareButtonsComponent } from '../../social-share-buttons/social-share-buttons.component';
import { SocialShareButtonsService } from '../../social-share-buttons/social-share-buttons.service';

describe('FloatFooterComponent', () => {
    let fixture: ComponentFixture<FloatFooterComponent>;
    let component: FloatFooterComponent;

    class SocialShareButtonsServiceMock {

    }

    class SocialShareServiceMock {

    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule
            ],
            declarations: [
                FloatFooterComponent,
                SocialShareButtonsComponent
            ],
            providers: [
                TranslateService,
                TranslateLoader,
                TranslateParser,
                { provide: SocialShareButtonsService, useClass: SocialShareButtonsServiceMock },
                { provide: SocialShareService, useClass: SocialShareServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(FloatFooterComponent);
        component = fixture.componentInstance;
    }));

    it('ngAfterViewInit()', () => {
        component.ngOnInit();
        component.ngAfterViewInit();

        expect(component.isDesktop).toBeTruthy();
        expect(component.scrollSubscribe).toBeDefined();

        spyOn(component.scrollSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.scrollSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
