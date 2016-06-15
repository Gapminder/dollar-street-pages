import {Component, Input, OnInit} from '@angular/core';
import {VideoEntryComponent} from './video-entry.component';
import {HtmlEntryComponent} from './html-entry.component';
import {ContentfulConfig} from '../constans';
import {EmbeddedEntryComponent} from './embedded-entry.component';

@Component({
  selector: 'gm-entries-view',
  template: `
    <div *ngFor="let entry of entries">
      <gm-video-entry *ngIf="entry.isVideo" [entry]="entry"></gm-video-entry>
      <gm-html-entry *ngIf="entry.isHtml" [entry]="entry"></gm-html-entry>
      <gm-embedded-entry *ngIf="entry.isEmbedded" [entry]="entry"></gm-embedded-entry>
    </div>
  `,
  directives: [VideoEntryComponent, HtmlEntryComponent, EmbeddedEntryComponent]
})

export class EntriesViewComponent implements OnInit {
  @Input()
  protected entries:any[];

  public ngOnInit():void {
    for (let entry of this.entries) {
      entry.isVideo = this.resolveType(entry, ContentfulConfig.VIDEO_CONTENT_ID);
      entry.isEmbedded = this.resolveType(entry, ContentfulConfig.EMBEDDED_CONTENT_ID);
      entry.isHtml = this.resolveType(entry, ContentfulConfig.HTML_CONTENT_ID);
    }
    return;
  }

  // TODO not optimal solution
  public resolveType(entry:any, id:string):boolean {
    return entry.sys.contentType.sys.id === id;
  }
}
