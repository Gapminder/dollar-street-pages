import { Injectable } from '@angular/core';

@Injectable()
export class BrowserDetectionService {
  private window: Window = window;
  private userAgent: string = this.window.navigator.userAgent.toLowerCase();

  public isMobile(): boolean {
    return this.androidPhone() || this.iphone() || this.ipod() || this.windowsPhone() || this.blackberryPhone() || this.fxosPhone() || this.meego();
  };

  public isTablet(): boolean {
    return this.ipad() || this.androidTablet() || this.blackberryTablet() || this.windowsTablet() || this.fxosTablet();
  };

  public isDesktop(): boolean {
    return !this.isTablet() && !this.isMobile();
  };

  private find(needle: string): boolean {
    return this.userAgent.indexOf(needle) !== -1;
  }

  private iphone(): boolean {
    return this.find('iphone');
  };

  private ipod(): boolean {
    return this.find('ipod');
  };

  private ipad(): boolean {
    return this.find('ipad');
  };

  private android(): boolean {
    return this.find('android');
  };

  private androidPhone(): boolean {
    return this.android() && this.find('mobile');
  };

  private androidTablet(): boolean {
    return this.android() && !this.find('mobile');
  };

  private blackberry(): boolean {
    return this.find('blackberry') || this.find('bb10') || this.find('rim');
  };

  private blackberryPhone(): boolean {
    return this.blackberry() && !this.find('tablet');
  };

  private blackberryTablet(): boolean {
    return this.blackberry() && this.find('tablet');
  };

  private windows(): boolean {
    return this.find('windows');
  };

  private windowsPhone(): boolean {
    return this.windows() && this.find('phone');
  };

  private windowsTablet(): boolean {
    return this.windows() && (this.find('touch') && !this.windowsPhone());
  };

  private fxos(): boolean {
    return (this.find('(mobile;') || this.find('(tablet;')) && this.find('; rv:');
  };

  private fxosPhone(): boolean {
    return this.fxos() && this.find('mobile');
  };

  private fxosTablet(): boolean {
    return this.fxos() && this.find('tablet');
  };

  private meego(): boolean {
    return this.find('meego');
  };
}
