import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { LoaderComponent } from "../loader.component";

describe('LoaderComponent', () => {
    let fixture: ComponentFixture<LoaderComponent>;
    let component: LoaderComponent;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [LoaderComponent],
            providers: []
        });

        fixture = TestBed.createComponent(LoaderComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div'));
        nativeElement = debugElement.nativeElement;
    }));

    it('ngOnInit()', () => {
        component.ngOnInit();
    });

    it('Div with ID', () => {
        expect(nativeElement.getAttribute('id')).toEqual('loader-container');
    });
});
