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
// import {MockCommonDependency} from '../../../app/common-mocks/mocked.services'
// import {FamilyPlaceComponent} from '../../../../app/place/family/family-place.component';
// import {MockService} from '../../common-mocks/mock.service.template.ts'
// import {places, place} from '../mocks/data.ts';
//
// describe('FamilyPlaceComponent', () => {
//   let placesObservable:MockService;
//   let mockFamilyPlaceService:MockService;
//   beforeEachProviders(() => {
//     placesObservable = new MockService();
//     mockFamilyPlaceService = new MockService();
//     placesObservable.fakeResponse = place;
//     mockFamilyPlaceService.serviceName = 'FamilyPlaceService';
//     mockFamilyPlaceService.getMethod = 'getPlaceFamilyImages';
//     mockFamilyPlaceService.fakeResponse = places;
//     let mockCommonDependency = new MockCommonDependency();
//     return [
//       mockCommonDependency.getProviders(),
//       mockFamilyPlaceService.getProviders()
//     ];
//   });
//   xit(' must init ', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(FamilyPlaceComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.chosenPlaces = placesObservable;
//       fixture.detectChanges();
//       expect(context.placeId).toEqual('54b6862f3755cbfb542c28cb');
//       expect(context.images.length).toEqual(5);
//       placesObservable.toInitState();
//       mockFamilyPlaceService.toInitState();
//     });
//   }));
//   xit(' must destroy ', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(FamilyPlaceComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       context.chosenPlaces = placesObservable;
//       fixture.detectChanges();
//       fixture.destroy();
//       expect(placesObservable.countOfSubscribes).toEqual(0);
//       expect(mockFamilyPlaceService.countOfSubscribes).toEqual(0);
//     });
//   }));
// });
