import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizationService, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'gm-video-entry',
  styles: [require('./video-entry.css') as string],
  template: `
    <div class="video-wrapper" *ngIf="url">
      <iframe
        [src]="url"
        frameborder="0" 
        webkitallowfullscreen="" 
        mozallowfullscreen="" 
        allowfullscreen="">
      </iframe>
    </div>
  `
})
// TODO: Substitute VideoEntryComponent with EmbeddedEntryComponent (later is more generic and allows to embed various types of content)
export class VideoEntryComponent implements OnInit {
  @Input()
  protected entry:any;
  protected url:SafeResourceUrl;

  private sanitationService:DomSanitizationService;

  public constructor(@Inject(DomSanitizationService) sanitationService:DomSanitizationService) {
    this.sanitationService = sanitationService;
  }

  public ngOnInit():void {
    if (this.entry.fields.youtube || this.entry.fields.vimeo) {
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(this.entry.fields.youtube || this.entry.fields.vimeo);
    }
  }
}
