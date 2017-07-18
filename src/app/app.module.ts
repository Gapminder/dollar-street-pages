import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app.routing';

import { MatrixModule } from '../matrix/matrix.module';

import { SharedModule } from '../shared';

import { CommonAppModule } from '../common';

import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { Observable } from 'rxjs';

import { TranslateModule, TranslateLoader } from 'ng2-translate';

/* tslint:disable:no-unused-variable */  // Turn off TSLint for unused variable. Needed for custom loader.
export class CustomLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.of({KEY: 'value'});
  }
}
/* tslint:enable:no-unused-variable */

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    CommonAppModule,
    AppRoutingModule,
    SharedModule,
    MatrixModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useClass: CustomLoader
    }),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
