import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DropdownModule } from 'ng2-bootstrap';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import {
    LanguageService
} from '../../../common';
import {
    LanguageServiceMock
} from '../../../test/';
import { LanguageSelectorComponent } from '../language-selector.component';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { StoreModule } from '@ngrx/store';

describe('LanguageSelectorComponent', () => {
    let fixture: ComponentFixture<LanguageSelectorComponent>;
    let component: LanguageSelectorComponent;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
              DropdownModule,
              CommonServicesTestingModule,
              StoreModule.forRoot({}),
            ],
            declarations: [LanguageSelectorComponent],
            providers: [
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(LanguageSelectorComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div'));
        nativeElement = debugElement.nativeElement;
    }));

    it('Div with class', () => {
        expect(nativeElement.getAttribute('class')).toEqual('lang-container');
    });
});
