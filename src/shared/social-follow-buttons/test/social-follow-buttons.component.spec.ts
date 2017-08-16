import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import { SocialFollowButtonsComponent } from '../social-follow-buttons.component';

describe('SocialFollowButtonsComponent', () => {
    let fixture: ComponentFixture<SocialFollowButtonsComponent>;
    let component: SocialFollowButtonsComponent;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule
            ],
            declarations: [SocialFollowButtonsComponent],
            providers: [
                TranslateLoader,
                TranslateService,
                TranslateParser
            ]
        });

        fixture = TestBed.createComponent(SocialFollowButtonsComponent);
        component = fixture.componentInstance;

        debugElement = fixture.debugElement.query(By.css('div'));
        nativeElement = debugElement.nativeElement;
    }));

    it('DIV with class', () => {
        expect(nativeElement.getAttribute('class')).toEqual('follow-button-container');
    });
});