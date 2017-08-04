import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from '../footer.component';
import { FooterService } from '../footer.service';

describe('FooterComponent', () => {
    let componentInstance: FooterComponent;
    let componentFixture: ComponentFixture<FooterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [ FooterComponent ],
            providers: [
                FooterService
            ]
        });

        componentFixture = TestBed.overrideComponent(FooterComponent, {
            set: {
                template: ''
            }
        }).createComponent(FooterComponent);

        componentInstance = componentFixture.componentInstance;

        componentFixture.detectChanges();
    });

    it('ngOnInit()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            expect(componentInstance.streetSettingsStateSubscription).toBeDefined();
            expect(componentInstance.routerEventsSubscribe).toBeDefined();
            expect(componentInstance.footerServiceSubscribe).toBeDefined();

            spyOn(componentInstance.streetSettingsStateSubscription, 'unsubscribe');
            spyOn(componentInstance.routerEventsSubscribe, 'unsubscribe');
            spyOn(componentInstance.footerServiceSubscribe, 'unsubscribe');

            componentInstance.ngOnDestroy();

            expect(componentInstance.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.routerEventsSubscribe.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.footerServiceSubscribe.unsubscribe).toHaveBeenCalled();
        });
    });
});
