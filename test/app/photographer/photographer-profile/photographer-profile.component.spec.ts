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
// import {profile} from '../mocks/data.ts';
//
// import {PhotographerProfileComponent} from '../../../../app/photographer/photographer-profile/photographer-profile.component';
//
// describe('PhotographerProfileComponent', () => {
//   let mockPhotographerProfileService = new MockService();
//   mockPhotographerProfileService.serviceName = 'PhotographerProfileService';
//   mockPhotographerProfileService.getMethod = 'getPhotographerProfile';
//   mockPhotographerProfileService.fakeResponse = profile;
//   let mockCommonDependency = new MockCommonDependency();
//   beforeEachProviders(() => {
//     return [
//       mockCommonDependency.getProviders(),
//       mockPhotographerProfileService.getProviders(),
//     ];
//   });
//   xit('PhotographerProfileComponent must init ', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerProfileComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       fixture.detectChanges();
//       expect(context.photographer.imagesCount).toBe(289);
//       expect(context.photographer.placesCount).toBe(4);
//       mockPhotographerProfileService.toInitState();
//     });
//   }));
//   xit('PhotographerProfileComponent must destroy ', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerProfileComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       fixture.detectChanges();
//       fixture.destroy();
//       expect(mockPhotographerProfileService.countOfSubscribes).toBe(0);
//     });
//   }));
//   xit('PhotographerProfileComponent must show on mobile ', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerProfileComponent).then((fixture) => {
//       /**
//        * ToDo: create some cases for 
//        * checking mobile rendering
//        */
//     });
//   }));
//   xit('PhotographerProfileComponent must render photographer info', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerProfileComponent).then((fixture) => {
//       let nativeElement = fixture.debugElement.nativeElement;
//       fixture.detectChanges();
//       let photographerName = nativeElement.querySelector('#photographer-profile .header h2');
//       let photographerPhotos = nativeElement.querySelector('#photographer-profile .main .photo span');
//       expect(photographerName.innerHTML).toBe('AJ Sharma');
//       expect(photographerPhotos.innerHTML).toBe('289');
//       fixture.detectChanges();
//       photographerName = nativeElement.querySelector('#photographer-profile .header h2');
//       photographerPhotos = nativeElement.querySelector('#photographer-profile .main .photo span');
//       expect(photographerName.innerHTML).toBe('AJ Sharma');
//       expect(photographerPhotos.innerHTML).toBe('289');
//     });
//   }));
// });
