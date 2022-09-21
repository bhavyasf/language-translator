import { JSDOM } from "jsdom";
import { TranslateProvider } from "../enums";
import { AwsTranslateService } from "./aws-translate.service";
const { Node } = new JSDOM("").window;

export class JsDomService {
  private async detectAndTranslateText(
    element: ChildNode,
    targetLanguage: string,
    provider: TranslateProvider
  ): Promise<void> {
    const { textContent } = element;
    if (provider === TranslateProvider.AWS) {
      const awsTranslate = new AwsTranslateService(
        process.env.AWS_ACCESS_KEY_ID as string,
        process.env.AWS_SECRET_KEY_ID as string,
        process.env.AWS_REGION as string
      );
      const dominantLanguage = await awsTranslate.detectDominantLanguage(
        String(textContent)
      );
      if (dominantLanguage !== targetLanguage) {
        const translatedText = await awsTranslate.translateText(
          String(textContent),
          dominantLanguage,
          targetLanguage
        );
        element.textContent = translatedText;
      }
    } else {
      throw new Error("Provider not supported currently!");
    }
  }
  private async iterateTextNodes(
    elements: NodeListOf<ChildNode>,
    targetLanguage: string,
    translationJobs: Promise<void>[],
    provider: TranslateProvider
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    elements.forEach(async (element) => {
      if (element.childNodes) {
        await this.iterateTextNodes(
          element.childNodes,
          targetLanguage,
          translationJobs,
          provider
        );
      }
      if (element.textContent && element.nodeType === Node.TEXT_NODE) {
        translationJobs.push(
          this.detectAndTranslateText(element, targetLanguage, provider)
        );
      }
    });
  }

  async translateText(
    text: string,
    targetLanguage: string,
    provider: TranslateProvider
  ) {
    const { document } = new JSDOM(text).window;
    const translationJobs: Promise<void>[] = [];
    await this.iterateTextNodes(
      document.body.childNodes,
      targetLanguage,
      translationJobs,
      provider
    );
    await Promise.all(translationJobs);
    return document.body.innerHTML;
  }
}
