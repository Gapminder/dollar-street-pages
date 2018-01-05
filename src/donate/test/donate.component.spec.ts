import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TitleHeaderService } from '../../common';
import { TitleHeaderServiceMock } from '../../test/';
import { DonateComponent } from '../donate.component';
import { DonateService } from '../donate.service';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';

describe('DonateComponent', () => {
  let fixture: ComponentFixture<DonateComponent>;
  let component: DonateComponent;
  let donateSeervice: DonateServiceMock;

  class DonateServiceMock {
    public makeDonate(query: any): Observable<any> {
      return Observable.of({'success': true, 'error': null});
    }

    public showStripeDialog(config: any, cb: Function): void {
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: () => new TranslateStaticLoader(null, './assets/i18n', '.json')
        }),
        CommonServicesTestingModule
      ],
      declarations: [DonateComponent],
      providers: [
        {provide: DonateService, useClass: DonateServiceMock},
        {provide: TitleHeaderService, useClass: TitleHeaderServiceMock}
      ]
    });

    fixture = TestBed.createComponent(DonateComponent);
    donateSeervice = TestBed.get(DonateService);
    component = fixture.componentInstance;
  });

  it('create subscription on init', () => {
    fixture.detectChanges();

    expect(component.getTranslationSubscribe).toBeDefined();
  });

  it('unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component.getTranslationSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('set value in stripe popup', () => {
    const expectedDonateValue = '10';
    const expectedAmount = 1000; // donate value converted in cents
    const donateServiceSpy = spyOn(donateSeervice, 'showStripeDialog').and.stub();

    fixture.detectChanges();
    fixture.componentInstance.donateValue.nativeElement.value = expectedDonateValue;

    component.purchaseClicked(null);

    expect(donateServiceSpy).toHaveBeenCalled();
    expect(donateServiceSpy.calls.mostRecent().args[0].amount).toEqual(expectedAmount);
  });
});
