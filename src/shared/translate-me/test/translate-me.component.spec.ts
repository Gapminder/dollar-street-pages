import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LanguageService } from '../../../common';
import {
    LanguageServiceMock
} from '../../../test/';
import { TranslateMeComponent } from '../translate-me.component';

describe('TranslateMeComponent', () => {
    let componentInstance: TranslateMeComponent;
    let componentFixture: ComponentFixture<TranslateMeComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ TranslateMeComponent ],
            providers: [
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        }).compileComponents();

        componentFixture = TestBed.createComponent(TranslateMeComponent);

        componentInstance = componentFixture.componentInstance;
        debugElement = componentFixture.debugElement.query(By.css('div'));
        nativeElement = debugElement.nativeElement;

        componentFixture.detectChanges();
    }));

    it('ngOnInit() ngOnDestroy()', () => {
        componentInstance.ngOnInit();

        componentInstance.ngOnDestroy();
    });
});
