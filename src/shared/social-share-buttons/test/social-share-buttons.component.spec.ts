import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { LanguageService, SocialShareService } from '../../../common';
import { LanguageServiceMock } from "../../../test/";
import { SocialShareButtonsComponent } from '../social-share-buttons.component';
import { SocialShareButtonsService } from '../social-share-buttons.service';

describe('SocialShareButtonsComponent', () => {
    let fixture: ComponentFixture<SocialShareButtonsComponent>;
    let component: SocialShareButtonsComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [SocialShareButtonsComponent],
            providers: [
                SocialShareButtonsService,
                SocialShareService,
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(SocialShareButtonsComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.getTranslationSubscribe).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('openPopUp()', () => {
        component.ngOnInit();

        spyOn(component.window, 'open').and.callFake(() => {});

        component.openPopUp('twitter');

        expect(component.socialShareButtonsServiceSubscribe).toBeDefined();
    });
});