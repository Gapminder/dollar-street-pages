import { it, inject, async, beforeEachProviders, beforeEach } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { FooterComponent } from '../../../../app/common/footer/footer.component';

xdescribe('FooterComponent', () => {
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });

  let context;
  let fixture;
  let nativeElement;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(FooterComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));

  it('FooterComponent must init', ()=> {
    expect(nativeElement.querySelector('.footer .logo_name').innerHTML).toEqual('Dollar Street');
  });
});
