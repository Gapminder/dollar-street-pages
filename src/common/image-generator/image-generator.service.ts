import { Observable } from 'rxjs/Observable';
import { Subject } from  'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageGeneratorService {
  public iconSelector: string = 'logo';
  public headerSelector: string = 'pin-header';
  public streetSelector: string = 'street-container';
  public streetSvgSelector: string = '.street-pinned-box-container svg';
  public placesSelector: string = 'places-container';
  public paragraphSelector: string = 'pin-footer-paragraph';

  public generateImage(): Promise<any> {
    let windowObj: any = window;
    let documentObj: Document = document;

    return new Promise((resolve, reject) => {
      let sourceCanvas = document.createElement('canvas');

      Promise.all([
        // this.getCanvas(windowObj, documentObj.getElementsByClassName(this.iconSelector)[0] as HTMLElement),
        this.getCanvas(windowObj, documentObj.getElementsByClassName(this.headerSelector)[0] as HTMLElement),
        this.getCanvas(windowObj, documentObj.getElementsByClassName(this.placesSelector)[0] as HTMLElement),
        this.getCanvas(windowObj, documentObj.getElementsByClassName(this.streetSelector)[0] as HTMLElement),
        this.getCanvas(windowObj, documentObj.getElementsByClassName(this.paragraphSelector)[0] as HTMLElement)
      ]).then((result) => {
        // let iconCanvas = result[0];
        let headerCanvas = result[0];
        let placesCanvas = result[1];
        let streetCanvas = result[2];
        let paragraphCanvas = result[3];

        sourceCanvas.width = headerCanvas.width;
        sourceCanvas.height = headerCanvas.height + streetCanvas.height + placesCanvas.height + paragraphCanvas.height;

        // let iconImage = iconCanvas.getContext('2d').getImageData(0, 0, 48, 48);
        let headerImage = headerCanvas.getContext('2d').getImageData(0, 0, headerCanvas.width, headerCanvas.height);
        let placesImage = placesCanvas.getContext('2d').getImageData(0, 0, placesCanvas.width, placesCanvas.height);
        // let streetImage = streetCanvas.getContext('2d').getImageData(0, 0, streetCanvas.width, streetCanvas.height);
        let paragraphImage = paragraphCanvas.getContext('2d').getImageData(0, 0, paragraphCanvas.width, paragraphCanvas.height);

        /*sourceCanvas.getContext('2d').putImageData(headerImage, 0, 0);
        // sourceCanvas.getContext('2d').putImageData(iconImage, 10, 10);
        // sourceCanvas.getContext('2d').putImageData(streetImage, 0, headerCanvas.height);
        sourceCanvas.getContext('2d').putImageData(placesImage, 0, headerCanvas.height + streetCanvas.height);
        sourceCanvas.getContext('2d').putImageData(paragraphImage, 0, headerCanvas.height + streetCanvas.height + placesCanvas.height);*/

        this.getStreetCanvas(headerCanvas.width, 64).then((streetCanvas) => {
          let streetImage = streetCanvas.getContext('2d').getImageData(0, 0, streetCanvas.width, streetCanvas.height);

          /*var data = streetImage.data;
          // convert image to grayscale
          var rgbColor = this.hexToRgb('#ffffff');
          for(var p = 0, len = data.length; p < len; p+=4) {
              if(data[p+3] == 0)
                 continue;
              data[p + 0] = rgbColor.r;
              data[p + 1] = rgbColor.g;
              data[p + 2] = rgbColor.b;
              data[p + 3] = 255;
          }*/


          sourceCanvas.getContext('2d').putImageData(headerImage, 0, 0);
          // sourceCanvas.getContext('2d').putImageData(iconImage, 10, 10);
          // sourceCanvas.getContext('2d').putImageData(streetImage, 0, headerCanvas.height);
          sourceCanvas.getContext('2d').putImageData(placesImage, 0, headerCanvas.height);
          sourceCanvas.getContext('2d').putImageData(streetImage, 30, headerCanvas.height + placesCanvas.height);
          sourceCanvas.getContext('2d').putImageData(paragraphImage, 0, headerCanvas.height + streetCanvas.height + placesCanvas.height);

          // document.getElementsByClassName('icon-container')[0].appendChild(sourceCanvas);

          resolve(sourceCanvas.toDataURL('image/jpeg'));
        });
      });
    });
  }

  /*private hexToRgb(color) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      color = color.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : {
          r: 0,
          g: 0,
          b: 0
      };
  }*/

  private getStreetCanvas(width, height): Promise<any> {
    return new Promise((resolve, reject) => {
      let sourceSVG = document.querySelector(this.streetSvgSelector) as HTMLElement;

      let svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);

      let ctx = document.createElement('canvas');
      ctx.width = width;
      ctx.height = height;

      let img = document.createElement("img");

      img.onload = () => {
          ctx.getContext('2d').drawImage(img, 0, 0);
          resolve(ctx);
      }

      img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
    });
  }

  public getCanvas(window: any, element: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      window.html2canvas(element, {
        useCORS: true,
        background: '#fff',
        onrendered: function(canvas) {
          resolve(canvas);
        }
      });
    });
  }
}
