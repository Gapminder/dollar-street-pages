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
// import {MockCommonDependency} from '../../app/common-mocks/mocked.services';
// import {PhotographerComponent} from '../../../app/photographer/photographer.component';
//
//
// describe('PhotographerComponent', () => {
//   beforeEachProviders(() => {
//     let mockCommonDependency = new MockCommonDependency();
//     return [
//       mockCommonDependency.getProviders()
//     ];
//   });
//   xit('PhotographerComponent must init', injectAsync([TestComponentBuilder], (tcb) => {
//     return tcb.createAsync(PhotographerComponent).then((fixture) => {
//       let context = fixture.debugElement.componentInstance;
//       fixture.detectChanges();
//       let nativeElement = fixture.debugElement.nativeElement;
//       expect(nativeElement.querySelector('.heading').innerHTML).toEqual(context.title);
//     });
//   }));
// });
