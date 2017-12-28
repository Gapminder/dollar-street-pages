import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from 'ng2-translate';
import { DropdownModule } from 'ng2-bootstrap';
import { StoreModule } from '@ngrx/store';
import {
    LanguageService,
    LocalStorageService,
    BrowserDetectionService,
    Angulartics2GoogleAnalytics
} from '../../../common';
import {
    LanguageServiceMock,
    LoaderServiceMock,
    BrowserDetectionServiceMock,
    AngularticsMock
} from '../../../test/';
import { SocialShareButtonsComponent } from '../../social-share-buttons/social-share-buttons.component';
import { LanguageSelectorComponent } from '../../language-selector/language-selector.component';
import { MainMenuComponent } from '../main-menu.component';

describe('MainMenuComponent', () => {
    let component: MainMenuComponent;
    let fixture: ComponentFixture<MainMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                DropdownModule,
                RouterTestingModule,
                StoreModule.forRoot({})
            ],
            declarations: [
                MainMenuComponent,
                SocialShareButtonsComponent,
                LanguageSelectorComponent
            ],
            providers: [
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: LocalStorageService, useClass: LoaderServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock }
            ]
        });

        fixture = TestBed.createComponent(MainMenuComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngAfterViewInit(), ngOnDestroy()', () => {
        component.ngOnInit();
        component.ngAfterViewInit();

        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.streetSettingsStateSubscription).toBeDefined();
        expect(component.appStateSubscription).toBeDefined();
        // expect(component.languagesListSubscription).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(component.appStateSubscription, 'unsubscribe');
        // spyOn(component.languagesListSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        // expect(component.languagesListSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
    });
});
