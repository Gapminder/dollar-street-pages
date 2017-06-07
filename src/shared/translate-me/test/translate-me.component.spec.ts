import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { LanguageService } from '../../../common';

import { TranslateMeComponent } from '../translate-me.component';

describe('TranslateMeComponent', () => {
    let componentInstance: TranslateMeComponent;
    let componentFixture: ComponentFixture<TranslateMeComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    class MockLanguageService {
        public getTranslation(): Observable<any> {
            return Observable.of('the world');
        }

        public getLanguageParam(): string {
            return '&lang=en';
        }
    }

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ TranslateMeComponent ],
            providers: [
                        { provide: LanguageService, useClass: MockLanguageService }
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

        expect(componentInstance.languageService).toBeDefined();

        componentInstance.ngOnDestroy();
    });
});
