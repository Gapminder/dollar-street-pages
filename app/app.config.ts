let device: {desktop: Function} = require('device.js')();
let isDesktop: boolean = device.desktop();

export interface ImageResolutionInterface {
  image: string;
  expand: string;
  full: string;
}

export class Config {
  // public static api: string = 'https://apidev.dollarstreet.org';
  public static api:string = '//stage.dollarstreet.org';
  // public static api: string = 'http://192.168.1.123';
  // public static api:string = 'http://192.168.1.57';
  // public static api:string = 'http://192.168.1.95';

  private static windowInnerWidth: number = window.innerWidth;

  public static getCoordinates(querySelector: string, cb: any): any {
    let box: any = document.querySelector(querySelector).getBoundingClientRect();

    let body: HTMLElement = document.body;
    let docEl: HTMLElement = document.documentElement;

    let scrollLeft: number = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientLeft: number = docEl.clientLeft || body.clientLeft || 0;

    let top: number = box.top;
    let left: number = box.left + scrollLeft - clientLeft;

    cb({top: Math.round(top), left: Math.round(left), width: box.width, height: box.height});
  }

  public static getImageResolution(): ImageResolutionInterface {
    if (isDesktop) {
      return {
        image: 'devices',
        expand: 'desktops',
        full: 'original'
      };
    }

    if (this.windowInnerWidth < 400) {
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

  public static animateScroll(id: string, inc: number, duration: number): any {
    if (!isDesktop) {
      if (document.body.scrollTop) {
        document.body.scrollTop = 0;
      } else {
        document.documentElement.scrollTop = 0;
      }

      return;
    }

    const elem = document.getElementById(id);
    const startScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const endScroll = elem.offsetTop;
    const step = (endScroll - startScroll) / duration * inc;

    window.requestAnimationFrame(this.goToScroll(step, duration, inc));
  }

  private static goToScroll(step: number, duration: number, inc: number): any {
    return () => {
      const currentDuration = duration - inc;

      this.incScrollTop(step);

      if (currentDuration < inc) {
        return;
      }

      window.requestAnimationFrame(this.goToScroll(step, currentDuration, inc));
    };
  }

  private static incScrollTop(step: number): void {
    if (document.body.scrollTop) {
      document.body.scrollTop += step;
    } else {
      document.documentElement.scrollTop += step;
    }
  }
}
