import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { UrlParametersComponent } from '../url-parameters.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { UrlChangeService } from '../../common/url-change/url-change.service';
import { UrlChangeServiceMock } from '../../test/mocks/urlChange.service.mock';
import { UrlParametersService } from '../url-parameters.service';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { Router } from '@angular/router';
import { DEBOUNCE_TIME } from '../../defaultState';

describe('UrlParametersComponent', () => {
  let component: UrlParametersComponent;
  let urlParametersService: UrlParametersService;
  let fixture: ComponentFixture<UrlParametersComponent>;
  let router: Router;

  const simpleRoutes = [{ path: 'matrix', component: UrlParametersComponent },
    { path: 'family', component: UrlParametersComponent }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(simpleRoutes),
        StoreModule.forRoot({}),
        CommonServicesTestingModule
      ],
      declarations: [UrlParametersComponent],
      providers: [
        { provide: UrlChangeService, useClass: UrlChangeServiceMock }
      ]
    })
      .compileComponents();

    router = TestBed.get(Router);
    urlParametersService = TestBed.get(UrlParametersService);
    router.initialNavigation();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('take first subscribe frome route',
    fakeAsync(() => {
        spyOn(urlParametersService, 'dispatchToStore');
        spyOn(urlParametersService, 'combineUrlPerPage');
        spyOn(urlParametersService, 'removeActiveHouse');

        router.navigate(['/matrix']);
        tick(DEBOUNCE_TIME);
        fixture.detectChanges();

        expect(urlParametersService.dispatchToStore).toHaveBeenCalled();
        expect(urlParametersService.combineUrlPerPage).toHaveBeenCalled();
        expect(urlParametersService.removeActiveHouse).toHaveBeenCalled();
      }));

});
