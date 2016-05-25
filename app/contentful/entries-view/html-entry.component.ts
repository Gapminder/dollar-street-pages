import {Component, ViewEncapsulation, Input} from '@angular/core';
import {MarkdownPipe} from '../pipes/markdown.pipe';

@Component({
  selector: 'gm-html-entry',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="block-entry" [innerHTML]="entry.fields.content | gmMarkdown"></div>
  `,
  styles: [require('./entries-html.css') as string],
  pipes: [MarkdownPipe]
})

export class HtmlEntryComponent {
  // noinspection TsLint
  @Input() private entry;
}
