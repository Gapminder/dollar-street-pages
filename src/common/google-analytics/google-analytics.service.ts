import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {
    public document: Document = document;
    public window: Window = window;
    public elementTagName: string = 'script';
    public googleAnalyticsInstance: any;

    public googleAnalyticsContent(): void {
        // let wnd: any = (this.window as any);
        // const ga: string = 'ga';
        // let date: Date = new Date();
        //
        // wnd.GoogleAnalyticsObject = ga;
        //
        // let func: Function = (args: any) => {
        //     (wnd.ga.q = wnd.ga.q || []).push(args);
        // };
        //
        // wnd.ga = wnd.ga || func;
        //
        // wnd.ga.l = 1 * date.getDate();
        //
        // let js: HTMLElement = this.document.createElement(this.elementTagName);
        // js.setAttribute('async', '1');
        // js.setAttribute('src', '//www.google-analytics.com/analytics.js');
        //
        // let elem: HTMLElement = this.document.getElementsByTagName(this.elementTagName)[0] as HTMLElement;
        // elem.parentNode.insertBefore(js,elem);
        //
        // wnd.ga('create', 'UA-82755634-1', 'DollarStreet');
        //
        // this.googleAnalyticsInstance = this.googleAnalyticsInstance || [];
        //
        // this.googleAnalyticsInstance.push(['DollarStreet.create', 'UA-82755634-1']);
    }
}
