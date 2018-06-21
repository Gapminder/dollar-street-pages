import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from 'ng2-translate';
import { DropdownModule } from 'ng2-bootstrap';
import { StoreModule } from '@ngrx/store';
import {
  LanguageService,
  LocalStorageService,
  BrowserDetectionService,
  Angulartics2GoogleTagManager
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
import { Subscription } from 'rxjs/Subscription';
import { forEach } from 'lodash';

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
                { provide: Angulartics2GoogleTagManager, useClass: AngularticsMock }
            ]
        });

        fixture = TestBed.createComponent(MainMenuComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngAfterViewInit(), ngOnDestroy()', () => {
      component.ngOnInit();
      component.ngAfterViewInit();

      forEach(component.ngSubscriptions, ( subscription: Subscription ) => {
        spyOn(subscription, 'unsubscribe');
      });

      component.ngOnDestroy();

      forEach(component.ngSubscriptions, ( subscription: Subscription ) => {
        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
});
