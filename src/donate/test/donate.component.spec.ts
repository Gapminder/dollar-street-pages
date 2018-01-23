import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { TranslateTestingModule } from '../../test/translateTesting.module';
import { DonateComponent } from '../donate.component';
import { DonateService } from '../donate.service';

describe('DonateComponent', () => {
  let fixture: ComponentFixture<DonateComponent>;
  let component: DonateComponent;
  let donateSeervice: DonateServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonServicesTestingModule,
        TranslateTestingModule
      ],
      declarations: [DonateComponent],
      providers: [
        { provide: DonateService, useClass: DonateServiceMock }
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

  it('donate input: hide placeholder on click', () => {
    const addAmountEl = component.addAmount.nativeElement;
    addAmountEl.click();

    fixture.detectChanges();

    expect(addAmountEl.getAttribute('style')).toEqual('visibility: hidden;');
  });

  it('donate input: show placeholder on blur when value is empty', () => {
    const addAmountEl = component.addAmount.nativeElement;
    const donateValue = component.donateValue.nativeElement;

    addAmountEl.click();

    donateValue.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(addAmountEl.getAttribute('style')).toEqual('visibility: visible;');
  });

  it('donate input: show value on blur', () => {
    const addAmountEl = component.addAmount.nativeElement;
    const donateValue = component.donateValue.nativeElement;

    addAmountEl.click();
    donateValue.value = 123;

    donateValue.dispatchEvent(new Event('input'));
    donateValue.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(addAmountEl.getAttribute('style')).toEqual('visibility: hidden;');
  });
});

class DonateServiceMock {
  public makeDonate(query: any): Observable<any> {
    return Observable.of({ 'success': true, 'error': null });
  }

  public showStripeDialog(config: any, cb: Function): void {
  }
}
