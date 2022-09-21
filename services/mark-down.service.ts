import {JsDomService} from '.';
import MarkdownIt from 'markdown-it';
import {NodeHtmlMarkdown} from 'node-html-markdown';
import { TranslateProvider } from '../interfaces';

export class MarkdownService {
  markdownItClient: any;
  nodeHtmlMarkdownClient: NodeHtmlMarkdown;
  jsDomService: JsDomService;
  constructor(
  ) {
    this.markdownItClient = new MarkdownIt();
    this.nodeHtmlMarkdownClient = new NodeHtmlMarkdown();
    this.jsDomService = new JsDomService();
  }
  async translateText(text: string, targetLanguage: string, provider: TranslateProvider) {
    const htmlText = this.markdownItClient.render(text);
    const translatedText = await this.jsDomService.translateText(
      htmlText,
      targetLanguage,
      provider
    );
    return this.nodeHtmlMarkdownClient.translate(translatedText);
  }
}
