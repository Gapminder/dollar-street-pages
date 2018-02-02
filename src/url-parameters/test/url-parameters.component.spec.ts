import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlParametersComponent } from '../url-parameters.component';
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule } from "@ngrx/store";
import { UrlChangeService } from '../../common/url-change/url-change.service';
import { UrlChangeServiceMock } from '../../test/mocks/urlChange.service.mock';
import { UrlParametersServiceMock } from "../../test/mocks/url-parameters.service.mock";
import { UrlParametersService } from "../url-parameters.service";

describe('UrlParametersComponent', () => {
  let component: UrlParametersComponent;
  let fixture: ComponentFixture<UrlParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({})
      ],
      declarations: [ UrlParametersComponent ],
      providers: [
        {provide: UrlChangeService, useClass: UrlChangeServiceMock},
        { provide: UrlParametersService, useClass: UrlParametersServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
