import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BlankComponentStub } from '../../../test/';
import { FooterSpaceDirective } from '../footer-space.directive';

describe('FooterSpaceDirective', () => {
    let fixture: ComponentFixture<BlankComponentStub>;
    let component: BlankComponentStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                BlankComponentStub,
                FooterSpaceDirective
            ],
            providers: []
        });

        fixture = TestBed.overrideComponent(BlankComponentStub, {
            set: {
                template: '<div footerSpace></div>'
            }
        }).createComponent(BlankComponentStub);
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
