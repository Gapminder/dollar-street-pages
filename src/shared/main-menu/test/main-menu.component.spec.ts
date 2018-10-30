import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { DropdownModule } from 'ng2-bootstrap';
import { StoreModule } from '@ngrx/store';
import {
  LanguageService,
  LocalStorageService,
  BrowserDetectionService,
  Angulartics2GoogleTagManager, SocialShareService
} from '../../../common';
import { forEach } from 'lodash';
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
import { Subscription } from 'rxjs/Subscription';

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
                { provide: Angulartics2GoogleTagManager, useClass: AngularticsMock }
            ]
        });

        fixture = TestBed.createComponent(MainMenuComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngAfterViewInit(), ngOnDestroy()', () => {
      component.ngOnInit();
      component.ngAfterViewInit();

      forEach(component.ngSubscriptions, (subscription: Subscription) => {
        spyOn(subscription, 'unsubscribe');
      });

      component.ngOnDestroy();

      forEach(component.ngSubscriptions, (subscription: Subscription) => {
        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
});
