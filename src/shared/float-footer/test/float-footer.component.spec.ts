import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import {
    BrowserDetectionService,
    UtilsService
} from '../../../common';
import { FloatFooterComponent } from '../float-footer.component';

describe('FloatFooterComponent', () => {
    let componentInstance: FloatFooterComponent;
    let componentFixture: ComponentFixture<FloatFooterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ FloatFooterComponent ],
            providers: [
                BrowserDetectionService,
                UtilsService
            ]
        });

        componentFixture = TestBed.overrideComponent(FloatFooterComponent, {
            set: {
                template: ''
            }
        }).createComponent(FloatFooterComponent);

        componentInstance = componentFixture.componentInstance;
    });

    it('ngAfterViewInit()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();
            componentInstance.ngAfterViewInit();

            expect(componentInstance.isDesktop).toBeTruthy();
            expect(componentInstance.scrollSubscribe).toBeDefined();

            spyOn(componentInstance.scrollSubscribe, 'unsubscribe');

            componentInstance.ngOnDestroy();

            expect(componentInstance.scrollSubscribe.unsubscribe).toHaveBeenCalled();
        });
    });
});