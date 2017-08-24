import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import {
    BrowserDetectionService
} from '../../../common';
import {
    BrowserDetectionServiceMock
} from '../../../test/';
import { StreetFamilyComponent } from '../street-family.component';
import { StreetFamilyDrawService } from '../street-family.service';

describe('StreetFamilyComponent', () => {
    let fixture: ComponentFixture<StreetFamilyComponent>;
    let component: StreetFamilyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({})
            ],
            declarations: [StreetFamilyComponent],
            providers: [
                StreetFamilyDrawService,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock }
            ]
        });

        fixture = TestBed.createComponent(StreetFamilyComponent);
        component = fixture.componentInstance;
    }));

    it('ngAfterViewInit(), ngOnDestroy()', () => {
        component.ngAfterViewInit();

        expect(component.streetSettingsStateSubscription).toBeDefined();
        expect(component.resizeSubscribe).toBeDefined();

        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(component.resizeSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    });
});