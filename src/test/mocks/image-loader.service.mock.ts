import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoadedServiceMock {
  public imageLoaded(url: string): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
      resolve(true);
    });
  }
}
