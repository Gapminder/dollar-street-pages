import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import {
    MathService,
} from '../../../common';

import { StreetFilterComponent } from '../street-filter.component';
import { StreetFilterDrawService} from '../street-filter.service';

class MockStreetFilterDrawService {
    public filter: Observable<any> = Observable.of([1, 2, 3, 4, 5]);

    public set(a: string, b: boolean): MockStreetFilterDrawService {
        return this;
    }

    public init(): MockStreetFilterDrawService {
        return this;
    }

    public drawScale(): MockStreetFilterDrawService {
        return this;
    }

    public clearSvg(): MockStreetFilterDrawService {
        return this;
    }
}

describe('StreetFilterComponent', () => {
    let componentInstance: StreetFilterComponent;
    let componentFixture: ComponentFixture<StreetFilterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({})
            ],
            declarations: [ StreetFilterComponent ],
            providers: [
                MathService,
                { provide: StreetFilterDrawService, useClass: MockStreetFilterDrawService }
            ]
        }).compileComponents();

        componentFixture = TestBed.createComponent(StreetFilterComponent);
        componentInstance = componentFixture.componentInstance;

        componentFixture.detectChanges();
    });

    it('ngAfterViewInit(), ngOnDestroy()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngAfterViewInit();

            expect(componentInstance.streetFilterSubscribe).toBeDefined();
            expect(componentInstance.streetSettingsStateSubscription).toBeDefined();
            expect(componentInstance.resizeSubscription).toBeDefined();

            spyOn(componentInstance.resizeSubscription, 'unsubscribe');
            spyOn(componentInstance.streetSettingsStateSubscription, 'unsubscribe');
            spyOn(componentInstance.streetFilterSubscribe, 'unsubscribe');

            componentInstance.ngOnDestroy();

            expect(componentInstance.resizeSubscription.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.streetFilterSubscribe.unsubscribe).toHaveBeenCalled();
        });
    });
});
