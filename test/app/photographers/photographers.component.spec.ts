import { it, describe, inject, async, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../app/common-mocks/mocked.services';
import { MockService } from '../../app/common-mocks/mock.service.template';
import { photographers } from './mocks/data';
import { PhotographersComponent } from '../../../src/photographers/photographers.component';

describe('Photographers Component', () => {
  let mockPhotographersService = new MockService();
  let mockCommonDependency = new MockCommonDependency();

  mockPhotographersService.serviceName = 'PhotographersService';
  mockPhotographersService.getMethod = 'getPhotographers';
  mockPhotographersService.fakeResponse = photographers;

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders(),
      mockPhotographersService.getProviders()
    ]);
  });

  let context;
  let fixture;
  let nativeElement;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(PhotographersComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));

  it('must init', ()=> {
    fixture.detectChanges();
    expect(context.photographersByCountry.length).toBe(4);
    expect(context.photographersByName.length).toBe(4);
    mockPhotographersService.toInitState();
  });

  it('must destroy', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(context.photographersServiceSubscribe.countOfSubscribes).toBe(0);
  });

  it('PhotographersComponent must show on mobile', ()=> {
    let searchInput = nativeElement.querySelector('.search-input');
    let sortButton = nativeElement.querySelector('.sort-country');

    expect(searchInput.classList.contains('show')).toBe(false);
    context.toggleLeftSide({target: sortButton});
    expect(searchInput.classList.contains('show')).toBe(true);
    context.toggleLeftSide({target: sortButton});
    expect(searchInput.classList.contains('show')).toBe(false);
  });

  it('PhotographersComponent must render photographers', ()=> {
    fixture.detectChanges();
    let photographerCard = nativeElement.querySelectorAll('.photographer-card');
    let countryCard = nativeElement.querySelectorAll('.country-card');
    expect(photographerCard.length).toBe(4);
    expect(countryCard.length).toBe(4);

    context.search.text = 'Anna Graboowska';

    fixture.detectChanges();

    photographerCard = nativeElement.querySelectorAll('.photographer-card');
    countryCard = nativeElement.querySelectorAll('.country-card');

    expect(photographerCard.length).toBe(1);
    expect(countryCard.length).toBe(2);
  });
});
