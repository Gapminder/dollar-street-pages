// import {
//   it,
//   xit,
//   describe,
//   expect,
//   injectAsync,
//   beforeEachProviders,
//   TestComponentBuilder,
// } from 'angular2/testing';
//
// import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
// import {MockService} from '../../../app/common-mocks/mock.service.template';
// import {places} from '../mocks/data.ts';
//
// import {PhotographerPlacesComponent} from '../../../../app/photographer/photographer-places/photographer-places.component';
//
// describe('PhotographerPlacesComponent', () => {
//   let mockPhotographerPlacesService = new MockService();
//   mockPhotographerPlacesService.serviceName = 'PhotographerPlacesService';
//   mockPhotographerPlacesService.getMethod = 'getPhotographerPlaces';
//   mockPhotographerPlacesService.fakeResponse = places;
//   let mockCommonDependency = new MockCommonDependency();
//   beforeEachProviders(() => {
//     return [
//       mockCommonDependency.getProviders(),
//       mockPhotographerPlacesService.getProviders(),
//     ];
//   });
//   xit('PhotographerPlacesComponent must init', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerPlacesComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       fixture.detectChanges();
//       expect(context.countries.length).toBe(1);
//       expect(context.countries[0].places.length).toBe(4);
//       mockPhotographerPlacesService.toInitState();
//     });
//   }));
//   xit('PhotographerPlacesComponent must destroy ', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerPlacesComponent).then((fixture) => {
//       fixture.detectChanges();
//       fixture.destroy();
//       expect(mockPhotographerPlacesService.countOfSubscribes).toBe(0);
//     });
//   }));
//   xit('PhotographerPlacesComponent must show on mobile ', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerPlacesComponent).then((fixture) => {
//       /**
//        * ToDo: create some cases for
//        * checking mobile rendering
//        */
//     });
//   }));
//   xit('PhotographerPlacesComponent must render places', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerPlacesComponent).then((fixture) => {
//       let nativeElement = fixture.debugElement.nativeElement;
//       fixture.detectChanges();
//       let photographerCountries = nativeElement.querySelectorAll('#photographer-places .country');
//       let photographerCountryPlaces = nativeElement.querySelectorAll('#photographer-places .country:first-child .place');
//       expect(photographerCountries.length).toBe(1);
//       expect(photographerCountryPlaces.length).toBe(4);
//     });
//   }));
// });
