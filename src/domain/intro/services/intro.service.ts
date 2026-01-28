import { Injectable } from '@nestjs/common';
import { marked } from 'marked';
import fs from 'fs';
import { wrapHtml } from 'src/common/helpers/wrapHtml.helper';

@Injectable()
export class IntroService {
  getIntro(): string {
    const markdown = fs.readFileSync('README.md', 'utf-8');
    return wrapHtml(marked(markdown), 'Notes');
  }
}
