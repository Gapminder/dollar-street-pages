import { Injectable } from '@angular/core';

@Injectable()
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
