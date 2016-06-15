import {Pipe, PipeTransform} from '@angular/core';

let marked = require('marked');

@Pipe({
  name: 'gmMarkdown'
})

export class MarkdownPipe implements PipeTransform {
  public transform(value: any): string {
    return marked(value);
  }
}
