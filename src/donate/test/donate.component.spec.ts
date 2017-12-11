import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TitleHeaderService } from '../../common';
import { TitleHeaderServiceMock } from '../../test/';
import { DonateComponent } from '../donate.component';
import { DonateService } from '../donate.service';
import { TranslateTestingModule } from '../../test/translateTesting.module';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';

describe('DonateComponent', () => {
  let fixture: ComponentFixture<DonateComponent>;
  let component: DonateComponent;

  class DonateServiceMock {
    public makeDonate(): Observable<any> {
      return Observable.of({'success': true, 'error': null});
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        CommonServicesTestingModule
      ],
      declarations: [DonateComponent],
      providers: [
        {provide: DonateService, useClass: DonateServiceMock},
        {provide: TitleHeaderService, useClass: TitleHeaderServiceMock}
      ]
    });

    fixture = TestBed.createComponent(DonateComponent);
    component = fixture.componentInstance;
  }));

  it('ngOnInit(), ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.getTranslationSubscribe).toBeDefined();

    spyOn(component.getTranslationSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
