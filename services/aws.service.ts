import {Comprehend, Translate} from 'aws-sdk';

  export class AwsTranslateService {
    translateClient: Translate;
    languageDetectorClient: Comprehend;
    constructor(
     accessKeyId: string,
     secretAccessKey: string,
     region = 'us-east-1'
    ) {
        this.translateClient = new Translate({
          accessKeyId,
          secretAccessKey,
          region,
        });
        this.languageDetectorClient = new Comprehend({
            accessKeyId,
            secretAccessKey,
            region,
        });
    }
        async detectDominantLanguage(text: string): Promise<string> {
          const {Languages} = await this.languageDetectorClient
            .detectDominantLanguage({
              Text: text,
            })
            .promise();
          let dominantLanguage = '';
          let maxScore = 0;
          Languages?.forEach(language => {
            const {Score = 0, LanguageCode} = language;
            if (Score > maxScore) {
              maxScore = Score;
              dominantLanguage = String(LanguageCode);
            }
          });
          return dominantLanguage;
        }
        async translateText(
          text: string,
          sourceLanguageCode: string,
          targetLanguageCode: string,
        ): Promise<string> {
          const {TranslatedText} = await this.translateClient
            .translateText({
              Text: text,
              SourceLanguageCode: sourceLanguageCode,
              TargetLanguageCode: targetLanguageCode,
            })
            .promise();
          return TranslatedText;
        }
    }
  