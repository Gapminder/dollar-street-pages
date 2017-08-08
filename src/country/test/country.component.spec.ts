import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
    MathService,
    TitleHeaderService
} from '../../common';
import {
    TitleHeaderServiceMock
} from '../../test/';
import { CountryComponent } from '../country.component';

describe('CountryComponent', () => {
    let componentFixture: ComponentFixture<CountryComponent>;
    let componentInstance: CountryComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [CountryComponent],
            providers: [
                MathService,
                { provide: TitleHeaderService, useClass: TitleHeaderServiceMock }
            ]
        });

        componentFixture = TestBed.overrideComponent(CountryComponent, {
            set: {
                template: ''
            }
        }).createComponent(CountryComponent);

        componentInstance = componentFixture.componentInstance;
    });

    it('ngOnInit(), ngOnDestroy()', () => {
        componentInstance.ngOnInit();

        expect(componentInstance.queryParamsSubscribe).toBeDefined();

        spyOn(componentInstance.queryParamsSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
