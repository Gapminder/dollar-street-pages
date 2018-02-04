import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: () => new TranslateStaticLoader(null, './assets/i18n', '.json')
    })
  ],
  exports: [
    TranslateModule
  ]
})

export class TranslateTestingModule {
}

