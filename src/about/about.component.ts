import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import {
  LoaderService,
  TitleHeaderService,
  LanguageService
} from '../common';
import { AboutService } from './about.service';
import { AppStateInterface, appState } from '../ngrx/app.state';
import { AppActions, setAction } from '../ngrx/app.actions';
import { AppEffects } from '../ngrx/app.effects';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  public about: any;
  public aboutContent: SafeHtml;
  public aboutService: AboutService;
  public aboutSubscribe: Subscription;
  public titleHeaderService: TitleHeaderService;
  public loaderService: LoaderService;
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;
  public store: Store<AppStateInterface>;
  public storeState: Observable<AppStateInterface>;

  public constructor(aboutService: AboutService,
                     loaderService: LoaderService,
                     titleHeaderService: TitleHeaderService,
                     languageService: LanguageService,
                     store: Store<AppStateInterface>) {
    this.aboutService = aboutService;
    this.loaderService = loaderService;
    this.titleHeaderService = titleHeaderService;
    this.languageService = languageService;
    this.store = store;

    this.storeState = store.select(appState);

    this.storeState.subscribe((state: AppStateInterface) => {
      console.log(state);
    });
  }

  public ngAfterViewInit(): void {
    setInterval(()=>{
      this.store.dispatch(setAction(AppEffects.GET_STREET_SETTINGS))
    }, 1000);

    this.loaderService.setLoader(false);

    this.getTranslationSubscribe = this.languageService.getTranslation('ABOUT').subscribe((trans: any) => {
      this.titleHeaderService.setTitle(trans);
    });

    this.aboutSubscribe = this.aboutService.getInfo(this.languageService.getLanguageParam()).subscribe((val: any) => {
      if (val.err) {
        console.error(val.err);
        return;
      }

      this.loaderService.setLoader(true);

      this.about = val.data;

      this.aboutContent = this.languageService.getSunitizedString(this.about.context);
    });
  }

  public ngOnDestroy(): void {
    if (this.aboutSubscribe) {
      this.aboutSubscribe.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }
}
