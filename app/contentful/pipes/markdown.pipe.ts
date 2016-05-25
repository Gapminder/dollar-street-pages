import {Pipe, PipeTransform} from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'gmMarkdown'
})
export class MarkdownPipe implements PipeTransform {
  public transform(value: any): string {
    return marked(value);
  }
}
