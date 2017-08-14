import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { TranslateModule } from 'ng2-translate';
import { StoreModule } from '@ngrx/store';
import {
    LocalStorageService,
    LanguageService
} from '../../../common';
import {
    LanguageServiceMock
} from '../../../test/';
import { SocialShareButtonsComponent } from '../../social-share-buttons/social-share-buttons.component';
import { GuideComponent } from '../guide.component';
import { GuideService } from '../guide.service';
import { BubbleComponent } from '../bubble/bubble.component';

describe('GuideComponent', () => {
    let fixture: ComponentFixture<GuideComponent>;
    let component: GuideComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                StoreModule.forRoot({})
            ],
            declarations: [
                GuideComponent,
                BubbleComponent,
                SocialShareButtonsComponent
            ],
            providers: [
                GuideService,
                LocalStorageService,
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(GuideComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.guideServiceSubscribe).toBeDefined();
        expect(component.localStorageServiceSubscription).toBeDefined();

        spyOn(component.guideServiceSubscribe, 'unsubscribe');
        spyOn(component.localStorageServiceSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.guideServiceSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.localStorageServiceSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('openQuickTour()', () => {
        component.ngOnInit();

        component.openQuickTour();

        expect(component.isShowGuide).toBeFalsy();
        expect(component.isShowBubble).toBeTruthy();
    });

    it('closeQuickGuide()', () => {
        component.ngOnInit();

        component.closeQuickGuide();

        component.isShowBubble = false;
        component.isShowGuide = false;
    });
});
