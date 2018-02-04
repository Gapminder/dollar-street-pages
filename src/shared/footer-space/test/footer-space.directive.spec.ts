import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BlankComponent } from '../../../test/';
import { FooterSpaceDirective } from '../footer-space.directive';

describe('FooterSpaceDirective', () => {
    let fixture: ComponentFixture<BlankComponent>;
    let component: BlankComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                BlankComponent,
                FooterSpaceDirective
            ],
            providers: []
        });

        fixture = TestBed.overrideComponent(BlankComponent, {
            set: {
                template: '<div footerSpace></div>'
            }
        }).createComponent(BlankComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit()', () => {
        const directiveElement = fixture.debugElement.query(By.directive(FooterSpaceDirective));
        expect(directiveElement).not.toBeNull();

        const directiveInstance = directiveElement.injector.get(FooterSpaceDirective);

        directiveInstance.ngOnInit();

        expect(directiveInstance.resizeSubscribe).toBeDefined();

        spyOn(directiveInstance.resizeSubscribe, 'unsubscribe');

        directiveInstance.ngOnDestroy();

        expect(directiveInstance.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    });
});