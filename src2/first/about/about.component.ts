import { Component, OnInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

let tpl = require('./about.template.html');
let style = require('./about.css');

const proportion: number = 1.777;

@Component({
  selector: 'about',
  templateUrl: './about.template.html',
  styleUrls: ['./about.css']
})

export class AboutComponent implements OnInit, OnDestroy {
  private resizeSubscribe: any;
  private element: HTMLElement;
  private videoContainer: HTMLElement;
  private videosIframes: any;
  private zone: NgZone;

  public constructor(element: ElementRef,
                     zone: NgZone) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.videosIframes = this.element.querySelectorAll('.video-container iframe');

    this.setVideosSize();

    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.setVideosSize();
        });
      });
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();
  }

  private setVideosSize(): void {
    if (!this.videosIframes || !this.videosIframes.length) {
      return;
    }

    this.videoContainer = this.element.querySelector('.video-container') as HTMLElement;

    let videoContainerWidth = this.videoContainer.offsetWidth;
    let videoWidth = (videoContainerWidth - 20) / 2;
    let videoHeigth = videoWidth / proportion;

    for (let i = 0; i < this.videosIframes.length; i++) {
      this.videosIframes[i].style.width = videoWidth + 'px';
      this.videosIframes[i].style.height = videoHeigth + 'px';
    }
  }
}
