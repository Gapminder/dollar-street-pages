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
  @Input()
  public languages: any;

  public disabled: boolean = false;
  public status: {isOpen: boolean} = {isOpen: false};
  public languageService: LanguageService;
  public element: HTMLElement;
  public window: Window = window;

  public constructor(languageService: LanguageService,
                     element: ElementRef) {
    this.element = element.nativeElement;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public changeLanguage(lang: string): void {
    if (this.languageService.currentLanguage === lang) {
      return;
    }

    this.languageService.changeLanguage(lang);
  }
}
