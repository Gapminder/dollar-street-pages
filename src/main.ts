import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Config } from './app.config';
import { AppModule } from './app/app.module';

if (Config.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
