import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { PagePositionComponent } from "../page-position.component";
import { StoreModule } from "@ngrx/store";
import { CommonServicesTestingModule } from "../../../test/commonServicesTesting.module";
import { RouterTestingModule } from "@angular/router/testing";
import { UrlParametersComponent } from "../../../url-parameters/url-parameters.component";
import { Router } from "@angular/router";
import { UrlChangeService } from "../../../common/url-change/url-change.service";
import { UrlChangeServiceMock } from "../../../test/mocks/urlChange.service.mock";
import { UrlParametersServiceMock } from "../../../test/mocks/url-parameters.service.mock";
import { UrlParametersService } from "../../../url-parameters/url-parameters.service";
import { PagePositionService } from "../page-position.service";

describe('PagePositionComponent', () => {
  let component: PagePositionComponent;
  let fixture: ComponentFixture<PagePositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        CommonServicesTestingModule,
      ],
      declarations: [PagePositionComponent],
      providers: [
        { provide: UrlChangeService, useClass: UrlChangeServiceMock },
      ]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('scroll', inject( [PagePositionService, UrlParametersService], (pagePositionService: PagePositionService, urlParametersService: UrlParametersService) => {
    const row = 3;
    spyOn(pagePositionService, 'getGridContainerRect');
    spyOn(pagePositionService, 'getCurrentRow').and.returnValue(row);
    spyOn(urlParametersService, 'setGridPosition');

    window.scrollTo(0,0);
    const scrollEvent = document.createEvent('CustomEvent');
    scrollEvent.initCustomEvent('scroll', false, false, null);

    const expectedLeft = 0;
    const expectedTop = 500;

    window.dispatchEvent(scrollEvent);

    // fixture.detectChanges()

    expect(pagePositionService.getGridContainerRect).toHaveBeenCalled();
    expect(pagePositionService.getCurrentRow).toHaveBeenCalled();
    expect(urlParametersService.setGridPosition).toHaveBeenCalledWith(row);
  }));

});
