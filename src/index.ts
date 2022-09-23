export * from './interfaces';
export * from './services';

import { TextType, TranslateProvider } from "./interfaces";
import { JsDomService, MarkdownService } from "./services";
require('dotenv').config();

export class LanguageTranslateService {
  translate(
    text: string,
    targetLanguage: string,
    textType: TextType,
    provider: TranslateProvider
  ) {
    if ([TextType.HTML, TextType.Markdown].includes(textType)) {
      const jsDomService = new JsDomService();
      return jsDomService.translateText(text, targetLanguage, provider);
    } else if (textType === TextType.Markdown) {
      const markdownService = new MarkdownService();
      return markdownService.translateText(text, targetLanguage, provider);
    } else {
      throw new Error(`Text type should be one of ${Object.keys(TextType)}`);
    }
  }
}
