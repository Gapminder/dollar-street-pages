import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';

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
       return 'EN';
    }

    public getTranslation(): Observable<any> {
       return Observable.of('the world');
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