import {Component, Input} from '@angular/core';

@Component({
  selector: 'gm-embedded-entry',
  styles: [require('./video-entry.css')],
  template: `
    <div class="video-wrapper">
      <iframe
        src="{{entry.fields.link}}"
        frameborder="0" 
        webkitallowfullscreen="" 
        mozallowfullscreen="" 
        allowfullscreen="">
      </iframe>
    </div>`
})

export class EmbeddedEntryComponent {
  @Input()
  protected entry:any;
}
