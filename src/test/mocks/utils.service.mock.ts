import { ImageResolutionInterface } from '../../interfaces';
import { Injectable } from '@angular/core';

@Injectable()
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

  public parseUrl(url: string): any {
    return {
      thing: 'Families',
      countries: ['World'],
      regions: ['World']
    };
  }

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  public getCoordinates(querySelector: string, cb: any): void {
  }
}
