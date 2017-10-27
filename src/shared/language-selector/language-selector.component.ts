
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Input
} from '@angular/core';
import {
  LanguageService
} from '../../common';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  public disabled: boolean = false;
  public status: {isOpen: boolean} = {isOpen: false};
  public element: HTMLElement;
  public window: Window = window;
  public currentLanguage: string;
  public languagesListSubscription: Subscription;
  public languages: any[];
  public selectedLanguage: any;
  public filteredLanguages: any[];

  public constructor(elementRef: ElementRef,
                     private languageService: LanguageService) {
    this.element = elementRef.nativeElement;
  }

  public ngOnInit(): void {
    this.languagesListSubscription = this.languageService.languagesList.subscribe((data: any) => {
      this.languages = data;
      this.updateLanguages();
    });
  }

  public ngOnDestroy(): void {
    if (this.languagesListSubscription) {
      this.languagesListSubscription.unsubscribe();
    }
  }

  public updateLanguages(): void {
    this.selectedLanguage = this.languages.find(lang => lang.code === this.languageService.currentLanguage);

    if (this.selectedLanguage) {
      this.filteredLanguages = this.languages.filter(lang => lang.code !== this.selectedLanguage.code);
    } else {
      this.selectedLanguage = this.languages.find(lang => lang.code === 'en');
      this.filteredLanguages = this.languages.filter(lang => lang.code !== 'en');
    }
  }

  public changeLanguage(lang: string): void {
    if (this.languageService.currentLanguage === lang) {
      return;
    }

    this.languageService.changeLanguage(lang);
    this.updateLanguages();
  }
}
