import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlParametersComponent } from './url-parameters.component';

describe('UrlParametersComponent', () => {
  let component: UrlParametersComponent;
  let fixture: ComponentFixture<UrlParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlParametersComponent ]
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
