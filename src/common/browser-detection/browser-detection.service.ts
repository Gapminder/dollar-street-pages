import { Injectable } from '@angular/core';

@Injectable()
export class BrowserDetectionService {
  public window: Window = window;
  public userAgent: string = this.window.navigator.userAgent.toLowerCase();

  public isMobile(): boolean {
    return this.androidPhone() || this.iphone() || this.ipod() || this.windowsPhone() || this.blackberryPhone() || this.fxosPhone() || this.meego();
  };

  public isTablet(): boolean {
    return this.ipad() || this.androidTablet() || this.blackberryTablet() || this.windowsTablet() || this.fxosTablet();
  };

  public isDesktop(): boolean {
    return !this.isTablet() && !this.isMobile();
  };

  public find(needle: string): boolean {
    return this.userAgent.indexOf(needle) !== -1;
  }

  public iphone(): boolean {
    return this.find('iphone');
  };

  public ipod(): boolean {
    return this.find('ipod');
  };

  public ipad(): boolean {
    return this.find('ipad');
  };

  public android(): boolean {
    return this.find('android');
  };

  public androidPhone(): boolean {
    return this.android() && this.find('mobile');
  };

  public androidTablet(): boolean {
    return this.android() && !this.find('mobile');
  };

  public blackberry(): boolean {
    return this.find('blackberry') || this.find('bb10') || this.find('rim');
  };

  public blackberryPhone(): boolean {
    return this.blackberry() && !this.find('tablet');
  };

  public blackberryTablet(): boolean {
    return this.blackberry() && this.find('tablet');
  };

  public windows(): boolean {
    return this.find('windows');
  };

  public windowsPhone(): boolean {
    return this.windows() && this.find('phone');
  };

  public windowsTablet(): boolean {
    return this.windows() && (this.find('touch') && !this.windowsPhone());
  };

  public fxos(): boolean {
    return (this.find('(mobile;') || this.find('(tablet;')) && this.find('; rv:');
  };

  public fxosPhone(): boolean {
    return this.fxos() && this.find('mobile');
  };

  public fxosTablet(): boolean {
    return this.fxos() && this.find('tablet');
  };

  public meego(): boolean {
    return this.find('meego');
  };
}
