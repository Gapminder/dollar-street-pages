import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';
import { TranslateModule } from 'ng2-translate';
import { StoreModule } from '@ngrx/store';
import { AngularticsMock } from '../../../test/';
import { MatrixViewBlockComponent } from '../matrix-view-block.component';
import { MatrixViewBlockService } from '../matrix-view-block.service';
import { StreetDrawService } from '../../../shared/street/street.service';
import { StreetDrawServiceMock } from '../../../test/mocks/streetDrawService.mock';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { MockComponent } from 'ng2-mock-component';
import { ImageLoadedService } from '../../../shared/image-loaded/image-loaded.service';
import { ImageLoadedServiceMock } from '../../../test/mocks/image-loader.service.mock';

describe('MatrixViewBlockComponent', () => {
  let component: MatrixViewBlockComponent;
  let fixture: ComponentFixture<MatrixViewBlockComponent>;

  class MatrixViewBlockServiceMock {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule,
        RouterTestingModule,
        Angulartics2Module,
        StoreModule.forRoot({}),
        CommonServicesTestingModule
      ],
      declarations: [
        MatrixViewBlockComponent,
        MockComponent({ selector: 'translate-me' }),
        MockComponent({ selector: 'region-map', inputs: ['mapData'] })
      ],
      providers: [
        { provide: MatrixViewBlockService, useClass: MatrixViewBlockServiceMock },
        { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
        { provide: StreetDrawService, useClass: StreetDrawServiceMock },
        { provide: ImageLoadedService, useClass: ImageLoadedServiceMock },
      ]
    });

    fixture = TestBed.createComponent(MatrixViewBlockComponent);
    component = fixture.componentInstance;

    component.query = '?thing=Families&countries=World&region=World';
    component.streetData = {
      showDividers: true,
      low: 27,
      medium: 140,
      high: 500,
      poor: 30,
      rich: 60,
      lowDividerCoord: 0,
      mediumDividerCoord: 100,
      highDividerCoord: 200
    };
  }));

  it('ngOnInit()', () => {
    component.ngOnInit();

    expect(component.streetSettingsStateSubscription).toBeDefined();
    expect(component.resizeSubscribe).toBeDefined();

    spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
    spyOn(component.resizeSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('fancyBoxClose()', () => {
    component.fancyBoxClose();

    expect(component.popIsOpen).toBeFalsy();
    expect(component.fancyBoxImage).toBeFalsy();
  });

  it('goToMatrixByCountry()', () => {
    component.goToMatrixByCountry('Nigeria');
  });

  it('getDescription()', () => {
    const description = 'This is a long description';

    let resp = component.getDescription(description);

    expect(resp).toEqual(description);
  });

  it('truncCountryName()', () => {
    let resp = component.truncCountryName({ alias: 'South Africa' });

    expect(resp).toEqual('SA');
  });
});
