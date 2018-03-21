import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class ImageLoadedService {
  constructor(private zone: NgZone){}

  imageLoaded(url: string): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.zone.run( () => resolve(true));
      };
      img.onerror = () => reject;
      img.src = url;
    });
  }
}
