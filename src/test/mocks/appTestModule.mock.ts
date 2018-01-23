import { BlankComponentStub } from './blank.component.mock';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BlankComponentStub],
  exports: [BlankComponentStub]
})
export class AppTestModule {
}
