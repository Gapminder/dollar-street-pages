import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { LoaderService,
         TitleHeaderService,
         LanguageService,
         BrowserDetectionService,
         UtilsService } from '../common';

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

    public device: BrowserDetectionService;
    public loaderService: LoaderService;
    public donateService: DonateService;
    public utilsService: UtilsService;
    public titleHeaderService: TitleHeaderService;
    public languageService: LanguageService;
    public sanitizer: DomSanitizer;
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

    public constructor(loaderService: LoaderService,
                       donateService: DonateService,
                       titleHeaderService: TitleHeaderService,
                       languageService: LanguageService,
                       utilsService: UtilsService,
                       browserDetectionService: BrowserDetectionService,
                       sanitizer: DomSanitizer) {
        this.loaderService = loaderService;
        this.donateService = donateService;
        this.titleHeaderService = titleHeaderService;
        this.languageService = languageService;
        this.device = browserDetectionService;
        this.utilsService = utilsService;
        this.sanitizer = sanitizer;
    }

    public ngOnInit(): void {
        this.loaderService.setLoader(true);

        this.getTranslationSubscribe = this.languageService.getTranslation(['DONATE', 'DONATE_DESCRIPTION']).subscribe((trans: any) => {
            this.titleHeaderService.setTitle(trans.DONATE);

            this.donateDescription = this.languageService.getSunitizedString(trans.DONATE_DESCRIPTION);
        });
    }

    public ngOnDestroy(): void {
        this.loaderService.setLoader(false);
        this.getTranslationSubscribe.unsubscribe();
    }

    public ngAfterViewInit(): void {
        this.addStripeScript();
    }

    public showAboutPopUp(): void {
        let aboutDataContainer = this.aboutDialog.nativeElement as HTMLElement;
        let targetElement = document.querySelector('.container') as HTMLElement;

        this.utilsService.getCoordinates(`.${targetElement.className}`, (data: any) => {
            this.aboutDataPosition.left = data.left - aboutDataContainer.clientWidth + 28;
            this.aboutDataPosition.top = data.top + 28;

            this.aboutDataPosition.windowHeight = this.window.innerHeight - 60;
            this.aboutDataPosition.windowWidth = this.device.isMobile() ? this.window.innerWidth - 20 : 380;

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
