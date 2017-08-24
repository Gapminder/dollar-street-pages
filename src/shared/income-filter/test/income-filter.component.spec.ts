import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import { StoreModule } from '@ngrx/store';
import {
    MathService
} from '../../../common';
import {
    TranslateLoaderMock,
    TranslateParserMock,
    TranslateServiceMock
} from '../../../test/';
import { StreetFilterComponent } from '../../street-filter/street-filter.component';
import { StreetFilterDrawService } from '../../street-filter/street-filter.service';
import { IncomeFilterComponent } from '../income-filter.component';

describe('IncomeFilterComponent', () => {
    let fixture: ComponentFixture<IncomeFilterComponent>;
    let component: IncomeFilterComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                StoreModule.forRoot({})
            ],
            declarations: [
                IncomeFilterComponent,
                StreetFilterComponent
            ],
            providers: [
                MathService,
                StreetFilterDrawService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: TranslateLoader, useClass: TranslateLoaderMock },
                { provide: TranslateParser, useClass: TranslateParserMock }
            ]
        });

        fixture = TestBed.createComponent(IncomeFilterComponent);
        component = fixture.componentInstance;
    }));

    it('ngAfterViewInit()', () => {
        component.ngAfterViewInit();

        expect(component.streetSettingsStateSubscription).toBeDefined();

        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('initData()', () => {
        component.ngAfterViewInit();

        component.initData();
    });
});