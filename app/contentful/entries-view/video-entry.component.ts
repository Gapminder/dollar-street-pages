import {Component, Input} from '@angular/core';

@Component({
  selector: 'gm-video-entry',
  styles: [require('./video-entry.css') as string],
  template: `
    <div class="video-wrapper">
      <iframe
        src="{{ entry.fields.youtube || entry.fields.vimeo }}"
        frameborder="0" 
        webkitallowfullscreen="" 
        mozallowfullscreen="" 
        allowfullscreen="">
      </iframe>
    </div>
  `
})
// TODO: Substitute VideoEntryComponent with EmbeddedEntryComponent (later is more generic and allows to embed various types of content)
export class VideoEntryComponent {
  @Input()
  protected entry:any;
}
