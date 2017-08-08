import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { ImageResolutionInterface } from '../interfaces';

@Component({
    template: ''
})
export class BlankComponent {}

export class LoaderServiceMock {
    public setLoader(b: boolean): boolean {
        return b;
    }
}

export class LanguageServiceMock {
    public  getLanguageParam (): string {
        return '&lang=en';
    }

    public getLanguageIso(): string {
        return 'en_EN';
    }

    public getTranslation(key: string | string[]): Observable<any> {
        if (typeof key === 'string') {
            let value: string = void 0;

            switch(key) {
                case 'ABOUT': {
                    value = 'About';
                    break;
                }

                case 'WORLD': {
                    value = 'World';
                    break;
                }
            }

            return Observable.of(value);
        } else if (typeof key === 'object') {
            return Observable.of({ABOUT: 'About', WORLD: 'World'});
        }
    }

    public getSunitizedString(key: string): string {
        return 'THIS_IS_SANITIZED_STRING';
    }
}

export class TitleHeaderServiceMock {
    // tslint:disable-next-line
    public setTitle(title: string): void {}
}

export class StreetSettingsServiceMock {
    public getStreetSettings(): Observable<any> {
        let context: any = {_id:'57963211cc4aaed63a02504c',showDividers:false,low:30,medium:300,high:3000,poor:26,rich:15000,lowDividerCoord:78,mediumDividerCoord:490,highDividerCoord:920,__v:0};
        let response: any = {success:true,error:false,msg:[],data:context};

        return Observable.of(response);
    }
}

export class AngularticsMock {
    // tslint:disable-next-line
    public eventTrack(name: string, param: any): void {}
}

export class Angulartics2GoogleAnalyticsMock {

}

export class UtilsServiceMock {
    public getImageResolution(isDesktop: boolean): ImageResolutionInterface {
        if (isDesktop) {
            return {
                image: '480x480',
                expand: 'desktops',
                full: 'original'
            };
        }
    }
}

export class BrowserDetectionServiceMock {
    public userAgent: string = 'chrome';

    public isDesktop(): boolean {
        return true;
    }

    public isMobile(): boolean {
        return false;
    }

    public isTablet(): boolean {
        return false;
    }
}