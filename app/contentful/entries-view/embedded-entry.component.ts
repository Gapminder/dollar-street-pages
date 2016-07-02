import {Component, OnInit, Input, Inject} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'gm-embedded-entry',
  styles: [require('./video-entry.css')],
  template: `
    <div class="video-wrapper" *ngIf="url">
      <iframe
        [src]="url"
        frameborder="0"
        webkitallowfullscreen="" 
        mozallowfullscreen="" 
        allowfullscreen="">
      </iframe>
    </div>`
})

export class EmbeddedEntryComponent implements OnInit {
  @Input()
  protected entry:any;
  protected url:SafeResourceUrl;

  private sanitationService:DomSanitizationService;

  public constructor(@Inject(DomSanitizationService) sanitationService:DomSanitizationService) {
    this.sanitationService = sanitationService;
  }

  public ngOnInit():void {
    if (this.entry.fields.link) {
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(this.entry.fields.link);
    }
  }
}
