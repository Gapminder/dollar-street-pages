import { Injectable } from '@angular/core';

import { ImageResolutionInterface } from '../../interfaces';

@Injectable()
export class UtilsService {
  public window: Window = window;
  public document: Document = document;

  public getCoordinates(querySelector: string, cb: any): void {
    let box: any = this.document.querySelector(querySelector).getBoundingClientRect();

    let body: HTMLElement = this.document.body;
    let docEl: HTMLElement = this.document.documentElement;

    let scrollLeft: number = this.window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientLeft: number = docEl.clientLeft || body.clientLeft || 0;

    let top: number = box.top;
    let left: number = box.left + scrollLeft - clientLeft;

    cb({top: Math.round(top), left: Math.round(left), width: box.width, height: box.height});
  }

  public getImageResolution(isDesktop: boolean): ImageResolutionInterface {
    if (isDesktop) {
      return {
        image: '480x480',
        expand: 'desktops',
        full: 'original'
      };
    }

    if (this.window.innerWidth < 400) {
      return {
        image: '150x150',
        expand: 'devices',
        full: 'tablets'
      };
    }

    return {
      image: 'thumb',
      expand: 'tablets',
      full: 'desktops'
    };
  }

  public animateScroll(id: string, inc: number, duration: number, isDesktop: boolean): any {
    if (!isDesktop) {
      if (this.document.body.scrollTop) {
        this.document.body.scrollTop = 0;
      } else {
        this.document.documentElement.scrollTop = 0;
      }

      return;
    }

    const elem = this.document.getElementById(id);
    const startScroll = this.document.body.scrollTop || this.document.documentElement.scrollTop;
    const endScroll = elem.offsetTop;
    const step = (endScroll - startScroll) / duration * inc;

    this.window.requestAnimationFrame(this.goToScroll(step, duration, inc));
  }

  public goToScroll(step: number, duration: number, inc: number): any {
    return () => {
      const currentDuration = duration - inc;

      this.incScrollTop(step);

      if (currentDuration < inc) {
        return;
      }

      window.requestAnimationFrame(this.goToScroll(step, currentDuration, inc));
    };
  }

  public incScrollTop(step: number): void {
    if (this.document.body.scrollTop) {
      this.document.body.scrollTop += step;
    } else {
      this.document.documentElement.scrollTop += step;
    }
  }

  public parseUrl(url: string): any {
    url = url.slice(url.indexOf('?') + 1);

    let params = JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);

    if (params.regions) {
      params.regions = params.regions.split(',');
    }

    if (params.countries) {
      params.countries = params.countries.split(',');
    }

    return params;
  }

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }
}
