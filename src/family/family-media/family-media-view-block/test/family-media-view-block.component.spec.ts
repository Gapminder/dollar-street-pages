import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyMediaViewBlockComponent } from '../family-media-view-block.component';
import { FamilyMediaViewBlockService } from '../family-media-view-block.service';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { mockFamilyMediaText } from './mock.data';
import { BlankComponentStub } from '../../../../test/';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonServicesTestingModule } from '../../../../test/commonServicesTesting.module';
import { StreetDrawService } from '../../../../shared/street/street.service';
import { StreetDrawServiceMock } from '../../../../test/mocks/streetDrawService.mock';
import { ImageLoadedServiceMock } from '../../../../test/mocks/image-loader.service.mock';
import { ImageLoadedService } from '../../../../shared/image-loaded/image-loaded.service';

describe('FamilyMediaViewBlockComponent', () => {
  let componentInstance: FamilyMediaViewBlockComponent;
  let componentFixture: ComponentFixture<FamilyMediaViewBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonServicesTestingModule,
        StoreModule.forRoot({}),
        RouterTestingModule.withRoutes([{path: '', component: BlankComponentStub}]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FamilyMediaViewBlockComponent, BlankComponentStub],
      providers: [
        { provide: FamilyMediaViewBlockService, useValue: {} },
        { provide: StreetDrawService, useValue: StreetDrawServiceMock},
        { provide: ImageLoadedService, useClass: ImageLoadedServiceMock },
      ]
    });

    componentFixture = TestBed.createComponent(FamilyMediaViewBlockComponent);

    componentInstance = componentFixture.componentInstance;

    componentInstance.imageData = {
      photographer: 'mockPhotographer',
      image: 'http://dollar-street.org/images/imageId=1234567890'
    };

  });

  it('ngOnInit() ngOnDestroy()', () => {
    componentInstance.ngOnInit();

    componentInstance.ngOnDestroy();
  });

  it('openPopUp()', () => {
    componentInstance.ngOnInit();

    componentInstance.openPopUp();

    expect(componentInstance.popIsOpen).toBeTruthy();
  });

  it('fancyBoxClose()', () => {
    componentInstance.ngOnInit();

    componentInstance.fancyBoxClose();

    expect(componentInstance.popIsOpen).toBeFalsy();
  });

  it('truncCountryName()', () => {
    const mockCountryData: any = {
      name: 'United States'
    };

    componentInstance.ngOnInit();

    componentInstance.truncCountryName(mockCountryData);

    expect(componentInstance.countryName).toEqual('USA');
  });

  it('getDescription()', () => {
    componentInstance.ngOnInit();

    let textLength: number = componentInstance.getDescription(mockFamilyMediaText).length;

    expect(textLength).toEqual(203);
  });
});
