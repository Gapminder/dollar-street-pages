import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { DropdownModule } from 'ng2-bootstrap';
import { StoreModule } from '@ngrx/store';
import {
  LanguageService,
  LocalStorageService,
  BrowserDetectionService,
  Angulartics2GoogleAnalytics, SocialShareService
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
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { SocialShareButtonsService } from '../../social-share-buttons/social-share-buttons.service';
import { SocialShareServiceMock } from '../../../test/mocks/socialShare.service.mock';

class SocialShareButtonsServiceMock {

};

describe('MainMenuComponent', () => {
    let component: MainMenuComponent;
    let fixture: ComponentFixture<MainMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonServicesTestingModule,
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
                { provide: SocialShareService, useClass: SocialShareServiceMock },
                { provide: SocialShareButtonsService, useClass: SocialShareButtonsServiceMock },
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

        expect(component.streetSettingsStateSubscription).toBeDefined();
        expect(component.appStateSubscription).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(component.appStateSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
    });
});
