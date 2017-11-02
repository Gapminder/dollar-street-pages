import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import {
  LoaderService,
  TitleHeaderService,
  LanguageService,
  BrowserDetectionService,
  UtilsService
} from '../common';
import { DonateService } from './donate.service';

@Component({
  selector: 'donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('donateValue')
    public donateValue: ElementRef;
    @ViewChild('aboutDialog')
    public aboutDialog: ElementRef;
    @ViewChild('addAmount')
    public addAmount: ElementRef;

    public getTranslationSubscribe: Subscription;
    public document: Document = document;
    public window: Window = window;
    public siteName: string = 'Dollar Street';
    public siteDescription: string = 'See how people really live';
    public donateDescription: SafeHtml;
    public isShowAboutData: boolean;
    public isShowAboutDataFullScreen: boolean;
    public maxHeightPopUp: number;
    public aboutDataPosition: any = {};
    public elementTagName: string = 'script';
    public scriptAdded: boolean = false;
    public addAmountTrans: string;
    public element: HTMLElement;

    public constructor(private loaderService: LoaderService,
                       private donateService: DonateService,
                       private titleHeaderService: TitleHeaderService,
                       private languageService: LanguageService,
                       private utilsService: UtilsService,
                       private browserDetectionService: BrowserDetectionService,
                       private sanitizer: DomSanitizer,
                       private elementRef: ElementRef) {
        this.element = this.elementRef.nativeElement;
    }

    public ngOnInit(): void {
        this.loaderService.setLoader(true);

        this.getTranslationSubscribe = this.languageService.getTranslation(['DONATE', 'DONATE_DESCRIPTION', 'ADD_AMOUNT']).subscribe((trans: any) => {
            this.titleHeaderService.setTitle(trans.DONATE);

            this.donateDescription = this.languageService.getSunitizedString(trans.DONATE_DESCRIPTION);

            this.addAmountTrans = trans.ADD_AMOUNT;
        });
    }

    public ngOnDestroy(): void {
        this.loaderService.setLoader(false);
        this.getTranslationSubscribe.unsubscribe();
    }

    public ngAfterViewInit(): void {
        this.addStripeScript();

        let addAmount = this.element.querySelector('.add-amount');
    }

    public onAddAmountClick(): void {
        let addAmount = this.addAmount.nativeElement;
        addAmount.style.visibility = 'hidden';

        this.donateValue.nativeElement.focus();
    }

    public onAmountBlur(): void {
      let addAmount = this.addAmount.nativeElement;
      addAmount.style.visibility = 'visible';
    }

    public showAboutPopUp(): void {
        let aboutDataContainer = this.aboutDialog.nativeElement as HTMLElement;
        let targetElement = document.querySelector('.container') as HTMLElement;

        this.utilsService.getCoordinates(`.${targetElement.className}`, (data: any) => {
            this.aboutDataPosition.left = data.left - aboutDataContainer.clientWidth + 28;
            this.aboutDataPosition.top = data.top + 28;

            this.aboutDataPosition.windowHeight = this.window.innerHeight - 60;
            this.aboutDataPosition.windowWidth = this.browserDetectionService.isMobile() ? this.window.innerWidth - 20 : 380;

            this.isShowAboutData = true;
            this.isShowAboutDataFullScreen = true;
        });
    }

    public addStripeScript(): void {
        if (this.scriptAdded) {
            return;
        }

        this.scriptAdded = true;

        let fjs: HTMLElement = this.document.getElementsByTagName(this.elementTagName)[0] as HTMLElement;

        let js: HTMLElement = this.document.createElement(this.elementTagName) as HTMLElement;
        js.setAttribute('src', 'https://checkout.stripe.com/checkout.js');

        fjs.parentNode.insertBefore(js, fjs);
    }

    public closeAboutPopUp(event: MouseEvent): void {
        let el = event && event.target as HTMLElement;

        if (el.className.indexOf('closeMenu') !== -1) {
            this.isShowAboutData = false;
            this.isShowAboutDataFullScreen = false;
        }
    }

    public purchaseClicked(value: number | string): void {
        if(!value) {
            value = this.donateValue.nativeElement.value;

            if (!value) {
                return;
            }
        }

        this.donateService.showStripeDialog({
            name: this.siteName,
            description: this.siteDescription,
            amount: +value * 100
        }, this.showAboutPopUp.bind(this));
    }
}
